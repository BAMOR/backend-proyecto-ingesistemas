const express = require('express');
const cors = require('cors');
require('dotenv').config();

const personasRoutes = require('./src/routes/personas');
const tributarioRoutes = require('./src/routes/tributario');
const bancarioRoutes = require('./src/routes/bancario');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/personas', personasRoutes);
app.use('/api/tributario', tributarioRoutes);
app.use('/api/bancario', bancarioRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API funcionando correctamente 🚀' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});