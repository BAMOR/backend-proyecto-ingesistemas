const express = require('express');
const router = express.Router();
const {
    getImpuestos,
    getRegistrosByDpi,
    createRegistro,
    updateEstado
} = require('../controllers/tributarioController');

router.get('/impuestos', getImpuestos);
router.get('/registros/:dpi', getRegistrosByDpi);
router.post('/registros', createRegistro);
router.put('/registros/:id', updateEstado);

module.exports = router;