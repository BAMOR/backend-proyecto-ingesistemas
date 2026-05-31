const db = require('../db/connection');

// Obtener tipo de cambio actual
const getTipoCambio = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM tipos_de_cambio ORDER BY fecha DESC LIMIT 1'
        );
        if (rows.length === 0) return res.status(404).json({ mensaje: 'No hay tipo de cambio registrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener historial de tipos de cambio
const getHistorial = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM tipos_de_cambio ORDER BY fecha DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Registrar nuevo tipo de cambio
const createTipoCambio = async (req, res) => {
    try {
        const { fecha, quetzales_por_dolar, fuente } = req.body;
        const [result] = await db.query(
            'INSERT INTO tipos_de_cambio (fecha, quetzales_por_dolar, fuente) VALUES (?, ?, ?)',
            [fecha, quetzales_por_dolar, fuente]
        );
        res.status(201).json({ mensaje: 'Tipo de cambio registrado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Convertir quetzales a dolares o viceversa
const convertir = async (req, res) => {
    try {
        const { monto, de } = req.body; // de: 'GTQ' o 'USD'

        const [rows] = await db.query(
            'SELECT * FROM tipos_de_cambio ORDER BY fecha DESC LIMIT 1'
        );
        if (rows.length === 0) return res.status(404).json({ mensaje: 'No hay tipo de cambio registrado' });

        const tipoCambio = rows[0].quetzales_por_dolar;
        let resultado;

        if (de === 'GTQ') {
            resultado = { de: 'GTQ', a: 'USD', monto, resultado: (monto / tipoCambio).toFixed(2) };
        } else if (de === 'USD') {
            resultado = { de: 'USD', a: 'GTQ', monto, resultado: (monto * tipoCambio).toFixed(2) };
        } else {
            return res.status(400).json({ mensaje: 'El campo "de" debe ser GTQ o USD' });
        }

        res.json({ ...resultado, tipo_cambio: tipoCambio });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getTipoCambio, getHistorial, createTipoCambio, convertir };