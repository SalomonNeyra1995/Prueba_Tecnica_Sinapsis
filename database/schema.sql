-- Crear base de datos
CREATE DATABASE IF NOT EXISTS sinapsis_db;
USE sinapsis_db;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de campañas
CREATE TABLE IF NOT EXISTS campanas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_programacion DATE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_fecha_programacion (fecha_programacion),
    INDEX idx_cliente_activo (cliente_id, activa)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campana_id INT NOT NULL,
    contenido TEXT NOT NULL,
    estado_envio ENUM('pendiente', 'enviado', 'fallido', 'cancelado') DEFAULT 'pendiente',
    activo BOOLEAN DEFAULT TRUE,
    fecha_envio DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campana_id) REFERENCES campanas(id) ON DELETE CASCADE,
    INDEX idx_estado_activo (estado_envio, activo),
    INDEX idx_campana_activo (campana_id, activo)
);

-- Insertar datos de prueba
INSERT INTO clientes (nombre, email, telefono) VALUES
('Cliente Uno', 'cliente1@example.com', '123456789'),
('Cliente Dos', 'cliente2@example.com', '987654321'),
('Cliente Tres', 'cliente3@example.com', '555555555');

INSERT INTO campanas (cliente_id, nombre, fecha_programacion, activa) VALUES
(1, 'Campaña Black Friday', '2025-11-29', TRUE),
(1, 'Campaña Cyber Monday', '2025-12-02', TRUE),
(2, 'Campaña Navidad', '2025-12-25', TRUE),
(3, 'Campaña Año Nuevo', '2026-01-01', TRUE);

INSERT INTO mensajes (campana_id, contenido, estado_envio, activo) VALUES
(1, 'Oferta 50% off', 'pendiente', TRUE),
(1, '2x1 en productos', 'enviado', TRUE),
(2, 'Descuento especial', 'pendiente', TRUE),
(3, 'Feliz navidad', 'enviado', TRUE),
(3, 'Regalo sorpresa', 'fallido', TRUE),
(4, 'Año nuevo 2026', 'pendiente', TRUE);