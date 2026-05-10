require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path    = require('path');
const bcrypt  = require('bcrypt');
const db      = require('./config/db');
const app     = express();

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware global
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret:            process.env.SESSION_SECRET || 'ftisurvey2026',
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 jam
}));

// Kirim data user ke semua views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Auto-insert akun admin saat server pertama kali jalan
function setupAdmin() {
  db.query(
    'SELECT * FROM users WHERE username = ?',
    ['admin'],
    (err, results) => {
      if (err || results.length > 0) return;

      bcrypt.hash('admin123', 10, (err, hash) => {
        if (err) return;
        db.query(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          ['admin', hash, 'admin'],
          (err) => {
            if (!err) console.log('✅ Akun admin dibuat: admin / admin123');
          }
        );
      });
    }
  );
}

// Jalankan setup admin setelah konek DB
setTimeout(setupAdmin, 1000);

// Routes
const authRoute   = require('./routes/auth');
const surveyRoute = require('./routes/survey');
const adminRoute  = require('./routes/admin');

app.use('/', authRoute);
app.use('/survey', surveyRoute);
app.use('/admin', adminRoute);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
