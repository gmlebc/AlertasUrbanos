const express = require('express');
const router  = express.Router();
const AlertController = require('../controllers/alert.controller');
const { createAlertRules, updateAlertRules, updateStatusRules } = require('../middleware/validators');

// US05 – /estatisticas (antes de /:id para não conflitar)
router.get('/estatisticas',   AlertController.stats);

// US02 – Listar
router.get('/',               AlertController.index);
// Buscar por ID
router.get('/:id',            AlertController.show);
// US01 – Criar
router.post('/',              createAlertRules,  AlertController.store);
// Atualizar completo
router.put('/:id',            updateAlertRules,  AlertController.update);
// US04 – Atualizar status (PATCH /alertas/:id)
router.patch('/:id',          updateStatusRules, AlertController.updateStatus);
// Deletar
router.delete('/:id',         AlertController.destroy);

module.exports = router;
