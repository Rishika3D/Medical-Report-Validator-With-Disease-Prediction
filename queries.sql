-- 1. Core users
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 2. Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 3. Patients & Doctors
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    contact_info JSONB,
    created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    specialization VARCHAR(150),
    registration_number VARCHAR(100),
    hospital_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 4. Document storage
CREATE TABLE document (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    doc_name VARCHAR(200),
    file_path TEXT NOT NULL,
    content TEXT,
    uploaded_time TIMESTAMP DEFAULT current_timestamp
);

-- 5. Medical reports
CREATE TABLE medical_reports (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE SET NULL,
    document_id INT REFERENCES document(id) ON DELETE SET NULL,
    report_type VARCHAR(100),
    original_hash VARCHAR(256) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT current_timestamp,
    updated_at TIMESTAMP DEFAULT current_timestamp
);

-- 6. Blockchain: blocks
CREATE TABLE blockchain_blocks (
    id SERIAL PRIMARY KEY,
    block_index INT UNIQUE NOT NULL,
    previous_hash VARCHAR(256),
    block_hash VARCHAR(256) UNIQUE NOT NULL,
    merkle_root VARCHAR(256),
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 7. Blockchain: transactions
CREATE TABLE blockchain_transactions (
    id SERIAL PRIMARY KEY,
    block_id INT REFERENCES blockchain_blocks(id) ON DELETE SET NULL,
    report_id INT NOT NULL REFERENCES medical_reports(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    payload JSONB,
    tx_hash VARCHAR(256) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 8. ML models
CREATE TABLE ml_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    framework VARCHAR(50),
    description TEXT,
    hyperparams JSONB,
    metrics JSONB,
    created_at TIMESTAMP DEFAULT current_timestamp,
    UNIQUE (name, version)
);

-- 9. Disease predictions
CREATE TABLE disease_predictions (
    id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES medical_reports(id) ON DELETE CASCADE,
    model_id INT NOT NULL REFERENCES ml_models(id) ON DELETE RESTRICT,
    predicted_disease VARCHAR(200) NOT NULL,
    probability NUMERIC(5,4),
    prediction_details JSONB,
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 10. Report validations
CREATE TABLE report_validations (
    id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES medical_reports(id) ON DELETE CASCADE,
    validator_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    validation_result VARCHAR(50) NOT NULL,
    validation_notes TEXT,
    rules_triggered JSONB,
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 11. Access logs
CREATE TABLE access_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    report_id INT REFERENCES medical_reports(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp
);

-- 12. History (API / analysis logs)
CREATE TABLE history (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INT,
    docname VARCHAR(100),
    input_type VARCHAR(20) NOT NULL,
    result TEXT,
    timestamp TIMESTAMP DEFAULT current_timestamp,
    metadata JSONB
);

ALTER TABLE history
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE history
ADD CONSTRAINT chk_input_type
CHECK (input_type IN ('TEXT', 'FILE', 'URL', 'REPORT_ID'));
