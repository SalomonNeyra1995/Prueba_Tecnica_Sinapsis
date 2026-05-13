const express = require('express');
const { query } = require('express-validator');
const { obtenerReporteMensajes } = require('../controllers/reportes.controller');

const router = express.Router();

// Validaciones
const validarReporte = [
    query('mes')
        .notEmpty()
        .withMessage('El parámetro mes es obligatorio')
        .matches(/^\d{4}-\d{2}$/)
        .withMessage('Formato de mes inválido. Use YYYY-MM'),
    query('cliente_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('cliente_id debe ser un número entero positivo')
];

// Ruta para obtener reporte
router.get('/mensajes', validarReporte, obtenerReporteMensajes);

module.exports = router;