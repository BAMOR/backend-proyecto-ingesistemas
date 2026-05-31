const db = require('../db/connection');

// Obtener todos los impuestos
const getImpuestos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM impuestos WHERE activo = true');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener registros tributarios de una persona por DPI
const getRegistrosByDpi = async (req, res) => {
    try {
        const { dpi } = req.params;
        const [persona] = await db.query('SELECT * FROM personas WHERE dpi = ?', [dpi]);
        if (persona.length === 0) return res.status(404).json({ mensaje: 'Persona no encontrada' });

        const [rows] = await db.query(
            `SELECT rt.*, i.nombre as impuesto, i.porcentaje, p.nombres, p.apellidos
             FROM registros_tributarios rt
             JOIN impuestos i ON rt.impuesto_id = i.id
             JOIN personas p ON rt.persona_id = p.id
             WHERE p.dpi = ?`,
            [dpi]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Calcular y crear registro tributario
const createRegistro = async (req, res) => {
    try {
        const { dpi, impuesto_id, monto_base, fecha_registro } = req.body;

        const [persona] = await db.query('SELECT * FROM personas WHERE dpi = ?', [dpi]);
        if (persona.length === 0) return res.status(404).json({ mensaje: 'Persona no encontrada' });

        const [impuesto] = await db.query('SELECT * FROM impuestos WHERE id = ?', [impuesto_id]);
        if (impuesto.length === 0) return res.status(404).json({ mensaje: 'Impuesto no encontrado' });

        const monto_calculado = (monto_base * impuesto[0].porcentaje) / 100;

        const [result] = await db.query(
            'INSERT INTO registros_tributarios (persona_id, impuesto_id, monto_base, monto_calculado, fecha_registro) VALUES (?, ?, ?, ?, ?)',
            [persona[0].id, impuesto_id, monto_base, monto_calculado, fecha_registro]
        );

        res.status(201).json({
            mensaje: 'Registro tributario creado',
            id: result.insertId,
            monto_base,
            monto_calculado,
            impuesto: impuesto[0].nombre,
            porcentaje: impuesto[0].porcentaje
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar estado de un registro
const updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const [result] = await db.query(
            'UPDATE registros_tributarios SET estado = ? WHERE id = ?',
            [estado, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Registro no encontrado' });
        res.json({ mensaje: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getImpuestos, getRegistrosByDpi, createRegistro, updateEstado };