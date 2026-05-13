const express = require('express');
const { body } = require('express-validator');
const { crearCampana } = require('../controllers/campanas.controller');

const router = express.Router();

// Validaciones
const validarCampana = [
    body('cliente_id')
        .isInt({ min: 1 })
        .withMessage('cliente_id debe ser un número entero positivo'),
    body('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isString()
        .isLength({ min: 3, max: 100 })
        .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('fecha_programacion')
        .notEmpty()
        .withMessage('La fecha de programación es obligatoria')
        .isDate()
        .withMessage('Formato de fecha inválido'),
    body('mensajes')
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos un mensaje'),
    body('mensajes.*.contenido')
        .notEmpty()
        .withMessage('El contenido del mensaje es obligatorio')
        .isLength({ min: 1, max: 500 })
        .withMessage('El mensaje no puede exceder 500 caracteres')
];

// Ruta para crear campaña
router.post('/', validarCampana, crearCampana);

module.exports = router;