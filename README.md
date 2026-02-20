# Sprint 05 — PROJETO COMPLETO + US05: Dashboard Estatístico
## Rotas
- GET /alertas/estatisticas → estatísticas agrupadas
## Novidades nesta sprint
- Endpoint GET /alertas/estatisticas
- DashboardPage com Chart.js (Doughnut + Bar)
- Cards: total, ativos, resolvidos, últimas 24h
- Timeline dos últimos 7 dias
## Como rodar
1. psql -U postgres -d urban_alerts -f database/schema.sql
2. cd backend && cp .env.example .env && npm install && npm run dev
3. cd frontend && npm install && npm run dev
## Testar
Importe o Postman collection e rode todas as pastas (US01 a US05)
