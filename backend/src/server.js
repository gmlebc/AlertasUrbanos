require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const alertRoutes = require('./routes/alert.routes');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', methods: ['GET','POST','PUT','PATCH','DELETE'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/alertas', alertRoutes);
app.use((_req, res) => res.status(404).json({ success: false, message: 'Rota não encontrada.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log('🚀 Servidor rodando em http://localhost:' + PORT);
});
