USE fraudfishing;

-- ---------------------------------
-- Tabla de Usuarios (users)
-- ---------------------------------
-- VERSIÓN NUEVA
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `salt` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`)
);

-- ---------------------------------
-- Tabla de Categorías (categories)
-- ---------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------
-- Tabla de Reportes (reports)
-- ---------------------------------
CREATE TABLE IF NOT EXISTS `reports` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `categoryId` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'in_progress', 'resolved', 'rejected') NOT NULL DEFAULT 'pending',
  `image` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reports_users` (`userId`),
  KEY `fk_reports_categories` (`categoryId`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_reports_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reports_categories` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------
-- Tabla de Historial de Estados (report_status_history)
-- ---------------------------------
CREATE TABLE IF NOT EXISTS `report_status_history` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reportId` INT UNSIGNED NOT NULL,
  `from_status` ENUM('pending', 'in_progress', 'resolved', 'rejected'),
  `to_status` ENUM('pending', 'in_progress', 'resolved', 'rejected') NOT NULL,
  `note` VARCHAR(255),
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_by` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_history_reports` (`reportId`),
  KEY `fk_history_users` (`changed_by`),
  CONSTRAINT `fk_history_reports` FOREIGN KEY (`reportId`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_history_users` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;