

-- =========================
-- Usuarios (3)
-- =========================
INSERT INTO user (id, name, email, password_hash, salt, is_admin)
VALUES
  (1, 'Admin User', 'admin@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'salt1', 1),
  (2, 'Jane Doe',   'jane@example.com',  '$2b$10$abcdefghijklmnopqrstuv', 'salt2', 0),
  (3, 'John Roe',   'john@example.com',  '$2b$10$abcdefghijklmnopqrstuv', 'salt3', 0);

-- =========================
-- Categorías (3)
-- =========================
INSERT INTO category (id, name, description)
VALUES
  (1, 'Estafa',             'Reportes de fraudes o engaños en línea.'),
  (2, 'Phishing',           'Intentos de obtener información sensible mediante engaños.'),
  (3, 'Malvertising',       'Publicidad maliciosa que redirige a sitios peligrosos.');

-- =========================
-- Status (3)
-- =========================
-- Nota: solo 3 estados como pediste
INSERT INTO status (id, name)
VALUES
  (1, 'pending'),
  (2, 'in_progress'),
  (3, 'resolved'),
  (4, 'rejected');

-- =========================
-- Tags (3)
-- =========================
INSERT INTO tag (id, name, use_num)
VALUES
  (1, 'Electronicos', 0),
  (2, 'Banco',    0),
  (3, 'Redes Sociales', 0);

-- =========================
-- Reports (3)
-- =========================
-- user_id -> 1..3, category_id -> 1..3, status_id -> 1..3
INSERT INTO report (
  id, user_id, category_id, title, description, url, status_id, image_url
) VALUES
  (1, 1, 1, 'Tienda falsa de electrónicos con “90% OFF”',
     'Sitio que oferta consolas y laptops a precios irreales; solo acepta transferencias/SPEI y cambia de dominio frecuentemente.',
     'https://example.com/estafa-electronicos', 1, 'https://img.example.com/estafa1.png'),

  (2, 2, 2, 'Correo de phishing: “Verifica tu cuenta bancaria”',
     'Email con remitente parecido al banco y enlace a dominio sospechoso que solicita usuario/contraseña y OTP.',
     'https://example.com/phishing-banco', 2, NULL),

  (3, 3, 3, 'Malvertising en banner: redirección a descarga maliciosa',
     'Anuncio en red social redirige a un sitio que intenta descargar un instalador .exe con supuesta “actualización de seguridad”.',
     'https://example.com/malvertising-campana', 3, 'https://img.example.com/malv3.jpg');

-- =========================
-- Report Status History (3)
-- =========================
-- from_status puede ser NULL en el primer evento
INSERT INTO report_status_history (id, report_id, from_status, to_status, note, changed_by)
VALUES
  (1, 1, NULL, 1, 'Reporte creado por el sistema.', 1),
  (2, 2, 1,    2, 'Asignado a cuadrilla de mantenimiento.', 1),
  (3, 3, 2,    3, 'Trabajo completado y validado.', 2);

-- =========================
-- Report ↔ Tag (3)
-- =========================
INSERT INTO report_has_tag (report_id, tag_id)
VALUES
  (1, 1),  
  (2, 2),  
  (3, 3);

-- =========================
-- Notificaciones (3)
-- =========================
INSERT INTO notifications (id, user_id, seen)
VALUES
  (1, 1, 0),
  (2, 2, 0),
  (3, 3, 1);