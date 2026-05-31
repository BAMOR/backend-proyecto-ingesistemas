const db = require('../db/connection');

// Obtener todas las personas
const getPersonas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM personas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una persona por DPI
const getPersonaByDpi = async (req, res) => {
    try {
        const { dpi } = req.params;
        const [rows] = await db.query('SELECT * FROM personas WHERE dpi = ?', [dpi]);
        if (rows.length === 0) return res.status(404).json({ mensaje: 'Persona no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear persona
const createPersona = async (req, res) => {
    try {
        const { dpi, nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, correo } = req.body;
        const [result] = await db.query(
            'INSERT INTO personas (dpi, nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [dpi, nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, correo]
        );
        res.status(201).json({ mensaje: 'Persona creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar persona
const updatePersona = async (req, res) => {
    try {
        const { dpi } = req.params;
        const { nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, correo } = req.body;
        const [result] = await db.query(
            'UPDATE personas SET nombres=?, apellidos=?, fecha_nacimiento=?, genero=?, direccion=?, telefono=?, correo=? WHERE dpi=?',
            [nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, correo, dpi]
        );
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Persona no encontrada' });
        res.json({ mensaje: 'Persona actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar persona
const deletePersona = async (req, res) => {
    try {
        const { dpi } = req.params;
        const [result] = await db.query('DELETE FROM personas WHERE dpi = ?', [dpi]);
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Persona no encontrada' });
        res.json({ mensaje: 'Persona eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPersonas, getPersonaByDpi, createPersona, updatePersona, deletePersona };