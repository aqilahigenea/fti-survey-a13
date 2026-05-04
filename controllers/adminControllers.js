const connection = require('../db/connection');
const PDFDocument = require('pdfkit');
const { Parser }  = require('json2csv');

// ─── Dashboard Admin ─────────────────────────────────────────────────────────
const dashboard = (req, res) => {
  // Ambil semua survey beserta jumlah respondennya
  const sql = `
    SELECT
      s.id,
      s.title,
      s.status,
      s.created_at,
      COUNT(r.id) AS total_responden
    FROM surveys s
    LEFT JOIN responses r ON s.id = r.survey_id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;

  connection.query(sql, (err, surveys) => {
    if (err) return res.status(500).send('Terjadi kesalahan server.');
    res.render('admin/dashboard', { surveys });
  });
};

// ─── Lihat Hasil Survey ──────────────────────────────────────────────────────
const hasilSurvey = (req, res) => {
  const surveyId = req.params.id;

  // Ambil data survey
  const sqlSurvey = 'SELECT * FROM surveys WHERE id = ?';

  connection.query(sqlSurvey, [surveyId], (err, surveys) => {
    if (err)             return res.status(500).send('Terjadi kesalahan server.');
    if (!surveys.length) return res.status(404).send('Survey tidak ditemukan.');

    const survey = surveys[0];

    // Ambil semua pertanyaan
    const sqlQuestions = `
      SELECT * FROM questions
      WHERE survey_id = ?
      ORDER BY question_order ASC
    `;

    connection.query(sqlQuestions, [surveyId], (err, questions) => {
      if (err) return res.status(500).send('Terjadi kesalahan server.');

      const questionIds = questions.map(q => q.id);

      if (questionIds.length === 0) {
        return res.render('admin/hasil', {
          survey,
          questions: [],
          totalResponden: 0
        });
      }

      // Ambil semua jawaban beserta data user
      const sqlAnswers = `
        SELECT
          a.question_id,
          a.answer_text,
          a.option_id,
          o.option_text,
          u.name  AS nama_user,
          u.email AS email_user
        FROM answers a
        JOIN responses r  ON a.response_id = r.id
        JOIN users u      ON r.user_id     = u.id
        LEFT JOIN options o ON a.option_id = o.id
        WHERE a.question_id IN (?)
      `;

      connection.query(sqlAnswers, [questionIds], (err, answers) => {
        if (err) return res.status(500).send('Terjadi kesalahan server.');

        // Ambil options untuk multiple choice
        const sqlOptions = 'SELECT * FROM options WHERE question_id IN (?)';

        connection.query(sqlOptions, [questionIds], (err, options) => {
          if (err) return res.status(500).send('Terjadi kesalahan server.');

          // Gabungkan data ke tiap pertanyaan
          const questionsWithData = questions.map(q => {
            const qAnswers = answers.filter(a => a.question_id === q.id);
                       const qOptions = options.filter(o => o.question_id === q.id);

            // Hitung distribusi jawaban untuk multiple choice
            const distribusi = qOptions.map(opt => ({
              option_text : opt.option_text,
              jumlah      : qAnswers.filter(a => a.option_id === opt.id).length
            }));

            return {
              ...q,
              options   : qOptions,
              answers   : qAnswers,
              distribusi: distribusi
            };
          });

          // Hitung total responden
          const sqlTotal = `
            SELECT COUNT(*) AS total
            FROM responses
            WHERE survey_id = ?
          `;

          connection.query(sqlTotal, [surveyId], (err, totalResult) => {
            if (err) return res.status(500).send('Terjadi kesalahan server.');

            res.render('admin/hasil', {
              survey,
              questions     : questionsWithData,
              totalResponden: totalResult[0].total
            });
          });
        });
      });
    });
  });
};

// ─── Export PDF ──────────────────────────────────────────────────────────────
const exportPdf = (req, res) => {
  const surveyId = req.params.id;

  const sqlSurvey = 'SELECT * FROM surveys WHERE id = ?';

  connection.query(sqlSurvey, [surveyId], (err, surveys) => {
    if (err || !surveys.length) return res.status(404).send('Survey tidak ditemukan.');

    const survey = surveys[0];

    // Ambil semua jawaban mentah
    const sqlData = `
      SELECT
        u.name        AS nama_user,
        u.email       AS email_user,
        q.question_text,
        a.answer_text,
        o.option_text,
        r.submitted_at
      FROM responses r
      JOIN users u    ON r.user_id     = u.id
      JOIN answers a  ON a.response_id = r.id
      JOIN questions q ON a.question_id = q.id
      LEFT JOIN options o ON a.option_id = o.id
      WHERE r.survey_id = ?
      ORDER BY r.submitted_at ASC
    `;

    connection.query(sqlData, [surveyId], (err, data) => {
      if (err) return res.status(500).send('Terjadi kesalahan server.');

      // Hitung total responden unik
      const totalResponden = new Set(data.map(row => row.email_user)).size;

      // Buat PDF
      const doc = new PDFDocument({ margin: 50 });

      // Set header response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=hasil-survey-${surveyId}.pdf`
      );

      doc.pipe(res);

      // Isi PDF
      doc.fontSize(18).font('Helvetica-Bold').text(`Hasil Survey: ${survey.title}`, {
        align: 'center'
      });
      doc.moveDown();
      doc.fontSize(11).font('Helvetica').text(`Total Responden: ${totalResponden} orang`);
      doc.moveDown();

      // Tulis data per baris
      let currentUser = '';
      data.forEach(row => {
        if (row.nama_user !== currentUser) {
          doc.moveDown();
          doc.fontSize(11).font('Helvetica-Bold')
             .text(`Responden: ${row.nama_user} (${row.email_user})`);
          doc.fontSize(10).font('Helvetica')
             .text(`Waktu Submit: ${new Date(row.submitted_at).toLocaleString('id-ID')}`);
          doc.moveDown(0.5);
          currentUser = row.nama_user;
        }

        const jawaban = row.option_text || row.answer_text || '-';
        doc.fontSize(10).font('Helvetica')
           .text(`• ${row.question_text}`, { continued: false })
           .text(`  Jawaban: ${jawaban}`);
      });

      doc.end();
    });
  });
};

// ─── Export CSV ──────────────────────────────────────────────────────────────
const exportCsv = (req, res) => {
  const surveyId = req.params.id;

  const sqlData = `
    SELECT
      u.name        AS nama_user,
      u.email       AS email_user,
      q.question_text AS pertanyaan,
      COALESCE(o.option_text, a.answer_text) AS jawaban,
      r.submitted_at AS waktu_submit
    FROM responses r
    JOIN users u     ON r.user_id      = u.id
    JOIN answers a   ON a.response_id  = r.id
    JOIN questions q ON a.question_id  = q.id
    LEFT JOIN options o ON a.option_id = o.id
    WHERE r.survey_id = ?
    ORDER BY r.submitted_at ASC
  `;

  connection.query(sqlData, [surveyId], (err, data) => {
    if (err) return res.status(500).send('Terjadi kesalahan server.');

    if (data.length === 0) {
      return res.status(404).send('Belum ada data jawaban untuk survey ini.');
    }

    // Convert ke CSV
    const fields = ['nama_user', 'email_user', 'pertanyaan', 'jawaban', 'waktu_submit'];
    const parser = new Parser({ fields });
    const csv    = parser.parse(data);

    // Set header response
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=hasil-survey-${surveyId}.csv`
    );

    res.send(csv);
  });
};

module.exports = { dashboard, hasilSurvey, exportPdf, exportCsv };