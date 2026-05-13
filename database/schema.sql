-- Crear base de datos
CREATE DATABASE IF NOT EXISTS sinapsis_db;
USE sinapsis_db;

-- =============================================
-- Tabla: Cliente
-- =============================================
CREATE TABLE IF NOT EXISTS Cliente (
    idCliente INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1 COMMENT '0: Inactivo, 1: Activo'
);

-- =============================================
-- Tabla: Usuario
-- =============================================
CREATE TABLE IF NOT EXISTS Usuario (
    idUsuario INT(11) PRIMARY KEY AUTO_INCREMENT,
    idCliente INT(11) NOT NULL,
    usuario VARCHAR(30) NOT NULL,
    estado TINYINT(1) DEFAULT 1 COMMENT '0: Inactivo, 1: Activo',
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente) ON DELETE CASCADE,
    INDEX idx_idCliente (idCliente)
);

-- =============================================
-- Tabla: Campania
-- =============================================
CREATE TABLE IF NOT EXISTS Campania (
    idCampania INT(11) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    idUsuario INT(11) NOT NULL,
    fechaHoraProgramacion DATETIME NOT NULL,
    estado TINYINT(1) DEFAULT 1 COMMENT '0: Inactivo, 1: Activo',
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
    INDEX idx_idUsuario (idUsuario),
    INDEX idx_fechaProgramacion (fechaHoraProgramacion)
);

-- =============================================
-- Tabla: Mensaje
-- =============================================
CREATE TABLE IF NOT EXISTS Mensaje (
    idMensaje INT(11) PRIMARY KEY AUTO_INCREMENT,
    idCampania INT(11) NOT NULL,
    estadoEnvio INT(11) NOT NULL COMMENT '1: Pendiente, 2: Enviado, 3: Error',
    fechaHoraEnvio DATETIME,
    mensaje VARCHAR(160) NOT NULL,
    estado TINYINT(1) DEFAULT 1 COMMENT '0: Inactivo, 1: Activo',
    FOREIGN KEY (idCampania) REFERENCES Campania(idCampania) ON DELETE CASCADE,
    INDEX idx_idCampania (idCampania),
    INDEX idx_estadoEnvio (estadoEnvio)
);

-- =============================================
-- INSERTAR DATOS DE PRUEBA
-- =============================================

-- Insertar Clientes
INSERT INTO Cliente (idCliente, nombre, estado) VALUES
(1, 'Cliente Uno', 1),
(2, 'Cliente Dos', 1),
(3, 'Cliente Tres', 1);

-- Insertar Usuarios
INSERT INTO Usuario (idUsuario, idCliente, usuario, estado) VALUES
(1, 1, 'usuario1', 1),
(2, 1, 'usuario2', 1),
(3, 2, 'usuario3', 1),
(4, 3, 'usuario4', 1);

-- Insertar Campañas
INSERT INTO Campania (idCampania, nombre, idUsuario, fechaHoraProgramacion, estado) VALUES
(1, 'Campaña Black Friday', 1, '2025-11-29 10:00:00', 1),
(2, 'Campaña Cyber Monday', 1, '2025-12-02 10:00:00', 1),
(3, 'Campaña Navidad', 3, '2025-12-25 09:00:00', 1),
(4, 'Campaña Año Nuevo', 4, '2026-01-01 00:00:00', 1);

-- Insertar Mensajes
INSERT INTO Mensaje (idMensaje, idCampania, estadoEnvio, fechaHoraEnvio, mensaje, estado) VALUES
(1, 1, 1, NULL, 'Oferta 50% off - Black Friday', 1),
(2, 1, 2, '2025-11-29 10:05:00', '2x1 en productos seleccionados', 1),
(3, 1, 3, '2025-11-29 10:00:00', 'Oferta relámpago', 1),
(4, 2, 1, NULL, 'Descuento especial Cyber Monday', 1),
(5, 3, 2, '2025-12-25 09:05:00', 'Feliz Navidad', 1),
(6, 3, 3, '2025-12-25 09:00:00', 'Regalo sorpresa', 1),
(7, 4, 1, NULL, 'Feliz Año Nuevo 2026', 1);

-- =============================================
-- CONSULTAS DE VERIFICACIÓN
-- =============================================

-- Ver todos los clientes
SELECT * FROM Cliente;

-- Ver usuarios por cliente
SELECT c.nombre, u.usuario 
FROM Cliente c 
INNER JOIN Usuario u ON c.idCliente = u.idCliente;

-- Ver campañas con usuario y cliente
SELECT 
    ca.idCampania,
    ca.nombre AS campania,
    u.usuario,
    c.nombre AS cliente,
    ca.fechaHoraProgramacion
FROM Campania ca
INNER JOIN Usuario u ON ca.idUsuario = u.idUsuario
INNER JOIN Cliente c ON u.idCliente = c.idCliente;

-- Ver mensajes por campaña
SELECT 
    m.idMensaje,
    ca.nombre AS campania,
    CASE m.estadoEnvio
        WHEN 1 THEN 'Pendiente'
        WHEN 2 THEN 'Enviado'
        WHEN 3 THEN 'Error'
    END AS estado,
    m.mensaje
FROM Mensaje m
INNER JOIN Campania ca ON m.idCampania = ca.idCampania;
