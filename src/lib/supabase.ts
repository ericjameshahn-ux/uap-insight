import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlfnowncwmvcupghitak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZm5vd25jd212Y3VwZ2hpdGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDU3NDgsImV4cCI6MjA4MTgyMTc0OH0.6wqPQml86cUFBbeF1Gj83ipmy_yCbs55XpmUDOMn1h8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions based on the database schema
export interface Section {
  id: string;
  letter: string;
  title: string;
  conviction: string;
  description: string;
  sort_order: number;
  subtitle?: string;
}

export interface Claim {
  id: string;
  section_id: string;
  claim: string;
  tier: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOWER';
  source: string;
  quote: string;
  date: string;
  figure_id?: string;
}

export interface Figure {
  id: string;
  name: string;
  role: string;
  credentials: string;
  clearances?: string;
  tier: string;
  bio: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  section_id: string;
  description: string;
  recommended: boolean;
  duration: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  file_path: string;
  section_id: string;
}

export interface Observable {
  id: string;
  name: string;
  measurement: string;
  mechanism: string;
  gap: string;
}

export interface Journey {
  id: string;
  title: string;
  duration: string;
  icon: string;
  description: string;
  audience: string;
  steps: any[];
}

export interface PersonaArchetype {
  id: string;
  name: string;
  description: string;
  primary_interests: string;
  recommended_sections: string[];
  recommended_journey: string;
  icon: string;
}

export interface PersonaQuestion {
  id: string;
  question_number: number;
  question_text: string;
  options: { label: string; value: string }[];
  scoring_map: Record<string, string[]>;
}

export interface SectionContentBlock {
  id: string;
  section_id: string;
  block_order: number;
  block_type: string;
  title: string;
  content: string;
  video_url?: string;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  journey_id: string;
  step_index: number;
  status: 'viewed' | 'saved' | 'skipped';
  updated_at?: string;
}

// Helper to get or create user ID
export function getUserId(): string {
  let userId = localStorage.getItem('uap_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('uap_user_id', userId);
  }
  return userId;
}
