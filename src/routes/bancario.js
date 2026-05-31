const express = require('express');
const router = express.Router();
const {
    getTipoCambio,
    getHistorial,
    createTipoCambio,
    convertir
} = require('../controllers/bancarioController');

router.get('/tipo-cambio', getTipoCambio);
router.get('/historial', getHistorial);
router.post('/tipo-cambio', createTipoCambio);
router.post('/convertir', convertir);

module.exports = router;