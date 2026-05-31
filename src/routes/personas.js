const express = require('express');
const router = express.Router();
const {
    getPersonas,
    getPersonaByDpi,
    createPersona,
    updatePersona,
    deletePersona
} = require('../controllers/personasController');

router.get('/', getPersonas);
router.get('/:dpi', getPersonaByDpi);
router.post('/', createPersona);
router.put('/:dpi', updatePersona);
router.delete('/:dpi', deletePersona);

module.exports = router;