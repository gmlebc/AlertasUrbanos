-- ================================================
-- Sistema Web de Alertas Urbanos — Schema v1.0
-- ================================================

-- Criar banco (rodar separadamente se necessário)
-- CREATE DATABASE urban_alerts;
-- \c urban_alerts;

-- Extensão para timestamps com timezone
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum para tipo de alerta
DO $$ BEGIN
  CREATE TYPE alert_type AS ENUM (
    'enchente', 'deslizamento', 'incendio',
    'acidente', 'obra', 'criminalidade', 'falta_energia', 'outros'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Enum para status
DO $$ BEGIN
  CREATE TYPE alert_status AS ENUM ('ativo', 'resolvido');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabela principal de alertas
CREATE TABLE IF NOT EXISTS alerts (
  id          SERIAL        PRIMARY KEY,
  title       VARCHAR(150)  NOT NULL,
  description TEXT          NOT NULL,
  type        alert_type    NOT NULL,
  status      alert_status  NOT NULL DEFAULT 'ativo',
  location    VARCHAR(255)  NOT NULL,
  latitude    DECIMAL(9,6),
  longitude   DECIMAL(9,6),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alerts_type   ON alerts (type);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts (status);
CREATE INDEX IF NOT EXISTS idx_alerts_date   ON alerts (created_at DESC);

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_alerts_updated_at ON alerts;
CREATE TRIGGER trg_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ===== Seed Data =====
INSERT INTO alerts (title, description, type, status, location, latitude, longitude) VALUES
  ('Alagamento na Av. Paulista',
   'Via completamente alagada após chuvas intensas. Trânsito interrompido. Equipes da Defesa Civil no local.',
   'enchente', 'ativo', 'Av. Paulista, 1000 — São Paulo, SP', -23.5616, -46.6560),
  ('Deslizamento no Morro da Cruz',
   'Deslizamento de terra registrado após fortes chuvas. Famílias evacuadas preventivamente.',
   'deslizamento', 'ativo', 'Morro da Cruz — Florianópolis, SC', -27.5950, -48.5480),
  ('Incêndio em vegetação controlado',
   'Incêndio em área de mata nativa foi controlado pelo Corpo de Bombeiros após 3 horas.',
   'incendio', 'resolvido', 'Parque Estadual — Campinas, SP', -22.9070, -47.0630),
  ('Acidente na BR-101 km 203',
   'Colisão envolvendo 3 veículos. Faixa da direita bloqueada. Trânsito lento por 5 km.',
   'acidente', 'ativo', 'BR-101, km 203 — Joinville, SC', -26.3040, -48.8460),
  ('Obra emergencial — Rua das Flores',
   'Rompimento de tubulação de água. Rua interditada parcialmente. Previsão: 8h.',
   'obra', 'ativo', 'Rua das Flores, 500 — Curitiba, PR', -25.4280, -49.2710),
  ('Falta de energia no Centro',
   'Fornecimento restabelecido após substituição de transformador danificado.',
   'falta_energia', 'resolvido', 'Bairro Centro — Porto Alegre, RS', -30.0346, -51.2177),
  ('Assalto à mão armada — Praça da Sé',
   'Ocorrência registrada. Suspeito detido pela PM. Área com reforço policial.',
   'criminalidade', 'resolvido', 'Praça da Sé — São Paulo, SP', -23.5503, -46.6344),
  ('Vazamento de gás — Rua XV',
   'Suspeita de vazamento em edifício residencial. Bombeiros e concessionária acionados.',
   'outros', 'ativo', 'Rua XV de Novembro — Recife, PE', -8.0631, -34.8711)
ON CONFLICT DO NOTHING;
