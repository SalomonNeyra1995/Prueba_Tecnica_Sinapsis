const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const campanasRoutes = require('./routes/campanas.routes');
const reportesRoutes = require('./routes/reportes.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas
app.use('/api/campanas', campanasRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
