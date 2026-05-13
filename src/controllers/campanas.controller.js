const pool = require('../config/database');
const { validationResult } = require('express-validator');

const crearCampana = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { idUsuario, nombre, fechaHoraProgramacion, mensajes } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Verificar si el usuario existe y está activo
        const [usuario] = await connection.execute(
            'SELECT idUsuario FROM Usuario WHERE idUsuario = ? AND estado = 1',
            [idUsuario]
        );

        if (usuario.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Usuario no encontrado o inactivo' });
        }

        // Verificar que la fecha sea futura
        const fechaActual = new Date();
        const fechaProgramacion = new Date(fechaHoraProgramacion);
        
        if (fechaProgramacion <= fechaActual) {
            await connection.rollback();
            return res.status(400).json({ error: 'La fecha de programación debe ser futura' });
        }

        // Insertar campaña
        const [campanaResult] = await connection.execute(
            'INSERT INTO Campania (nombre, idUsuario, fechaHoraProgramacion, estado) VALUES (?, ?, ?, 1)',
            [nombre, idUsuario, fechaHoraProgramacion]
        );

        const idCampania = campanaResult.insertId;

        // Insertar mensajes (estadoEnvio: 1 = Pendiente)
        if (mensajes && mensajes.length > 0) {
            for (const mensaje of mensajes) {
                await connection.execute(
                    'INSERT INTO Mensaje (idCampania, estadoEnvio, mensaje, estado) VALUES (?, 1, ?, 1)',
                    [idCampania, mensaje.contenido]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            message: 'Campaña creada exitosamente',
            idCampania: idCampania,
            total_mensajes: mensajes?.length || 0
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error al crear campaña:', error);
        res.status(500).json({ error: 'Error al crear la campaña' });
    } finally {
        connection.release();
    }
};

module.exports = {
    crearCampana
};
