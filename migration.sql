-- Migration script for GestAudit database schema
-- Run this in your Supabase SQL Editor

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
    id TEXT PRIMARY KEY,
    municipalityname TEXT NOT NULL,
    type TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
    id TEXT PRIMARY KEY,
    institutionId TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    auditNumber TEXT NOT NULL,
    title TEXT NOT NULL,
    auditedSector TEXT,
    sectorResponsible TEXT,
    type TEXT NOT NULL,
    plannedStartDate DATE NOT NULL,
    plannedEndDate DATE NOT NULL,
    actualStartDate DATE,
    actualEndDate DATE,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    objective TEXT,
    scope TEXT,
    criteria TEXT,
    auditorNotes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create findings table
CREATE TABLE IF NOT EXISTS findings (
    id TEXT PRIMARY KEY,
    auditId TEXT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    findingCode TEXT NOT NULL,
    summary TEXT NOT NULL,
    evidence TEXT NOT NULL,
    violatedCriteria TEXT NOT NULL,
    cause TEXT NOT NULL,
    effect TEXT NOT NULL,
    classification TEXT NOT NULL,
    status TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    findingId TEXT NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
    recommendationCode TEXT NOT NULL,
    description TEXT NOT NULL,
    implementationResponsible TEXT NOT NULL,
    deadline DATE NOT NULL,
    status TEXT NOT NULL,
    verificationDate DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_stages table
CREATE TABLE IF NOT EXISTS audit_stages (
    id TEXT PRIMARY KEY,
    auditId TEXT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    plannedStartDate DATE NOT NULL,
    plannedEndDate DATE NOT NULL,
    actualStartDate DATE,
    actualEndDate DATE,
    status TEXT NOT NULL,
    responsible TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create risks table
CREATE TABLE IF NOT EXISTS risks (
    id TEXT PRIMARY KEY,
    auditId TEXT NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    impact TEXT NOT NULL,
    probability TEXT NOT NULL,
    riskLevel TEXT NOT NULL,
    controls TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile table (single row)
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL DEFAULT 'Auditor de Controle',
    role TEXT NOT NULL DEFAULT 'Auditor Interno Sênior',
    email TEXT NOT NULL DEFAULT 'auditor@example.com',
    signature TEXT NOT NULL DEFAULT 'Auditor de Controle',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default profile row
INSERT INTO profile (id, name, role, email, signature)
VALUES (1, 'Auditor de Controle', 'Auditor Interno Sênior', 'auditor@example.com', 'Auditor de Controle')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (adjust as needed for your security requirements)
-- For development, allow all operations. In production, implement proper authentication.

DROP POLICY IF EXISTS "Allow all operations on institutions" ON institutions;
DROP POLICY IF EXISTS "Allow all operations on audits" ON audits;
DROP POLICY IF EXISTS "Allow all operations on findings" ON findings;
DROP POLICY IF EXISTS "Allow all operations on recommendations" ON recommendations;
DROP POLICY IF EXISTS "Allow all operations on audit_stages" ON audit_stages;
DROP POLICY IF EXISTS "Allow all operations on risks" ON risks;
DROP POLICY IF EXISTS "Allow all operations on profile" ON profile;

CREATE POLICY "Allow all operations on institutions" ON institutions FOR ALL USING (true);
CREATE POLICY "Allow all operations on audits" ON audits FOR ALL USING (true);
CREATE POLICY "Allow all operations on findings" ON findings FOR ALL USING (true);
CREATE POLICY "Allow all operations on recommendations" ON recommendations FOR ALL USING (true);
CREATE POLICY "Allow all operations on audit_stages" ON audit_stages FOR ALL USING (true);
CREATE POLICY "Allow all operations on risks" ON risks FOR ALL USING (true);
CREATE POLICY "Allow all operations on profile" ON profile FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audits_institutionId ON audits(institutionId);
CREATE INDEX IF NOT EXISTS idx_findings_auditId ON findings(auditId);
CREATE INDEX IF NOT EXISTS idx_recommendations_findingId ON recommendations(findingId);
CREATE INDEX IF NOT EXISTS idx_audit_stages_auditId ON audit_stages(auditId);
CREATE INDEX IF NOT EXISTS idx_risks_auditId ON risks(auditId);
