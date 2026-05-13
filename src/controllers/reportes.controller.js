const pool = require('../config/database');
const { validationResult } = require('express-validator');

const obtenerReporteMensajes = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { mes, idCliente } = req.query;
    
    if (!mes) {
        return res.status(400).json({ error: 'El parámetro mes es obligatorio' });
    }
    
    try {
        const [year, month] = mes.split('-');
        
        if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).json({ error: 'Formato de mes inválido. Use YYYY-MM' });
        }
        
        // Mapeo de estados de envío
        // 1: Pendiente, 2: Enviado, 3: Error
        
        let query = `
            SELECT 
                CASE 
                    WHEN m.estadoEnvio = 1 THEN 'Pendiente'
                    WHEN m.estadoEnvio = 2 THEN 'Enviado'
                    WHEN m.estadoEnvio = 3 THEN 'Error'
                    ELSE 'Desconocido'
                END AS estado_envio,
                COUNT(*) as total
            FROM Mensaje m
            INNER JOIN Campania c ON m.idCampania = c.idCampania
            INNER JOIN Usuario u ON c.idUsuario = u.idUsuario
            WHERE c.estado = 1
                AND m.estado = 1
                AND YEAR(c.fechaHoraProgramacion) = ?
                AND MONTH(c.fechaHoraProgramacion) = ?
        `;
        
        const params = [parseInt(year), parseInt(month)];
        
        if (idCliente) {
            query += ` AND u.idCliente = ?`;
            params.push(parseInt(idCliente));
        }
        
        query += ` GROUP BY m.estadoEnvio ORDER BY m.estadoEnvio`;
        
        const [results] = await pool.execute(query, params);
        
        res.json(results);
        
    } catch (error) {
        console.error('Error en reporte:', error);
        res.status(500).json({ error: 'Error al generar el reporte' });
    }
};

module.exports = {
    obtenerReporteMensajes
};
