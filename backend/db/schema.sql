-- MediChain database schema (idempotent — safe to run repeatedly).
-- Applied by `npm run migrate` (backend/db/migrate.js) and by the Postgres
-- container's init step in docker-compose.

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE,
    password_hash TEXT NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'patient'
                  CHECK (role IN ('patient', 'doctor', 'admin')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every report submission / verification, linked to the authenticated user.
CREATE TABLE IF NOT EXISTS reports (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(id) ON DELETE CASCADE,
    patient_address VARCHAR(42) NOT NULL,
    file_name       VARCHAR(255),
    content_hash    VARCHAR(66) NOT NULL,
    ipfs_cid        VARCHAR(100),
    tx_hash         VARCHAR(80),
    ml_prediction   VARCHAR(100),
    ml_confidence   NUMERIC(5, 4),
    action          VARCHAR(20) NOT NULL DEFAULT 'submit'
                    CHECK (action IN ('submit', 'verify', 'repudiate')),
    status          VARCHAR(30) NOT NULL DEFAULT 'recorded',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_created
    ON reports (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_patient_address
    ON reports (patient_address);
