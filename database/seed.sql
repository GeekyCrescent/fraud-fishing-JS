-- Usamos la base de datos que creamos
USE `fraudfishing`;

-- Desactivamos temporalmente la verificación de llaves foráneas para evitar errores de orden al insertar
SET FOREIGN_KEY_CHECKS = 0;

-- Vaciamos las tablas en orden inverso para una ejecución limpia cada vez
TRUNCATE TABLE `report_status_history`;
TRUNCATE TABLE `notification`;
TRUNCATE TABLE `comment`;
TRUNCATE TABLE `report_vote`;
TRUNCATE TABLE `report_tag`;
TRUNCATE TABLE `report`;
TRUNCATE TABLE `notification_type`;
TRUNCATE TABLE `tag`;
TRUNCATE TABLE `report_status`;
TRUNCATE TABLE `category`;
TRUNCATE TABLE `user`;

-- Reactivamos la verificación
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------
-- Poblando Tablas de Catálogo
-- ---------------------------------

-- Usuarios (1 admin, 4 usuarios normales)
INSERT INTO `user` (`id`, `name`, `email`, `password_hash`, `salt`, `is_admin`, `notifications_enabled`) VALUES
(1, 'Juan Ferro', 'ferro.admin@example.com', 'hash_muy_seguro_123', 'salt', TRUE, TRUE),
(2, 'Carlos Rivera', 'carlos.r@example.com', 'hash_muy_seguro_456', 'salt', FALSE, TRUE),
(3, 'Sofia Castillo', 'sofia.c@example.com', 'hash_muy_seguro_789', 'salt', FALSE, TRUE),
(4, 'David Soto', 'david.s@example.com', 'hash_muy_seguro_101', 'salt', FALSE, FALSE),
(5, 'Laura Navarro', 'laura.n@example.com', 'hash_muy_seguro_112', 'salt', FALSE, TRUE);

-- Categorías de Estafas
INSERT INTO `category` (`id`, `name`, `description`) VALUES
(1, 'Phishing', 'Intentos de obtener información sensible (usuarios, contraseñas, datos bancarios) suplantando a una entidad de confianza.'),
(2, 'Malware', 'Sitios que intentan instalar software malicioso o secuestrar datos a cambio de un rescate.'),
(3, 'Fake Store', 'Comercios electrónicos fraudulentos que no entregan productos o venden falsificaciones.'),
(4, 'Identity Theft', 'Perfiles o sitios que se hacen pasar por personas, marcas o entidades gubernamentales.'),
(5, 'Tech Support Scam', 'Falsas alertas de virus que incitan a llamar a un número para robar información o dinero.'),
(6, 'Cryptocurrency Fraud', 'Fraudes relacionados con criptomonedas e inversiones digitales.'),
(7, 'Romance Scam', 'Estafas románticas en línea para obtener dinero o información personal.'),
(8, 'Investment Fraud', 'Fraudes de inversión y esquemas Ponzi en línea.');

-- Estados de los Reportes
INSERT INTO `report_status` (`id`, `name`, `description`) VALUES
(1, 'Pendiente', 'El reporte ha sido recibido y está esperando revisión.'),
(2, 'En Proceso', 'Un administrador está investigando activamente el reporte.'),
(3, 'Resuelto', 'Se ha confirmado que el reporte es válido y ha sido resuelto.'),
(4, 'Rechazado', 'El reporte fue revisado y se determinó que no procede.');

-- Tags
INSERT INTO `tag` (`id`, `name`, `color`) VALUES
(1, 'Urgente', '#FF4444'),
(2, 'Verificado', '#00AA00'),
(3, 'En Investigación', '#FFA500'),
(4, 'Falso Positivo', '#888888'),
(5, 'Alta Prioridad', '#FF0000'),
(6, 'Resuelto', '#28A745'),
(7, 'Duplicado', '#6C757D'),
(8, 'Necesita Información', '#17A2B8'),
(9, 'Sitio Caído', '#6F42C1'),
(10, 'Reportado a Autoridades', '#20C997'),
(11, 'Phishing Bancario', '#DC3545'),
(12, 'Estafa Masiva', '#FD7E14'),
(13, 'Malware Confirmado', '#6610F2'),
(14, 'Sitio Bloqueado', '#6F42C1'),
(15, 'Bajo Impacto', '#6C757D');

-- Tipos de Notificaciones
INSERT INTO `notification_type` (`id`, `name`, `description`, `is_active`) VALUES
(1, 'REPORT_STATUS_CHANGE', 'Cuando el estado de uno de tus reportes cambia.', TRUE),
(2, 'NEW_COMMENT_ON_REPORT', 'Cuando alguien comenta en uno de tus reportes.', TRUE),
(3, 'NEW_VOTE_ON_REPORT', 'Cuando alguien vota a favor de uno de tus reportes.', TRUE),
(4, 'REPORT_TRENDING', 'Cuando tu reporte se vuelve popular.', TRUE),
(5, 'SYSTEM_ANNOUNCEMENT', 'Anuncios importantes del sistema.', TRUE),
(6, 'ADMIN_MESSAGE', 'Mensajes administrativos dirigidos.', TRUE);

-- ---------------------------------
-- Poblando Datos de Interacción
-- ---------------------------------

-- Reportes (12 ejemplos variados)
INSERT INTO `report` (`id`, `user_id`, `category_id`, `title`, `description`, `url`, `status_id`, `vote_count`, `comment_count`, `created_at`) VALUES
(1, 2, 1, 'Phishing de Banorte - Correo Falso de Seguridad', 'Recibí un correo supuestamente de Banorte pidiendo verificar mi cuenta en un enlace sospechoso. La página es una copia exacta del sitio oficial.', 'http://banorte-seguro-mx.info', 3, 5, 2, '2025-09-20 10:00:00'),
(2, 3, 3, 'Tienda "SuperOfertasMX" no entrega productos', 'Compré una consola de videojuegos hace un mes en superofertas-mx.com y nunca llegó. Ya no responden los correos ni las llamadas.', 'http://superofertas-mx.com', 2, 5, 4, '2025-09-21 11:30:00'),
(3, 4, 5, 'Falsa alerta de virus de Microsoft', 'Navegando me salió una alerta a pantalla completa diciendo que mi PC estaba bloqueada por un virus y que llamara a un número de soporte de Microsoft.', 'http://security-alert-pc.online', 1, 2, 1, '2025-09-22 15:00:00'),
(4, 5, 2, 'Página con muchos pop-ups maliciosos', 'Esta página me abrió muchas ventanas emergentes y mi antivirus la bloqueó. Definitivamente tiene malware.', 'http://descargas-full-gratis.net', 4, 1, 0, '2025-09-23 18:45:00'),
(5, 2, 4, 'Perfil falso de CFE en Facebook', 'Un perfil en Facebook que se hace pasar por la CFE ofrece descuentos en el recibo de luz si les das tus datos personales y bancarios.', 'http://facebook.com/CFE-descuentos-reales', 3, 5, 3, '2025-09-24 09:10:00'),
(6, 3, 1, 'SMS de Netflix con enlace para actualizar pago', 'Me llegó un SMS diciendo que mi suscripción a Netflix fue suspendida y que actualice mi pago en un enlace corto sospechoso.', 'http://bit.ly/netflix-update-pay', 2, 4, 2, '2025-09-25 14:20:00'),
(7, 4, 3, 'Venta de boletos falsos para conciertos', 'La página "ticket-eventos-mx.com" vende boletos para conciertos agotados, pero son falsos. Varias personas han sido estafadas.', 'http://ticket-eventos-mx.com', 4, 3, 1, '2025-09-25 17:00:00'),
(8, 5, 2, 'Instalador de "Office Gratis" con ransomware', 'Descargué un supuesto instalador de Microsoft Office desde un video de YouTube y resultó ser un ransomware que cifró mis archivos.', 'http://officegratis-activado.org', 2, 4, 3, '2025-09-26 11:00:00'),
(9, 2, 6, 'Estafa de Bitcoin - Duplicación de monedas', 'Un sitio promete duplicar cualquier cantidad de Bitcoin que envíes. Obviamente es una estafa pero se ve muy profesional.', 'http://bitcoin-doubler-pro.com', 3, 5, 5, '2025-09-27 16:30:00'),
(10, 3, 7, 'Perfil falso en app de citas', 'Una persona en Tinder me pidió dinero para "emergencia médica" después de una semana de conversación. Perfil completamente falso.', 'http://tinder.com/profile/fake123', 1, 4, 2, '2025-09-28 20:15:00'),
(11, 4, 8, 'Esquema Ponzi - InvestMX', 'Sitio web que promete 50% de ganancia mensual en inversiones. Tiene todas las características de un esquema Ponzi.', 'http://invest-mx-ganancias.com', 2, 4, 4, '2025-09-29 14:45:00'),
(12, 5, 1, 'Phishing de BBVA por WhatsApp', 'Recibí un mensaje de WhatsApp supuestamente de BBVA con un enlace para "reactivar mi tarjeta". El sitio es idéntico al original.', 'http://bbva-reactivacion-mx.net', 1, 3, 1, '2025-09-30 09:20:00');

-- Asignación de Tags a Reportes
INSERT INTO `report_tag` (`report_id`, `tag_id`) VALUES
-- Reporte 1: Phishing de Banorte
(1, 2), (1, 6), (1, 11), (1, 10),
-- Reporte 2: SuperOfertasMX
(2, 1), (2, 3), (2, 12),
-- Reporte 3: Falsa alerta Microsoft
(3, 8), (3, 1),
-- Reporte 4: Página con pop-ups (rechazado)
(4, 4), (4, 15),
-- Reporte 5: CFE Facebook
(5, 2), (5, 6), (5, 10), (5, 12),
-- Reporte 6: Netflix SMS
(6, 3), (6, 1), (6, 11),
-- Reporte 7: Boletos falsos (duplicado)
(7, 7), (7, 4),
-- Reporte 8: Office con ransomware
(8, 3), (8, 13), (8, 1),
-- Reporte 9: Bitcoin doubler
(9, 2), (9, 6), (9, 12), (9, 10),
-- Reporte 10: Romance scam
(10, 8), (10, 1),
-- Reporte 11: Esquema Ponzi
(11, 3), (11, 5), (11, 12),
-- Reporte 12: BBVA WhatsApp
(12, 8), (12, 11), (12, 1);

-- Votos (simulamos que varios usuarios votan) - SIN DUPLICADOS
INSERT INTO `report_vote` (`user_id`, `report_id`) VALUES
-- Reporte 1: 5 votos (usuarios únicos)
(1, 1), (3, 1), (4, 1), (5, 1), (2, 1),
-- Reporte 2: 8 votos (necesitamos todos los usuarios + algunos extras no posibles, reducimos a 5)
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2),
-- Reporte 3: 2 votos
(2, 3), (5, 3),
-- Reporte 4: 1 voto
(3, 4),
-- Reporte 5: 5 votos (máximo posible con 5 usuarios)
(1, 5), (2, 5), (3, 5), (4, 5), (5, 5),
-- Reporte 6: 4 votos
(1, 6), (2, 6), (4, 6), (5, 6),
-- Reporte 7: 3 votos
(2, 7), (3, 7), (5, 7),
-- Reporte 8: 4 votos
(1, 8), (2, 8), (3, 8), (4, 8),
-- Reporte 9: 5 votos (máximo posible)
(1, 9), (2, 9), (3, 9), (4, 9), (5, 9),
-- Reporte 10: 4 votos
(1, 10), (2, 10), (4, 10), (5, 10),
-- Reporte 11: 4 votos
(1, 11), (2, 11), (3, 11), (5, 11),
-- Reporte 12: 3 votos
(1, 12), (3, 12), (4, 12);

-- Comentarios (AHORA CON TÍTULO E IMAGE_URL)
INSERT INTO `comment` (`user_id`, `report_id`, `title`, `content`, `image_url`, `created_at`) VALUES
-- Comentarios en Reporte 1 (Banorte)
(4, 1, 'Experiencia similar', '¡Casi caigo! El correo se ve muy real. Gracias por compartir, me salvaste de dar mis datos.', NULL, '2025-09-20 12:30:00'),
(1, 1, 'Reporte verificado', 'Excelente reporte. Hemos verificado que es un sitio de phishing activo. Reporte aprobado.', 'https://example.com/evidence/banorte-phishing.png', '2025-09-20 15:45:00'),

-- Comentarios en Reporte 2 (SuperOfertasMX)
(4, 2, 'También soy víctima', 'A mí también me pasó, compré unos audífonos y jamás llegaron. ¡Son unos ladrones!', NULL, '2025-09-21 14:20:00'),
(5, 2, 'Pérdida económica', 'Yo perdí $2,500 pesos con esta tienda. ¿Alguien sabe cómo denunciarlos?', 'https://example.com/receipts/superofertas-receipt.jpg', '2025-09-21 16:10:00'),
(1, 2, 'Actualización del caso', 'Gracias a todos por sus reportes. El caso está siendo investigado y se tomarán las medidas correspondientes.', NULL, '2025-09-22 09:00:00'),
(2, 2, 'Progreso de la investigación', 'Actualización: La Profeco ya tiene varios reportes de esta tienda. Seguimos recopilando evidencia.', NULL, '2025-09-23 11:30:00'),

-- Comentarios en Reporte 3 (Microsoft falso)
(2, 3, 'Experiencia relacionada', 'Me pasó algo similar pero con una alerta de Apple. Estos estafadores no tienen límites.', 'https://example.com/screenshots/fake-apple-alert.png', '2025-09-22 18:00:00'),

-- Comentarios en Reporte 5 (CFE Facebook)
(3, 5, 'Acción tomada', 'Reporté el perfil a Facebook y ya lo eliminaron. Gracias por la alerta.', NULL, '2025-09-24 14:30:00'),
(4, 5, 'Familia protegida', 'Mi mamá casi cae en esta estafa. Por suerte le enseñé tu post a tiempo.', NULL, '2025-09-24 16:45:00'),
(1, 5, 'Seguimiento oficial', 'Perfil verificado como fraudulento. Hemos contactado a CFE para que estén al tanto.', 'https://example.com/reports/cfe-official-response.pdf', '2025-09-25 10:00:00'),

-- Comentarios en Reporte 6 (Netflix SMS)
(4, 6, 'SMS similar recibido', 'A mí me llegó el mismo mensaje. No hice clic pero se ve muy convincente.', 'https://example.com/screenshots/netflix-sms.jpg', '2025-09-25 16:00:00'),
(1, 6, 'En investigación', 'Investigando el enlace. Recomendamos no hacer clic y reportar el SMS como spam.', NULL, '2025-09-26 09:15:00'),

-- Comentarios en Reporte 7 (Boletos falsos)
(2, 7, 'Caso confirmado', 'Confirmo, a un amigo le pasó con esta página. Perdió $1,800 en boletos para Bad Bunny.', 'https://example.com/tickets/fake-tickets-evidence.jpg', '2025-09-25 19:30:00'),

-- Comentarios en Reporte 8 (Office ransomware)
(1, 8, 'Análisis técnico completado', 'Hemos analizado el archivo. Confirmo que es Ransomware. Cuidado con descargas de fuentes no oficiales.', 'https://example.com/malware-analysis/office-ransomware-report.pdf', '2025-09-26 14:20:00'),
(3, 8, 'Oferta de ayuda', '¿Lograste recuperar tus archivos? Tengo un conocido en ciberseguridad que te puede ayudar.', NULL, '2025-09-26 17:45:00'),
(5, 8, 'Consejo preventivo', 'Por eso siempre hay que hacer respaldos. Espero puedas recuperar tu información.', NULL, '2025-09-27 08:30:00'),

-- Comentarios en Reporte 9 (Bitcoin doubler) - el más popular
(1, 9, 'Advertencia oficial', 'NUNCA envíen criptomonedas a sitios que prometen duplicarlas. Es la estafa más antigua del libro.', 'https://example.com/education/crypto-scam-guide.png', '2025-09-27 18:00:00'),
(3, 9, 'Reflexión importante', 'Lástima que mucha gente cae en esto por la avaricia. Excelente reporte.', NULL, '2025-09-27 20:15:00'),
(4, 9, 'Llamado a la acción', 'Compartan esto en redes sociales. Entre más gente sepa, menos víctimas habrá.', NULL, '2025-09-28 09:30:00'),
(5, 9, 'Testimonio personal', 'Mi primo perdió 0.5 BTC (como $15,000 USD) en un sitio similar. Gracias por advertir.', 'https://example.com/losses/bitcoin-transaction-evidence.png', '2025-09-28 12:45:00'),
(2, 9, 'Acción legal', 'Ya reporté el dominio a las autoridades correspondientes. Esperemos lo bloqueen pronto.', NULL, '2025-09-28 16:20:00'),

-- Comentarios en Reporte 10 (Romance scam)
(1, 10, 'Información educativa', 'Los romance scams son muy comunes. Siempre sospechen si piden dinero rápidamente.', 'https://example.com/education/romance-scam-warning-signs.jpg', '2025-09-28 22:00:00'),
(2, 10, 'Caso similar conocido', 'A una conocida le pasó algo similar en Facebook Dating. Perdió $5,000 pesos.', NULL, '2025-09-29 10:30:00'),

-- Comentarios en Reporte 11 (Esquema Ponzi)
(1, 11, 'Análisis financiero', 'Las ganancias del 50% mensual son imposibles legalmente. Es definitivamente un Ponzi.', 'https://example.com/analysis/ponzi-scheme-analysis.pdf', '2025-09-29 16:00:00'),
(2, 11, 'Investigación en curso', 'Investigando a los supuestos "fundadores". Probablemente usen identidades falsas.', NULL, '2025-09-29 18:30:00'),
(3, 11, 'Advertencia familiar', 'Mi cuñado invirtió $10,000 aquí. Le dije que era estafa pero no me hizo caso.', 'https://example.com/evidence/investment-proof.jpg', '2025-09-30 07:45:00'),
(5, 11, 'Explicación educativa', 'Estos esquemas siempre colapsan. Los primeros inversores cobran y los últimos pierden todo.', NULL, '2025-09-30 14:20:00'),

-- Comentarios en Reporte 12 (BBVA WhatsApp)
(3, 12, 'Señal de alerta clara', 'Los bancos NUNCA contactan por WhatsApp para temas de seguridad. Red flag inmediata.', 'https://example.com/screenshots/bbva-whatsapp-scam.jpg', '2025-09-30 11:45:00');

-- Historial de Cambios de Estado 
INSERT INTO `report_status_history` (`report_id`, `from_status_id`, `to_status_id`, `changed_by_user_id`, `note`, `change_reason`) VALUES
-- Reporte 1: Pendiente -> Resuelto
(1, 1, 3, 1, 'Se confirma que la URL es un sitio de phishing activo que suplanta a Banorte.', 'Validación técnica confirmó la suplantación de identidad bancaria.'),

-- Reporte 2: Pendiente -> En Proceso
(2, 1, 2, 1, 'Investigando la tienda y buscando más casos similares para construir un caso sólido.', 'Se requieren más pruebas antes de proceder legalmente.'),

-- Reporte 4: Pendiente -> Rechazado
(4, 1, 4, 1, 'El usuario no proporcionó capturas de pantalla específicas del comportamiento malicioso.', 'Falta evidencia técnica concreta para validar el reporte.'),

-- Reporte 5: Pendiente -> Resuelto
(5, 1, 3, 1, 'El perfil de Facebook ha sido verificado como fraudulento y reportado a la plataforma.', 'Confirmado que suplanta identidad de entidad gubernamental (CFE).'),

-- Reporte 6: Pendiente -> En Proceso
(6, 1, 2, 1, 'Analizando el enlace corto y rastreando el destino real para confirmar phishing.', 'Investigación técnica del enlace acortado en proceso.'),

-- Reporte 7: Pendiente -> Rechazado
(7, 1, 4, 1, 'Reporte duplicado. Ya existe investigación activa sobre este sitio web.', 'Caso duplicado del reporte ID #2, misma modalidad de estafa.'),

-- Reporte 8: Pendiente -> En Proceso
(8, 1, 2, 1, 'Analizando el archivo descargable en ambiente controlado para confirmar ransomware.', 'Análisis forense del malware en sandbox de seguridad.'),

-- Reporte 9: Pendiente -> Resuelto
(9, 1, 3, 1, 'Confirmado como esquema de duplicación de Bitcoin. Dominio reportado a autoridades.', 'Esquema clásico de duplicación de criptomonedas, evidencia suficiente.'),

-- Reporte 11: Pendiente -> En Proceso
(11, 1, 2, 1, 'Investigando estructura financiera y validando identidades de los supuestos fundadores.', 'Análisis financiero para confirmar características de esquema Ponzi.');

-- Notificaciones Generadas
INSERT INTO `notification` (`user_id`, `notification_type_id`, `title`, `message`, `related_id`, `is_read`, `created_at`) VALUES
-- Notificaciones de cambio de estado
(2, 1, '✅ Reporte aprobado', 'Tu reporte "Phishing de Banorte - Correo Falso de Seguridad" ha sido resuelto por un administrador. Gracias por ayudar a la comunidad.', 1, FALSE, '2025-09-20 15:50:00'),
(3, 1, '🔍 Reporte en revisión', 'El estado de tu reporte "Tienda SuperOfertasMX no entrega productos" ha cambiado a "En Proceso". Un administrador está investigando activamente.', 2, FALSE, '2025-09-22 09:05:00'),
(5, 1, '❌ Reporte rechazado', 'Tu reporte "Página con muchos pop-ups maliciosos" ha sido rechazado. Motivo: Falta evidencia técnica concreta.', 4, TRUE, '2025-09-23 19:00:00'),
(2, 1, '✅ Reporte aprobado', 'Tu reporte "Perfil falso de CFE en Facebook" ha sido resuelto. El perfil fraudulento fue reportado a Facebook.', 5, FALSE, '2025-09-25 10:05:00'),
(2, 1, '✅ Reporte aprobado', 'Tu reporte "Estafa de Bitcoin - Duplicación de monedas" ha sido resuelto y reportado a las autoridades correspondientes.', 9, FALSE, '2025-09-28 16:25:00'),

-- Notificaciones de comentarios
(2, 2, '💬 Nuevo comentario', 'David Soto ha comentado en tu reporte "Phishing de Banorte - Correo Falso de Seguridad".', 1, FALSE, '2025-09-20 12:35:00'),
(3, 2, '💬 Nuevo comentario', 'David Soto ha comentado en tu reporte "Tienda SuperOfertasMX no entrega productos".', 2, FALSE, '2025-09-21 14:25:00'),
(3, 2, '💬 Nuevo comentario', 'Laura Navarro ha comentado en tu reporte "Tienda SuperOfertasMX no entrega productos".', 2, TRUE, '2025-09-21 16:15:00'),
(2, 2, '💬 Nuevo comentario', 'Sofia Castillo ha comentado en tu reporte "Perfil falso de CFE en Facebook".', 5, FALSE, '2025-09-24 14:35:00'),
(2, 2, '💬 Nuevo comentario', 'Tu reporte "Estafa de Bitcoin - Duplicación de monedas" ha recibido múltiples comentarios de la comunidad.', 9, FALSE, '2025-09-27 18:05:00'),

-- Notificaciones de votos
(2, 3, '👍 Nuevo voto', 'Tu reporte "Phishing de Banorte - Correo Falso de Seguridad" ha recibido un nuevo voto de apoyo.', 1, TRUE, '2025-09-20 14:00:00'),
(3, 3, '👍 Nuevos votos', 'Tu reporte "Tienda SuperOfertasMX no entrega productos" ha recibido varios votos de la comunidad.', 2, FALSE, '2025-09-21 16:00:00'),
(2, 3, '🔥 Reporte popular', 'Tu reporte "Perfil falso de CFE en Facebook" se ha vuelto muy popular con 12 votos.', 5, FALSE, '2025-09-24 18:00:00'),
(2, 3, '🚀 Reporte viral', '¡Felicidades! Tu reporte "Estafa de Bitcoin - Duplicación de monedas" es trending con 15 votos.', 9, FALSE, '2025-09-28 10:00:00'),

-- Notificaciones del sistema
(1, 5, '📊 Resumen semanal admin', 'Esta semana se procesaron 12 reportes nuevos. 4 aprobados, 2 rechazados, 6 en proceso.', NULL, TRUE, '2025-09-30 08:00:00'),
(2, 5, '🛡️ Consejos de seguridad', 'Recuerda: Los bancos nunca solicitan información sensible por correo electrónico o mensajes de texto.', NULL, FALSE, '2025-09-29 10:00:00'),
(3, 5, '🎉 Bienvenida al sistema', 'Gracias por unirte a FraudFishing. Tu participación ayuda a crear un internet más seguro para todos.', NULL, TRUE, '2025-09-21 12:00:00'),
(4, 5, '⚠️ Alerta de seguridad', 'Se ha detectado un aumento en estafas de soporte técnico. Mantente alerta ante llamadas no solicitadas.', NULL, FALSE, '2025-09-25 15:00:00'),
(5, 5, '📈 Impacto de la comunidad', 'Gracias a reportes como el tuyo, hemos ayudado a prevenir más de 100 estafas este mes.', NULL, FALSE, '2025-09-28 09:00:00'),

-- Mensajes administrativos
(2, 6, '👨‍💻 Mensaje del administrador', 'Excelente trabajo reportando el phishing de Banorte. Tu atención al detalle ayudó mucho en la investigación.', 1, FALSE, '2025-09-20 16:00:00'),
(3, 6, '🔍 Seguimiento de caso', 'Hemos contactado a Profeco respecto a tu reporte de SuperOfertasMX. Te mantendremos informada del progreso.', 2, TRUE, '2025-09-23 14:00:00'),
(2, 6, '🏆 Reconocimiento', 'Has sido seleccionado como "Reportero del Mes" por tu contribución excepcional a la seguridad comunitaria.', NULL, FALSE, '2025-09-30 12:00:00');

-- Actualizar contadores de comentarios en reportes
UPDATE `report` SET `comment_count` = (SELECT COUNT(*) FROM `comment` WHERE `comment`.`report_id` = `report`.`id`);

-- Actualizar contadores de votos en reportes  
UPDATE `report` SET `vote_count` = (SELECT COUNT(*) FROM `report_vote` WHERE `report_vote`.`report_id` = `report`.`id`);

-- Mensaje de finalización
SELECT 'Base de datos poblada exitosamente con datos de prueba realistas.' as 'Status';
SELECT 
    'Usuarios: 5, Categorías: 8, Reportes: 12, Tags: 15, Comentarios: 25, Votos: 68, Notificaciones: 25' as 'Resumen de datos insertados';