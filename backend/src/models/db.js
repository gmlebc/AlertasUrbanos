const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'urban_alerts',
});

pool.on('connect', () => console.log('✅ Conectado ao PostgreSQL'));
pool.on('error',   (err) => console.error('❌ Erro PostgreSQL:', err.message));

module.exports = pool;
