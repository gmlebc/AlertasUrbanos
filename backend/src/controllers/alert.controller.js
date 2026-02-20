const { validationResult } = require('express-validator');
const AlertService = require('../services/alert.service');

const ok   = (res, data, msg, status = 200) => res.status(status).json({ success: true,  data, message: msg });
const fail = (res, err) => res.status(err.status || 500).json({ success: false, message: err.message || 'Erro interno.' });

const AlertController = {
  // GET /api/alerts
  async index(req, res) {
    try {
      const data = await AlertService.getAll(req.query);
      return ok(res, data, undefined, 200);
    } catch (e) { return fail(res, e); }
  },

  // GET /api/alerts/stats
  async stats(req, res) {
    try {
      const data = await AlertService.getStats();
      return ok(res, data);
    } catch (e) { return fail(res, e); }
  },

  // GET /api/alerts/:id
  async show(req, res) {
    try {
      const data = await AlertService.getById(parseInt(req.params.id));
      return ok(res, data);
    } catch (e) { return fail(res, e); }
  },

  // POST /api/alerts
  async store(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(422).json({ success: false, errors: errs.array() });
    try {
      const data = await AlertService.create(req.body);
      return ok(res, data, 'Alerta criado com sucesso.', 201);
    } catch (e) { return fail(res, e); }
  },

  // PATCH /api/alerts/:id/status
  async updateStatus(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(422).json({ success: false, errors: errs.array() });
    try {
      const data = await AlertService.updateStatus(parseInt(req.params.id), req.body.status);
      return ok(res, data, 'Status atualizado com sucesso.');
    } catch (e) { return fail(res, e); }
  },

  // PUT /api/alerts/:id
  async update(req, res) {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(422).json({ success: false, errors: errs.array() });
    try {
      const data = await AlertService.update(parseInt(req.params.id), req.body);
      return ok(res, data, 'Alerta atualizado com sucesso.');
    } catch (e) { return fail(res, e); }
  },

  // DELETE /api/alerts/:id
  async destroy(req, res) {
    try {
      await AlertService.delete(parseInt(req.params.id));
      return ok(res, null, 'Alerta removido com sucesso.');
    } catch (e) { return fail(res, e); }
  },
};

module.exports = AlertController;
