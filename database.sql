CREATE DATABASE IF NOT EXISTS fti_survey
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fti_survey;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email_verified_at DATETIME DEFAULT NULL,
  remember_token VARCHAR(100) DEFAULT NULL,
  two_factor_secret TEXT DEFAULT NULL,
  two_factor_recovery_codes TEXT DEFAULT NULL,
  two_factor_confirmed_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel roles
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  guard_name VARCHAR(100) NOT NULL DEFAULT 'web',
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL
);

-- Tabel role_has_permissions
CREATE TABLE IF NOT EXISTS role_has_permissions (
  permission_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (permission_id, role_id)
);

-- Tabel permissions
CREATE TABLE IF NOT E