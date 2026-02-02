-- ============================================================
-- UAP Navigator - Row Level Security (RLS) Policies
-- ============================================================
-- Run this SQL in your Supabase Dashboard: SQL Editor
-- This fixes the security issues identified in the security scan
-- ============================================================

-- ============================================================
-- STEP 1: Enable Anonymous Auth in Supabase Dashboard
-- ============================================================
-- Go to: Authentication > Providers > Anonymous > Enable
-- This allows the app to create anonymous sessions for users
-- who want to save bookmarks without creating an account.

-- ============================================================
-- STEP 2: Enable RLS on all tables
-- ============================================================

-- User progress table (stores bookmarks, viewed status, etc.)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Public read-only tables
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE figures ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE uap_hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hypothesis_proponents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: Create RLS policies for user_progress
-- ============================================================
-- Users can only access their own progress data

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

-- Policy: Users can only SELECT their own rows
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Policy: Users can only INSERT rows where user_id matches their auth ID
CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can only UPDATE their own rows
CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can only DELETE their own rows
CREATE POLICY "Users can delete own progress" ON user_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- ============================================================
-- STEP 4: Create read-only policies for public content
-- ============================================================
-- All authenticated and anonymous users can read public content

-- Claims
DROP POLICY IF EXISTS "Anyone can read claims" ON claims;
CREATE POLICY "Anyone can read claims" ON claims
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Figures
DROP POLICY IF EXISTS "Anyone can read figures" ON figures;
CREATE POLICY "Anyone can read figures" ON figures
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Videos
DROP POLICY IF EXISTS "Anyone can read videos" ON videos;
CREATE POLICY "Anyone can read videos" ON videos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Documents
DROP POLICY IF EXISTS "Anyone can read documents" ON documents;
CREATE POLICY "Anyone can read documents" ON documents
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Sections
DROP POLICY IF EXISTS "Anyone can read sections" ON sections;
CREATE POLICY "Anyone can read sections" ON sections
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Persona questions
DROP POLICY IF EXISTS "Anyone can read persona_questions" ON persona_questions;
CREATE POLICY "Anyone can read persona_questions" ON persona_questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Persona archetypes
DROP POLICY IF EXISTS "Anyone can read persona_archetypes" ON persona_archetypes;
CREATE POLICY "Anyone can read persona_archetypes" ON persona_archetypes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Glossary terms
DROP POLICY IF EXISTS "Anyone can read glossary_terms" ON glossary_terms;
CREATE POLICY "Anyone can read glossary_terms" ON glossary_terms
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Timeline events
DROP POLICY IF EXISTS "Anyone can read timeline_events" ON timeline_events;
CREATE POLICY "Anyone can read timeline_events" ON timeline_events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- UAP hypotheses
DROP POLICY IF EXISTS "Anyone can read uap_hypotheses" ON uap_hypotheses;
CREATE POLICY "Anyone can read uap_hypotheses" ON uap_hypotheses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Hypothesis proponents
DROP POLICY IF EXISTS "Anyone can read hypothesis_proponents" ON hypothesis_proponents;
CREATE POLICY "Anyone can read hypothesis_proponents" ON hypothesis_proponents
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- STEP 5: Ensure user_id column is NOT NULL in user_progress
-- ============================================================
-- This prevents null user IDs which would bypass RLS

-- Check if user_id is nullable (run this to see current state):
-- SELECT column_name, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'user_progress' AND column_name = 'user_id';

-- If it is nullable, run:
-- ALTER TABLE user_progress ALTER COLUMN user_id SET NOT NULL;

-- ============================================================
-- VERIFICATION
-- ============================================================
-- After running this script, verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN (
--   'user_progress', 'claims', 'figures', 'videos', 'documents', 
--   'sections', 'persona_questions', 'persona_archetypes'
-- );
-- 
-- All tables should show rowsecurity = true
