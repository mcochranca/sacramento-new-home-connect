import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: 'single-family' | 'condo' | 'townhouse' | 'multi-family';
  status: 'for-sale' | 'pending' | 'sold';
  latitude: number;
  longitude: number;
  images: string[];
  description: string;
  features: string[];
  neighborhood: string;
  school_district: string;
  year_built: number;
  lot_size?: number;
  garage_spaces?: number;
  created_at: string;
  updated_at: string;
  agent_id: string;
}

export interface UserPreferences {
  id: string;
  user_id?: string;
  session_id: string;
  budget_min: number;
  budget_max: number;
  bedrooms_min: number;
  bedrooms_max: number;
  bathrooms_min: number;
  property_types: string[];
  neighborhoods: string[];
  must_have_features: string[];
  nice_to_have_features: string[];
  commute_locations: string[];
  family_size: number;
  pets: boolean;
  timeline: 'immediate' | '3-months' | '6-months' | 'flexible';
  first_time_buyer: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyMatch {
  id: string;
  property_id: string;
  user_preferences_id: string;
  match_score: number;
  matching_features: string[];
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  specialties: string[];
  experience_years: number;
  rating: number;
  reviews_count: number;
  profile_image: string;
  is_owner: boolean;
  created_at: string;
}