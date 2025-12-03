-- Create the custom_report_sections table
CREATE TABLE IF NOT EXISTS public.custom_report_sections (
    id TEXT PRIMARY KEY,
    auditid TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    sequence INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint to audits table (optional, but recommended)
-- Assuming the audits table exists and has an id column of type TEXT
ALTER TABLE public.custom_report_sections
    ADD CONSTRAINT fk_audit
    FOREIGN KEY (auditid)
    REFERENCES public.audits (id)
    ON DELETE CASCADE;

-- Enable Row Level Security (RLS) - Optional, depending on your security model
ALTER TABLE public.custom_report_sections ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (adjust as needed)
CREATE POLICY "Enable all access for all users" ON public.custom_report_sections
    FOR ALL USING (true) WITH CHECK (true);
