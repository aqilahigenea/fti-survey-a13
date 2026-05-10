# FTI Survey — Modul A13 (Pengisian Survey)

Aplikasi web survey online untuk civitas akademika Fakultas Teknologi Informasi. Modul A13 mencakup fitur pengisian survey oleh pengguna dan pengelolaan hasil survey oleh admin.

---

## 👥 Anggota Kelompok

| Nama | NIM | Tanggung Jawab |
|------|-----|----------------|
| Arifah Huwaina Azre | 2411521003 | Halaman pengguna (lihat & isi survey), validasi, export CSV |
| Aqila Higenea Taufik | 2411522003 | Backend & database, halaman admin, export PDF |

---

## 🛠️ Teknologi

- **Backend:** ExpressJS (Node.js)
- **Database:** MySQL (via `mysql2` — tanpa ORM)
- **Template Engine:** EJS
- **CSS Framework:** Custom (terinspirasi Basecoat UI)
- **Auth:** express-session + bcrypt

---

## 🚀 Cara Instalasi & Menjalankan

### 1. Clone repository
```bash
git clone https://github.com/aqilahigenea/fti-survey-a13.git
cd fti-survey-a13
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup database
- Buka **Laragon** dan aktifkan MySQL
- Buka **phpMyAdmin** di Laragon
- Import file `database.sql` yang ada di root project

### 4. Setup file `.env`
Buat file `.env` di root project (atau sesuaikan yang sudah ada):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fti_survey
SESSION_SECRET=fti-survey-rahasia-2025
PORT=3000
```

### 5. Jalankan aplikasi
```bash
# Mode development (auto-restart)
npm run dev

# Mode production
npm start
```

### 6. Buka di browser
```
http://localhost:3000
```

---

## 🔐 Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |

> Untuk akun user biasa, daftar melalui halaman `/register`

---

## 📁 Struktur Project

```
fti-survey-a13/
├── config/
│   └── db.js                  # Koneksi database MySQL
├── controllers/
│   ├── authController.js      # Login, register, logout
│   ├── adminController.js     # Dashboard admin
│   └── surveyController.js    # Halaman survey pengguna
├── middleware/
│   ├── auth.js                # Cek sudah login
│   └── acl.js                 # Cek role (admin/user)
├── routes/
│   ├── auth.js                # Route login & register
│   ├── admin.js               # Route halaman admin
│   └── survey.js              # Route halaman survey
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── admin/
│   │   └── dashboard.ejs
│   └── survey/
│       └── index.ejs
├── public/
│   └── css/
│       └── style.css
├── database.sql               # Script setup database
├── app.js                     # Entry point aplikasi
├── package.json
├── .env                       # Konfigurasi (tidak di-commit)
└── .gitignore
```

---

## 📋 Fitur

### Tahap 1 (Minggu #11) — Sudah Selesai ✅
- [x] Autentikasi: login, register, logout
- [x] Session management
- [x] ACL: middleware cek role admin & user
- [x] Redirect otomatis berdasarkan role
- [x] Tampilan login & register

### Tahap 2 (Minggu #12-13) — Dalam Pengembangan 🚧
- [ ] Pengguna dapat melihat daftar survey
- [ ] Pengguna dapat mengisi survey
- [ ] Validasi jawaban
- [ ] Admin dapat melihat rekap hasil
- [ ] Admin dapat export CSV & PDF
