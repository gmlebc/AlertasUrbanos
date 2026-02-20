const { body } = require('express-validator');
const { VALID_TYPES, VALID_STATUS } = require('../models/alert.model');

const createAlertRules = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório.').isLength({ max: 150 }).withMessage('Máximo 150 caracteres.'),
  body('description').trim().notEmpty().withMessage('Descrição é obrigatória.'),
  body('type').isIn(VALID_TYPES).withMessage('Tipo inválido.'),
  body('location').trim().notEmpty().withMessage('Local é obrigatório.'),
  body('latitude').optional({ nullable: true }).isFloat({ min: -90,  max: 90  }).withMessage('Latitude inválida.'),
  body('longitude').optional({ nullable: true }).isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida.'),
];

const updateAlertRules = [
  ...createAlertRules,
  body('status').isIn(VALID_STATUS).withMessage('Status inválido.'),
];

const updateStatusRules = [
  body('status').isIn(VALID_STATUS).withMessage('Status inválido. Use: ativo ou resolvido.'),
];

module.exports = { createAlertRules, updateAlertRules, updateStatusRules };
