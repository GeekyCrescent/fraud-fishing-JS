USE fraudfishing;

-- ---------------------------------
-- Semilla de Categorías
-- Usamos INSERT IGNORE para evitar errores si las categorías ya existen.
-- ---------------------------------
INSERT INTO `categories` (`id`, `name`, `description`) VALUES
(1, 'Baches', 'Reportes relacionados con baches en calles y avenidas.'),
(2, 'Alumbrado Público', 'Postes de luz sin funcionar o con fallas intermitentes.'),
(3, 'Recolección de Basura', 'Problemas con la recolección de basura o acumulación en la vía pública.');

-- ---------------------------------
-- Semilla de Usuario Administrador
-- (Opcional pero recomendado para pruebas)
-- La contraseña es 'admin123'. Asegúrate de usar un hash real en un entorno productivo.
-- Por simplicidad, aquí la guardamos en texto plano (NO HACER EN PRODUCCIÓN).
-- ---------------------------------
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin User', 'admin@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'admin'); -- Cambia el hash por uno real generado por tu app

-- ---------------------------------
-- Semilla de Reportes de Ejemplo
-- (Opcional)
-- ---------------------------------
INSERT INTO `reports` (`id`, `userId`, `categoryId`, `title`, `description`, `status`) VALUES
(1, 1, 1, 'Bache peligroso en Av. Principal', 'Hay un bache de gran tamaño frente al número 123 de la Av. Principal. Ya ha causado problemas a varios coches.', 'pending'),
(2, 1, 2, 'Luz parpadeando en Parque Central', 'El poste de luz en la esquina sureste del Parque Central parpadea constantemente.', 'in_progress');

-- ---------------------------------
-- Semilla de Historial de Estados
-- (Opcional, corresponde a los reportes de ejemplo)
-- ---------------------------------
INSERT INTO `report_status_history` (`id`, `reportId`, `from_status`, `to_status`, `note`, `changed_by`) VALUES
(1, 1, NULL, 'pending', 'Reporte creado por el sistema.', 1),
(2, 2, NULL, 'pending', 'Reporte creado por el sistema.', 1),
(3, 2, 'pending', 'in_progress', 'Equipo asignado para revisión.', 1);