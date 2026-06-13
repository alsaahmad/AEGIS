CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS ambulances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_number VARCHAR(64) NOT NULL UNIQUE,
    current_lat DOUBLE PRECISION NOT NULL,
    current_lng DOUBLE PRECISION NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
    driver_name VARCHAR(120),
    driver_phone VARCHAR(32),
    equipment_level VARCHAR(32) NOT NULL DEFAULT 'BASIC',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    total_icu_beds INT NOT NULL CHECK (total_icu_beds >= 0),
    available_icu_beds INT NOT NULL CHECK (available_icu_beds >= 0),
    specializations TEXT,
    phone VARCHAR(32),
    current_load_pct DOUBLE PRECISION NOT NULL DEFAULT 0.35 CHECK (current_load_pct >= 0 AND current_load_pct <= 1),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emergencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id VARCHAR(120) NOT NULL,
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    description TEXT,
    severity VARCHAR(32) NOT NULL DEFAULT 'UNKNOWN',
    status VARCHAR(48) NOT NULL DEFAULT 'REPORTED',
    victim_count INT NOT NULL DEFAULT 1 CHECK (victim_count > 0),
    injury_type VARCHAR(120) NOT NULL DEFAULT 'unknown',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_ambulance_id UUID REFERENCES ambulances(id),
    assigned_hospital_id UUID REFERENCES hospitals(id),
    eta INT
);

CREATE TABLE IF NOT EXISTS traffic_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    road_segment VARCHAR(180) NOT NULL,
    current_state VARCHAR(32) NOT NULL DEFAULT 'RED',
    controlled_by_corridor_id UUID,
    priority_expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    skills TEXT
);

CREATE TABLE IF NOT EXISTS emergency_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emergency_id UUID NOT NULL REFERENCES emergencies(id) ON DELETE CASCADE,
    event_type VARCHAR(120) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    details TEXT
);

CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_severity ON emergencies(severity);
CREATE INDEX IF NOT EXISTS idx_ambulances_status ON ambulances(status);
CREATE INDEX IF NOT EXISTS idx_traffic_signals_corridor ON traffic_signals(controlled_by_corridor_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_available ON volunteers(is_available);
CREATE INDEX IF NOT EXISTS idx_emergency_logs_emergency ON emergency_logs(emergency_id);
