const pool = require('../config/database');
const { validationResult } = require('express-validator');

const crearCampana = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { cliente_id, nombre, fecha_programacion, mensajes } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Verificar si el cliente existe
        const [cliente] = await connection.execute(
            'SELECT id FROM clientes WHERE id = ?',
            [cliente_id]
        );

        if (cliente.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Verificar que la fecha sea futura
        const fechaActual = new Date();
        const fechaProgramacion = new Date(fecha_programacion);
        
        if (fechaProgramacion <= fechaActual) {
            await connection.rollback();
            return res.status(400).json({ error: 'La fecha de programación debe ser futura' });
        }

        // Insertar campaña
        const [campanaResult] = await connection.execute(
            'INSERT INTO campanas (cliente_id, nombre, fecha_programacion) VALUES (?, ?, ?)',
            [cliente_id, nombre, fecha_programacion]
        );

        const campanaId = campanaResult.insertId;

        // Insertar mensajes
        if (mensajes && mensajes.length > 0) {
            for (const mensaje of mensajes) {
                await connection.execute(
                    'INSERT INTO mensajes (campana_id, contenido) VALUES (?, ?)',
                    [campanaId, mensaje.contenido]
                );
            }
        }

        await connection.commit();

        res.status(201).json({
            message: 'Campaña creada exitosamente',
            campana_id: campanaId,
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