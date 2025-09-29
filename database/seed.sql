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
(2, 'Malware / Ransomware', 'Sitios que intentan instalar software malicioso o secuestrar datos a cambio de un rescate.'),
(3, 'Estafa de Tienda en Línea', 'Comercios electrónicos fraudulentos que no entregan productos o venden falsificaciones.'),
(4, 'Suplantación de Identidad', 'Perfiles o sitios que se hacen pasar por personas, marcas o entidades gubernamentales.'),
(5, 'Estafa de Soporte Técnico', 'Falsas alertas de virus que incitan a llamar a un número para robar información o dinero.');

-- Estados de los Reportes
INSERT INTO `report_status` (`id`, `name`, `description`) VALUES
(1, 'pending', 'El reporte ha sido recibido y está esperando revisión.'),
(2, 'in_progress', 'Un administrador está investigando activamente el reporte.'),
(3, 'resolved', 'Se ha confirmado que el reporte es válido y se tomarán acciones.'),
(4, 'rejected', 'El reporte fue revisado y se determinó que no procede.');

-- Tipos de Notificaciones
INSERT INTO `notification_type` (`id`, `name`, `description`) VALUES
(1, 'REPORT_STATUS_CHANGE', 'Cuando el estado de uno de tus reportes cambia.'),
(2, 'NEW_COMMENT_ON_REPORT', 'Cuando alguien comenta en uno de tus reportes.'),
(3, 'NEW_TOP_REPORT', 'Sobre nuevos reportes que son tendencia.');

-- ---------------------------------
-- -- Poblando Datos de Interacción
-- ---------------------------------

-- Reportes (8 ejemplos variados)
INSERT INTO `report` (`id`, `user_id`, `category_id`, `title`, `description`, `url`, `status`, `vote_count`, `comment_count`, `created_at`) VALUES
(1, 2, 1, 'Phishing de Banorte - Correo Falso de Seguridad', 'Recibí un correo supuestamente de Banorte pidiendo verificar mi cuenta en un enlace sospechoso. La página es una copia exacta.', 'http://banorte-seguro-mx.info', 'resolved', 2, 1, '2025-09-20 10:00:00'),
(2, 3, 3, 'Tienda "SuperOfertasMX" no entrega productos', 'Compré una consola de videojuegos hace un mes en superofertas-mx.com y nunca llegó. Ya no responden los correos.', 'http://superofertas-mx.com', 'in_progress', 3, 2, '2025-09-21 11:30:00'),
(3, 4, 5, 'Falsa alerta de virus de Microsoft', 'Navegando me salió una alerta a pantalla completa diciendo que mi PC estaba bloqueada por un virus y que llamara a un número de soporte de Microsoft.', 'http://security-alert-pc.online', 'pending', 0, 0, '2025-09-22 15:00:00'),
(4, 5, 2, 'Página con muchos pop-ups', 'Esta página me abrió muchas ventanas emergentes y mi antivirus la bloqueó. Creo que tiene malware.', 'http://descargas-full-gratis.net', 'rejected', 1, 0, '2025-09-23 18:45:00'),
(5, 2, 4, 'Perfil falso de CFE en Facebook', 'Un perfil en Facebook que se hace pasar por la CFE ofrece descuentos en el recibo de luz si les das tus datos personales.', 'http://facebook.com/CFE-descuentos-reales', 'resolved', 2, 0, '2025-09-24 09:10:00'),
(6, 3, 1, 'SMS de Netflix con enlace para actualizar pago', 'Me llegó un SMS diciendo que mi suscripción a Netflix fue suspendida y que actualice mi pago en un enlace corto.', 'http://bit.ly/netflix-update-pay', 'pending', 0, 0, '2025-09-25 14:20:00'),
(7, 4, 3, 'Venta de boletos falsos para conciertos', 'La página "ticket-eventos-mx.com" vende boletos para conciertos agotados, pero son falsos. Varias personas han sido estafadas.', 'http://ticket-eventos-mx.com', 'rejected', 2, 1, '2025-09-25 17:00:00'),
(8, 5, 2, 'Instalador de "Office Gratis" con virus', 'Descargué un supuesto instalador de Microsoft Office desde un video de YouTube y resultó ser un ransomware.', 'http://officegratis-activado.org', 'in_progress', 1, 0, '2025-09-26 11:00:00');

-- Votos (simulamos que varios usuarios votan)
INSERT INTO `report_vote` (`user_id`, `report_id`) VALUES
(3, 1), (4, 1),         
(2, 2), (4, 2), (5, 2),         
(2, 5), (3, 5),                 
(3, 7), (5, 7),        
(4, 8);                 

-- Comentarios
INSERT INTO `comment` (`user_id`, `report_id`, `content`) VALUES
(4, 1, '¡Casi caigo! El correo se ve muy real. Gracias por compartir.'),
(4, 2, 'A mí también me pasó, compré unos audífonos y jamás llegaron. ¡Son unos ladrones!'),
(1, 2, 'Gracias a todos por sus reportes. El caso está siendo investigado y se tomarán las medidas correspondientes.'),
(2, 7, 'Confirmo, a un amigo le pasó con esta página. Perdió su dinero.');

-- Historial de Cambios de Estado 
INSERT INTO `report_status_history` (`report_id`, `from_status_id`, `to_status_id`, `changed_by_user_id`, `note`, `change_reason`) VALUES
-- Reporte 1: Pasa de pending a resolved
(1, 1, 3, 1, 'Se confirma que la URL es un sitio de phishing activo.', 'Validación interna confirmó la suplantación de identidad.'),
-- Reporte 2: Pasa de pending a in_progress
(2, 1, 2, 1, 'Investigando la tienda y buscando más casos similares.', 'Se requieren más pruebas antes de aceptarlo.'),
-- Reporte 4: Pasa de pending a rejected
(4, 1, 4, 1, 'El usuario no proporcionó capturas de pantalla o detalles específicos del malware.', 'Falta evidencia concreta.'),
-- Reporte 5: Pasa de pending a resolved
(5, 1, 3, 1, 'El perfil de Facebook ha sido verificado como falso.', 'El perfil suplanta la identidad de una entidad gubernamental.'),
-- Reporte 7: Pasa de pending a rejected
(7, 1, 4, 1, 'Ya existe un reporte sobre este sitio web que está siendo investigado.', 'Reporte duplicado del ID #2.'),
-- Reporte 8: Pasa de pending a in_progress
(8, 1, 2, 1, 'Analizando el archivo descargable en un entorno seguro.', 'Análisis técnico en proceso.');

-- Preferencias de Notificación
INSERT INTO `user_notification_preference` (`user_id`, `notification_type_id`) VALUES
(2, 1), (2, 2), -- Carlos quiere saber de cambios de estado y nuevos comentarios
(3, 1), (3, 2), (3, 3), -- Sofia quiere todas las notificaciones
(4, 1); -- David solo quiere cambios de estado

-- Notificaciones Generadas (basado en el historial)
INSERT INTO `notification` (`recipient_user_id`, `notification_type_id`, `content`, `related_entity_id`) VALUES
(2, 1, 'Tu reporte "Phishing de Banorte - Correo Falso de Seguridad" ha sido aceptado.', 1),
(3, 1, 'El estado de tu reporte "Tienda "SuperOfertasMX" no entrega productos" ha cambiado a "en progreso".', 2),
(5, 1, 'Tu reporte "Página con muchos pop-ups" ha sido denegado.', 4),
(2, 2, 'David Soto ha comentado en tu reporte "Venta de boletos falsos para conciertos".', 7);

INSERT INTO `report_status` (`id`, `name`, `description`) VALUES
(1, 'pending', 'El reporte ha sido recibido y está esperando revisión.'),
(2, 'in_progress', 'Un administrador está investigando activamente el reporte.'),
(3, 'resolved', 'Se ha confirmado que el reporte es válido y se tomarán acciones.'),
(4, 'rejected', 'El reporte fue revisado y se determinó que no procede.');


SELECT 'Base de datos poblada con éxito.' AS 'Resultado';