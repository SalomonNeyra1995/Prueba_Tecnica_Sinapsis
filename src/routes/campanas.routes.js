const express = require('express');
const { body } = require('express-validator');
const { crearCampana } = require('../controllers/campanas.controller');

const router = express.Router();

// Validaciones
const validarCampana = [
    body('idUsuario')
        .isInt({ min: 1 })
        .withMessage('idUsuario debe ser un número entero positivo'),
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isString()
        .isLength({ min: 3, max: 200 })
        .withMessage('El nombre debe tener entre 3 y 200 caracteres'),
    body('fechaHoraProgramacion')
        .notEmpty()
        .withMessage('La fecha de programación es obligatoria')
        .isISO8601()
        .withMessage('Formato de fecha inválido. Use YYYY-MM-DD HH:MM:SS'),
    body('mensajes')
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos un mensaje'),
    body('mensajes.*.contenido')
        .notEmpty()
        .withMessage('El contenido del mensaje es obligatorio')
        .isLength({ min: 1, max: 160 })
        .withMessage('El mensaje no puede exceder 160 caracteres')
];

// Ruta para crear campaña
router.post('/', validarCampana, crearCampana);

module.exports = router;
