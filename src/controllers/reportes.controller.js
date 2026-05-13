const pool = require('../config/database');
const { validationResult } = require('express-validator');

const obtenerReporteMensajes = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { mes, cliente_id } = req.query;
    
    if (!mes) {
        return res.status(400).json({ error: 'El parámetro mes es obligatorio' });
    }
    
    try {
        const [year, month] = mes.split('-');
        
        if (!year || !month || isNaN(year) || isNaN(month)) {
            return res.status(400).json({ error: 'Formato de mes inválido. Use YYYY-MM' });
        }
        
        let query = `
            SELECT 
                mensajes.estado_envio,
                COUNT(*) as total
            FROM mensajes
            INNER JOIN campanas ON mensajes.campana_id = campanas.id
            WHERE campanas.activa = 1
                AND mensajes.activo = 1
                AND YEAR(campanas.fecha_programacion) = ?
                AND MONTH(campanas.fecha_programacion) = ?
        `;
        
        const params = [parseInt(year), parseInt(month)];
        
        if (cliente_id) {
            query += ` AND campanas.cliente_id = ?`;
            params.push(parseInt(cliente_id));
        }
        
        query += ` GROUP BY mensajes.estado_envio`;
        
        const [results] = await pool.execute(query, params);
        
        res.json(results);
        
    } catch (error) {
        console.error('Error en reporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerReporteMensajes
};
