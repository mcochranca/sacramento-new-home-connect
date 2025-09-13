import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Table, Shield, Code } from "lucide-react";

const DatabaseSetup = () => {
  const tables = [
    {
      name: "properties",
      description: "Store property listings with location, pricing, and features",
      columns: [
        "id (uuid, primary key)",
        "address (text)",
        "price (numeric)",
        "bedrooms (integer)",
        "bathrooms (numeric)",
        "square_feet (integer)",
        "property_type (text)",
        "status (text)",
        "latitude (numeric)",
        "longitude (numeric)",
        "images (text[])",
        "description (text)",
        "features (text[])",
        "neighborhood (text)",
        "school_district (text)",
        "year_built (integer)",
        "lot_size (numeric)",
        "garage_spaces (integer)",
        "agent_id (uuid, foreign key)",
        "created_at (timestamp)",
        "updated_at (timestamp)"
      ]
    },
    {
      name: "user_preferences",
      description: "Store user search preferences and questionnaire responses",
      columns: [
        "id (uuid, primary key)",
        "user_id (uuid, optional foreign key)",
        "session_id (text)",
        "budget_min (numeric)",
        "budget_max (numeric)",
        "bedrooms_min (integer)",
        "bedrooms_max (integer)",
        "bathrooms_min (numeric)",
        "property_types (text[])",
        "neighborhoods (text[])",
        "must_have_features (text[])",
        "nice_to_have_features (text[])",
        "commute_locations (text[])",
        "family_size (integer)",
        "pets (boolean)",
        "timeline (text)",
        "first_time_buyer (boolean)",
        "created_at (timestamp)",
        "updated_at (timestamp)"
      ]
    },
    {
      name: "property_matches",
      description: "Store calculated property matches for users",
      columns: [
        "id (uuid, primary key)",
        "property_id (uuid, foreign key)",
        "user_preferences_id (uuid, foreign key)",
        "match_score (numeric)",
        "matching_features (text[])",
        "created_at (timestamp)"
      ]
    },
    {
      name: "agents",
      description: "Store real estate agent information",
      columns: [
        "id (uuid, primary key)",
        "name (text)",
        "email (text)",
        "phone (text)",
        "bio (text)",
        "specialties (text[])",
        "experience_years (integer)",
        "rating (numeric)",
        "reviews_count (integer)",
        "profile_image (text)",
        "is_owner (boolean)",
        "created_at (timestamp)"
      ]
    }
  ];

  const sqlCommands = `
-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL,
  price NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC NOT NULL,
  square_feet INTEGER NOT NULL,
  property_type TEXT CHECK (property_type IN ('single-family', 'condo', 'townhouse', 'multi-family')),
  status TEXT CHECK (status IN ('for-sale', 'pending', 'sold')) DEFAULT 'for-sale',
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  neighborhood TEXT,
  school_district TEXT,
  year_built INTEGER,
  lot_size NUMERIC,
  garage_spaces INTEGER,
  agent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  budget_min NUMERIC,
  budget_max NUMERIC,
  bedrooms_min INTEGER,
  bedrooms_max INTEGER,
  bathrooms_min NUMERIC,
  property_types TEXT[] DEFAULT '{}',
  neighborhoods TEXT[] DEFAULT '{}',
  must_have_features TEXT[] DEFAULT '{}',
  nice_to_have_features TEXT[] DEFAULT '{}',
  commute_locations TEXT[] DEFAULT '{}',
  family_size INTEGER,
  pets BOOLEAN DEFAULT false,
  timeline TEXT CHECK (timeline IN ('immediate', '3-months', '6-months', 'flexible')),
  first_time_buyer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create property_matches table
CREATE TABLE property_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_preferences_id UUID REFERENCES user_preferences(id) ON DELETE CASCADE,
  match_score NUMERIC CHECK (match_score >= 0 AND match_score <= 100),
  matching_features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  profile_image TEXT,
  is_owner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for properties.agent_id
ALTER TABLE properties ADD CONSTRAINT fk_properties_agent 
  FOREIGN KEY (agent_id) REFERENCES agents(id);

-- Create indexes for better performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX idx_properties_location ON properties(latitude, longitude);
CREATE INDEX idx_user_preferences_session ON user_preferences(session_id);
CREATE INDEX idx_property_matches_score ON property_matches(match_score DESC);

-- Insert sample agent (DJ Dawson)
INSERT INTO agents (id, name, email, phone, bio, specialties, experience_years, rating, reviews_count, is_owner)
VALUES (
  'agent-1',
  'DJ Dawson',
  'dj@equityboys.com',
  '(916) 555-0123',
  'Passionate about helping Sacramento families find their perfect home. Specializing in first-time buyers and family-friendly neighborhoods.',
  ARRAY['First-time buyers', 'Family homes', 'Investment properties'],
  8,
  5.0,
  127,
  true
);
`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Schema Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your EquityBoys real estate platform requires the following database tables to support 
            property listings, user preferences, smart matching, and agent management.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tables.map((table) => (
              <Card key={table.name} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Table className="h-4 w-4 mr-2" />
                      <h3 className="font-semibold">{table.name}</h3>
                    </div>
                    <Badge variant="outline">{table.columns.length} columns</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{table.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {table.columns.slice(0, 5).map((column) => (
                      <div key={column} className="text-xs font-mono bg-muted/50 p-1 rounded">
                        {column}
                      </div>
                    ))}
                    {table.columns.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        +{table.columns.length - 5} more columns...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800">
                <Code className="h-5 w-5 mr-2" />
                SQL Setup Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700 mb-4">
                Run these SQL commands in your Supabase SQL editor to create the database schema:
              </p>
              <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                {sqlCommands}
              </pre>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Shield className="h-5 w-5 mr-2" />
                Row Level Security (RLS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-4">
                Consider enabling RLS policies for data security:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Properties: Public read access, agent write access</li>
                <li>• User preferences: User-specific read/write access</li>
                <li>• Property matches: User-specific read access</li>
                <li>• Agents: Public read access, admin write access</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSetup;