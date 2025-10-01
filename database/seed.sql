-- Usamos la base de datos que creamos
USE `fraudfishing`;

-- Desactivamos temporalmente la verificación de llaves foráneas para evitar errores de orden al insertar
SET FOREIGN_KEY_CHECKS = 0;

-- Vaciamos las tablas en orden inverso para una ejecución limpia cada vez
TRUNCATE TABLE `report_status_history`;
TRUNCATE TABLE `notification`;
TRUNCATE TABLE `user_notification_preference`;
TRUNCATE TABLE `notification_type`;
TRUNCATE TABLE `comment`;
TRUNCATE TABLE `report_vote`;
TRUNCATE TABLE `report`;
TRUNCATE TABLE `report_status`;
TRUNCATE TABLE `category`;
TRUNCATE TABLE `user`;

-- Reactivamos la verificación
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------
-- -- Poblando Tablas de Catálogo
-- ---------------------------------

-- Usuarios (1 admin, 4 usuarios normales)
INSERT INTO `user` (`id`, `name`, `email`, `password_hash`, `salt`, `is_admin`) VALUES
(1, 'Juan Ferro', 'ferro.admin@example.com', 'hash_muy_seguro_123', 'salt', TRUE),
(2, 'Carlos Rivera', 'carlos.r@example.com', 'hash_muy_seguro_456', 'salt', FALSE),
(3, 'Sofia Castillo', 'sofia.c@example.com', 'hash_muy_seguro_789', 'salt', FALSE),
(4, 'David Soto', 'david.s@example.com', 'hash_muy_seguro_101', 'salt', FALSE),
(5, 'Laura Navarro', 'laura.n@example.com', 'hash_muy_seguro_112', 'salt', FALSE);

-- Categorías de Estafas
INSERT INTO `category` (`id`, `name`, `description`) VALUES
(1, 'Phishing', 'Intentos de obtener información sensible (usuarios, contraseñas, datos bancarios) suplantando a una entidad de confianza.'),
(2, 'Malware', 'Sitios que intentan instalar software malicioso o secuestrar datos a cambio de un rescate.'),
(3, 'Fake Store', 'Comercios electrónicos fraudulentos que no entregan productos o venden falsificaciones.'),
(4, 'Identity Theft', 'Perfiles o sitios que se hacen pasar por personas, marcas o entidades gubernamentales.'),
(5, 'Tech Support Scam', 'Falsas alertas de virus que incitan a llamar a un número para robar información o dinero.');

-- Estados de los Reportes
INSERT INTO `report_status` (`id`, `name`, `description`) VALUES
(1, 'pending', 'El reporte ha sido recibido y está esperando revisión.'),
(2, 'in_progress', 'Un administrador está investigando activamente el reporte.'),
(3, 'approved', 'Se ha confirmado que el reporte es válido y está aprobado.'),
(4, 'rejected', 'El reporte fue revisado y se determinó que no procede.');

-- Tipos de Notificaciones
INSERT INTO `notification_type` (`id`, `name`, `description`, `is_active`) VALUES
(1, 'REPORT_STATUS_CHANGE', 'Cuando el estado de uno de tus reportes cambia.', TRUE),
(2, 'NEW_COMMENT_ON_REPORT', 'Cuando alguien comenta en uno de tus reportes.', TRUE),
(3, 'NEW_LIKE_ON_REPORT', 'Cuando alguien vota a favor de uno de tus reportes.', TRUE),
(4, 'REPORT_TRENDING', 'Cuando tu reporte se vuelve popular.', TRUE),
(5, 'SYSTEM_ANNOUNCEMENT', 'Anuncios importantes del sistema.', TRUE),
(6, 'ADMIN_MESSAGE', 'Mensajes administrativos dirigidos.', TRUE);

-- ---------------------------------
-- -- Poblando Datos de Interacción
-- ---------------------------------

-- Reportes (8 ejemplos variados)
INSERT INTO `report` (`id`, `user_id`, `category_id`, `title`, `description`, `url`, `status_id`, `vote_count`, `comment_count`, `created_at`) VALUES
(1, 2, 1, 'Phishing de Banorte - Correo Falso de Seguridad', 'Recibí un correo supuestamente de Banorte pidiendo verificar mi cuenta en un enlace sospechoso. La página es una copia exacta.', 'http://banorte-seguro-mx.info', 3, 2, 1, '2025-09-20 10:00:00'),
(2, 3, 3, 'Tienda "SuperOfertasMX" no entrega productos', 'Compré una consola de videojuegos hace un mes en superofertas-mx.com y nunca llegó. Ya no responden los correos.', 'http://superofertas-mx.com', 2, 3, 2, '2025-09-21 11:30:00'),
(3, 4, 5, 'Falsa alerta de virus de Microsoft', 'Navegando me salió una alerta a pantalla completa diciendo que mi PC estaba bloqueada por un virus y que llamara a un número de soporte de Microsoft.', 'http://security-alert-pc.online', 1, 0, 0, '2025-09-22 15:00:00'),
(4, 5, 2, 'Página con muchos pop-ups', 'Esta página me abrió muchas ventanas emergentes y mi antivirus la bloqueó. Creo que tiene malware.', 'http://descargas-full-gratis.net', 4, 1, 0, '2025-09-23 18:45:00'),
(5, 2, 4, 'Perfil falso de CFE en Facebook', 'Un perfil en Facebook que se hace pasar por la CFE ofrece descuentos en el recibo de luz si les das tus datos personales.', 'http://facebook.com/CFE-descuentos-reales', 3, 2, 0, '2025-09-24 09:10:00'),
(6, 3, 1, 'SMS de Netflix con enlace para actualizar pago', 'Me llegó un SMS diciendo que mi suscripción a Netflix fue suspendida y que actualice mi pago en un enlace corto.', 'http://bit.ly/netflix-update-pay', 1, 0, 0, '2025-09-25 14:20:00'),
(7, 4, 3, 'Venta de boletos falsos para conciertos', 'La página "ticket-eventos-mx.com" vende boletos para conciertos agotados, pero son falsos. Varias personas han sido estafadas.', 'http://ticket-eventos-mx.com', 4, 2, 1, '2025-09-25 17:00:00'),
(8, 5, 2, 'Instalador de "Office Gratis" con virus', 'Descargué un supuesto instalador de Microsoft Office desde un video de YouTube y resultó ser un ransomware.', 'http://officegratis-activado.org', 2, 1, 0, '2025-09-26 11:00:00');

-- Votos (simulamos que varios usuarios votan)
INSERT INTO `report_vote` (`user_id`, `report_id`) VALUES
(3, 1), (4, 1),         -- Reporte 1: 2 votos
(2, 2), (4, 2), (5, 2), -- Reporte 2: 3 votos        
(2, 5), (3, 5),         -- Reporte 5: 2 votos                
(3, 7), (5, 7),         -- Reporte 7: 2 votos       
(4, 8);                 -- Reporte 8: 1 voto                

-- Comentarios (con title e image_url)
INSERT INTO `comment` (`user_id`, `report_id`, `title`, `content`, `image_url`) VALUES
(4, 1, 'Experiencia similar', '¡Casi caigo! El correo se ve muy real. Gracias por compartir.', NULL),
(4, 2, 'También fui estafado', 'A mí también me pasó, compré unos audífonos y jamás llegaron. ¡Son unos ladrones!', NULL),
(1, 2, 'Actualización del administrador', 'Gracias a todos por sus reportes. El caso está siendo investigado y se tomarán las medidas correspondientes.', NULL),
(2, 7, 'Confirmación de estafa', 'Confirmo, a un amigo le pasó con esta página. Perdió su dinero.', NULL);

-- Historial de Cambios de Estado 
INSERT INTO `report_status_history` (`report_id`, `from_status_id`, `to_status_id`, `changed_by_user_id`, `note`, `change_reason`) VALUES
-- Reporte 1: Pasa de pending a approved
(1, 1, 3, 1, 'Se confirma que la URL es un sitio de phishing activo.', 'Validación interna confirmó la suplantación de identidad.'),
-- Reporte 2: Pasa de pending a in_progress
(2, 1, 2, 1, 'Investigando la tienda y buscando más casos similares.', 'Se requieren más pruebas antes de aceptarlo.'),
-- Reporte 4: Pasa de pending a rejected
(4, 1, 4, 1, 'El usuario no proporcionó capturas de pantalla o detalles específicos del malware.', 'Falta evidencia concreta.'),
-- Reporte 5: Pasa de pending to approved
(5, 1, 3, 1, 'El perfil de Facebook ha sido verificado como falso.', 'El perfil suplanta la identidad de una entidad gubernamental.'),
-- Reporte 7: Pasa de pending a rejected
(7, 1, 4, 1, 'Ya existe un reporte sobre este sitio web que está siendo investigado.', 'Reporte duplicado del ID #2.'),
-- Reporte 8: Pasa de pending a in_progress
(8, 1, 2, 1, 'Analizando el archivo descargable en un entorno seguro.', 'Análisis técnico en proceso.');

-- Preferencias de Notificación (granulares por tipo)
INSERT INTO `user_notification_preference` (`user_id`, `notification_type_id`, `enabled`, `email_enabled`, `push_enabled`) VALUES
-- Carlos (id: 2) - Quiere cambios de estado y comentarios
(2, 1, TRUE, TRUE, TRUE),   -- REPORT_STATUS_CHANGE
(2, 2, TRUE, TRUE, FALSE),  -- NEW_COMMENT_ON_REPORT (sin push)
(2, 4, TRUE, TRUE, FALSE),  -- SYSTEM_ANNOUNCEMENT (sin push)

-- Sofia (id: 3) - Quiere todas las notificaciones
(3, 1, TRUE, TRUE, TRUE),   -- REPORT_STATUS_CHANGE
(3, 2, TRUE, TRUE, TRUE),   -- NEW_COMMENT_ON_REPORT
(3, 3, TRUE, TRUE, TRUE),   -- REPORT_TRENDING
(3, 4, TRUE, TRUE, TRUE),   -- SYSTEM_ANNOUNCEMENT
(3, 5, TRUE, TRUE, TRUE),   -- ADMIN_MESSAGE

-- David (id: 4) - Solo cambios de estado
(4, 1, TRUE, FALSE, TRUE),  -- REPORT_STATUS_CHANGE (solo push)
(4, 4, TRUE, FALSE, TRUE),  -- SYSTEM_ANNOUNCEMENT (solo push)

-- Laura (id: 5) - Cambios de estado y comentarios
(5, 1, TRUE, TRUE, FALSE),  -- REPORT_STATUS_CHANGE (solo email)
(5, 2, TRUE, TRUE, TRUE),   -- NEW_COMMENT_ON_REPORT
(5, 3, TRUE, TRUE, TRUE);   -- REPORT_TRENDING

-- Notificaciones Generadas (con nuevo formato)
INSERT INTO `notification` (`user_id`, `notification_type_id`, `title`, `message`, `related_id`, `is_read`) VALUES
(2, 1, '✅ Reporte aprobado', 'Tu reporte "Phishing de Banorte - Correo Falso de Seguridad" ha sido aprobado por un administrador.', 1, FALSE),
(3, 1, '🔍 Reporte en revisión', 'El estado de tu reporte "Tienda SuperOfertasMX no entrega productos" ha cambiado a "en proceso de investigación".', 2, FALSE),
(5, 1, '❌ Reporte rechazado', 'Tu reporte "Página con muchos pop-ups" ha sido rechazado. Motivo: Falta evidencia concreta.', 4, TRUE),
(2, 2, '💬 Nuevo comentario', 'David Soto ha comentado en tu reporte "Phishing de Banorte - Correo Falso de Seguridad".', 1, FALSE),
(4, 4, '📊 Bienvenido al sistema', 'Gracias por unirte a FraudFishing. Tu ayuda es valiosa para combatir el fraude online.', NULL, TRUE),
(3, 3, '🚨 Reporte popular', 'Tu reporte "Tienda SuperOfertasMX no entrega productos" ha recibido 3 votos de la comunidad.', 2, FALSE),
(2, 1, '✅ Reporte aprobado', 'Tu reporte "Perfil falso de CFE en Facebook" ha sido aprobado por un administrador.', 5, FALSE),
(4, 1, '🔍 Reporte en revisión', 'El estado de tu reporte "Falsa alerta de virus de Microsoft" ha cambiado a "pendiente".', 3, TRUE);

