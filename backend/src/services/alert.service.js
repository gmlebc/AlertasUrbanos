const AlertModel = require('../models/alert.model');

const AlertService = {
  async getAll(filters)       { return AlertModel.findAll(filters); },

  async getById(id) {
    const alert = await AlertModel.findById(id);
    if (!alert) throw { status: 404, message: `Alerta #${id} não encontrado.` };
    return alert;
  },

  async create(data)            { return AlertModel.create(data); },

  async updateStatus(id, status) {
    await this.getById(id);
    return AlertModel.updateStatus(id, status);
  },

  async update(id, data) {
    await this.getById(id);
    return AlertModel.update(id, data);
  },

  async delete(id) {
    await this.getById(id);
    return AlertModel.delete(id);
  },

  async getStats() { return AlertModel.getStats(); },
};

module.exports = AlertService;
