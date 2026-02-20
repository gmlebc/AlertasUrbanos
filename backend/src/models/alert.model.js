const db = require('./db');

const VALID_TYPES  = ['enchente','deslizamento','incendio','acidente','obra','criminalidade','falta_energia','outros'];
const VALID_STATUS = ['ativo', 'resolvido'];

const AlertModel = {
  VALID_TYPES,
  VALID_STATUS,

  async findAll({ type, status } = {}) {
    let query = 'SELECT * FROM alerts WHERE 1=1';
    const values = [];
    let i = 1;
    if (type   && VALID_TYPES.includes(type))    { query += ` AND type = $${i++}`;   values.push(type); }
    if (status && VALID_STATUS.includes(status)) { query += ` AND status = $${i++}`; values.push(status); }
    query += ' ORDER BY created_at DESC';
    const { rows } = await db.query(query, values);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM alerts WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create({ title, description, type, location, latitude, longitude }) {
    const { rows } = await db.query(
      `INSERT INTO alerts (title, description, type, location, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, type, location, latitude ?? null, longitude ?? null]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    const { rows } = await db.query(
      'UPDATE alerts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0] || null;
  },

  async update(id, { title, description, type, location, latitude, longitude, status }) {
    const { rows } = await db.query(
      `UPDATE alerts SET title=$1, description=$2, type=$3, location=$4,
       latitude=$5, longitude=$6, status=$7 WHERE id=$8 RETURNING *`,
      [title, description, type, location, latitude ?? null, longitude ?? null, status, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rows } = await db.query('DELETE FROM alerts WHERE id=$1 RETURNING id', [id]);
    return rows[0] || null;
  },

  async getStats() {
    const [byType, byStatus, recent, timeline] = await Promise.all([
      db.query('SELECT type, COUNT(*)::int AS count FROM alerts GROUP BY type ORDER BY count DESC'),
      db.query('SELECT status, COUNT(*)::int AS count FROM alerts GROUP BY status'),
      db.query("SELECT COUNT(*)::int AS count FROM alerts WHERE created_at >= NOW() - INTERVAL '24 hours'"),
      db.query(`
        SELECT DATE(created_at) AS day, COUNT(*)::int AS count
        FROM alerts
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY day ASC
      `)
    ]);
    return {
      byType:    byType.rows,
      byStatus:  byStatus.rows,
      recent24h: recent.rows[0].count,
      timeline:  timeline.rows,
    };
  },
};

module.exports = AlertModel;
