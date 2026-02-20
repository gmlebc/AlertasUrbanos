# AlertasUrbanos
## Rotas
- GET /alertas/estatisticas → estatísticas agrupadas

## Como rodar
1. Criar o bd  urban_alerts e rodar a query psql do arquivo database/schema.sql
2. cd backend && cp .env.example (editar) .env && npm install && npm run dev
3. cd frontend && npm install && npm run dev
## Testar
Importe o Postman collection e rode todas as pastas (US01 a US05)
