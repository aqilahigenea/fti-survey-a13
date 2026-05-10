# FTI Survey — Modul A13 (Pengisian Survey)

Aplikasi web survey online untuk civitas akademika Fakultas Teknologi Informasi.

---

## Anggota Kelompok

| Nama | NIM | Tanggung Jawab |
|------|-----|----------------|
| Arifah Huwaina Azre | 2411521003 | Halaman pengguna, tampilan, validasi, export CSV |
| Aqila Higenea Taufik | 2411522003 | Backend, database, halaman admin, export PDF |

---

## Pembagian Tugas Tahap 1

| Nama | Yang Dikerjakan |
|------|----------------|
| Arifah Huwaina Azre | Halaman login & register (EJS), halaman survey, styling CSS (Basecoat UI), routing autentikasi, logic login/register/logout |
| Aqila Higenea Taufik | Setup app.js, koneksi database, middleware auth guard & ACL, routing admin & survey, halaman dashboard admin |

---

## Teknologi

- **Backend:** ExpressJS (Node.js)
- **Database:** MySQL via `mysql2` (tanpa ORM)
- **Template:** EJS
- **Auth:** express-session + bcrypt
- **UI:** Basecoat UI

---

## Cara Instalasi & Menjalankan

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
- Buka **Laragon** → klik **Start All**
- Buka **phpMyAdmin**
- Klik tab **Import** → pilih file `database.sql` → klik **Go**

### 4. Setup file `.env`
Pastikan isi `.env` seperti ini:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fti_survey
SESSION_SECRET=ftisurvey2026
PORT=3000
```

### 5. Jalankan aplikasi
```bash
npm run dev
```

### 6. Buka browser
```
http://localhost:3000
```

---

## Cara Buat Akun Admin

1. Buka `http://localhost:3000/register`
2. Daftar dengan username dan password bebas
3. Buka **phpMyAdmin** → database `fti_survey` → tabel `users`
4. Klik tab **SQL** → jalankan perintah ini (ganti `username_kamu`):
```sql
UPDATE users SET role = 'admin' WHERE username = 'username_kamu';
```
5. Sekarang login dengan akun tersebut → masuk sebagai admin ✅

---

## Struktur Project

```
fti-survey-a13/
├── config/db.js          → koneksi database
├── controllers/          → logika autentikasi & fitur
├── middleware/           → auth guard & ACL
├── routes/               → routing URL
├── views/                → tampilan EJS
├── public/css/           → stylesheet
├── database.sql          → script setup database
├── app.js                → entry point
└── README.md
```

---

## Fitur

### Tahap 1 ✅
- Login, register, logout
- Session management
- ACL (admin & user)
- Tampilan login & register dengan Basecoat UI

### Tahap 2 🚧
- Pengguna isi survey
- Admin lihat rekap
- Export CSV & PDF
