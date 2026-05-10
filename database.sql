-- =============================================
-- FTI Survey A13 — Setup Database
-- Cara pakai:
-- 1. Buka phpMyAdmin di Laragon
-- 2. Klik Import → pilih file ini → klik Go
-- =============================================

CREATE DATABASE IF NOT EXISTS fti_survey
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fti_survey;

-- Tabel users untuk login dan kontrol akses
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catatan: setelah import, buat akun lewat /register
-- lalu ubah role jadi admin lewat phpMyAdmin (lihat README)
