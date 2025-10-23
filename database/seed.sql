-- ==============================================
-- SEED DATA - 2 registros por tabla
-- ==============================================

-- Limpiar datos existentes (en orden inverso por dependencias)
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `notification`;
TRUNCATE TABLE `report_status_history`;
TRUNCATE TABLE `comment`;
TRUNCATE TABLE `report_vote`;
TRUNCATE TABLE `report_tag`;
TRUNCATE TABLE `report`;
TRUNCATE TABLE `tag`;
TRUNCATE TABLE `report_status`;
TRUNCATE TABLE `category`;
TRUNCATE TABLE `user`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------
-- 1. Usuarios (2 registros)
-- ---------------------------------
-- Password: "password123" con salt "randomsalt1" 
-- Hash SHA-256: ee0368a2f7c1db2e3e8ef0e6cd5e1d8fc8f8c0a8e5e4f4a4d0c8f7a4b5c6d7e8
INSERT INTO `user` (`id`, `name`, `email`, `password_hash`, `salt`, `is_admin`, `is_super_admin`, `notifications_enabled`) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', 'ee0368a2f7c1db2e3e8ef0e6cd5e1d8fc8f8c0a8e5e4f4a4d0c8f7a4b5c6d7e8', 'randomsalt1', FALSE, FALSE, TRUE),
(2, 'Admin User', 'admin@example.com', 'ee0368a2f7c1db2e3e8ef0e6cd5e1d8fc8f8c0a8e5e4f4a4d0c8f7a4b5c6d7e8', 'randomsalt2', TRUE, TRUE, TRUE);

-- ---------------------------------
-- 2. Categorías (2 registros)
-- ---------------------------------
INSERT INTO `category` (`id`, `name`, `description`) VALUES
(1, 'Phishing', 'Intentos de robo de información personal mediante sitios falsos'),
(2, 'Malware', 'Software malicioso que daña o compromete sistemas');

-- ---------------------------------
-- 3. Estados de Reporte (2 registros)
-- ---------------------------------
INSERT INTO `report_status` (`id`, `name`, `description`) VALUES
(1, 'Pendiente', 'Reporte recién creado, esperando revisión'),
(2, 'En Revisión', 'Reporte siendo analizado por el equipo de seguridad'),
(3, 'Aceptado', 'Reporte revisado y considerado válido'),
(4, 'Rechazado', 'Reporte revisado y considerado inválido');


-- ---------------------------------
-- 4. Tags (2 registros)
-- ---------------------------------
INSERT INTO `tag` (`id`, `name`) VALUES
(1, 'urgente'),
(2, 'bancario');

-- ---------------------------------
-- 5. Reportes (2 registros)
-- ---------------------------------
INSERT INTO `report` (`id`, `user_id`, `category_id`, `title`, `description`, `url`, `status_id`, `image_url`, `vote_count`, `comment_count`) VALUES
(1, 1, 1, 'Sitio falso de banco', 'Página que imita al banco nacional solicitando credenciales', 'https://banco-falso-ejemplo.com', 1, 'https://example.com/images/phishing1.jpg', 5, 2),
(2, 1, 2, 'Archivo ejecutable sospechoso', 'Descarga automática de .exe al visitar el sitio', 'https://malware-ejemplo.net', 2, 'https://example.com/images/malware1.jpg', 3, 1);

-- ---------------------------------
-- 6. Report Tags (2 registros)
-- ---------------------------------
INSERT INTO `report_tag` (`report_id`, `tag_id`) VALUES
(1, 1),
(1, 2);

-- ---------------------------------
-- 7. Votos (2 registros)
-- ---------------------------------
INSERT INTO `report_vote` (`user_id`, `report_id`) VALUES
(1, 2),
(2, 1);

-- ---------------------------------
-- 8. Comentarios (2 registros)
-- ---------------------------------
INSERT INTO `comment` (`id`, `report_id`, `user_id`, `title`, `content`, `image_url`) VALUES
(1, 1, 2, 'Confirmado', 'He visto este sitio antes, definitivamente es phishing', NULL),
(2, 2, 2, 'Análisis adicional', 'El archivo contiene ransomware según VirusTotal', 'https://example.com/images/analysis1.jpg');

-- ---------------------------------
-- 9. Notificaciones (2 registros)
-- ---------------------------------
INSERT INTO `notification` (`user_id`, `title`, `message`, `related_id`, `is_read`) VALUES
(1, 'Nuevo comentario', 'Admin User comentó en tu reporte "Sitio falso de banco"', 1, FALSE),
(1, 'Estado actualizado', 'Tu reporte "Archivo ejecutable sospechoso" ahora está: Verificado', 2, TRUE);

-- ---------------------------------
-- 10. Historial de Estados (2 registros)
-- ---------------------------------
INSERT INTO `report_status_history` (`report_id`, `from_status_id`, `to_status_id`, `note`, `change_reason`, `changed_by_user_id`) VALUES
(2, 1, 2, 'Verificado por análisis técnico', 'Confirmado como malware tras análisis en sandbox', 2),
(1, NULL, 1, 'Reporte inicial', 'Creación del reporte', 1);

-- Reiniciar auto_increment
ALTER TABLE `user` AUTO_INCREMENT = 3;
ALTER TABLE `category` AUTO_INCREMENT = 3;
ALTER TABLE `report_status` AUTO_INCREMENT = 3;
ALTER TABLE `tag` AUTO_INCREMENT = 3;
ALTER TABLE `report` AUTO_INCREMENT = 3;
ALTER TABLE `report_tag` AUTO_INCREMENT = 3;
ALTER TABLE `report_vote` AUTO_INCREMENT = 3;
ALTER TABLE `comment` AUTO_INCREMENT = 3;
ALTER TABLE `notification` AUTO_INCREMENT = 3;
ALTER TABLE `report_status_history` AUTO_INCREMENT = 3;

SELECT 'Seed completado exitosamente' AS mensaje;