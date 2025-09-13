import { useState, useEffect } from 'react';
import { supabase, type Property, type UserPreferences, type PropertyMatch } from '@/lib/supabase';

export interface PropertyWithMatch extends Property {
  match_score?: number;
  matching_features?: string[];
}

export const usePropertyMatching = (preferences: Partial<UserPreferences> | null) => {
  const [properties, setProperties] = useState<PropertyWithMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateMatchScore = (property: Property, prefs: Partial<UserPreferences>): { score: number; features: string[] } => {
    let score = 0;
    const matchingFeatures: string[] = [];
    const maxScore = 100;

    // Budget matching (25 points max)
    if (prefs.budget_min && prefs.budget_max) {
      if (property.price >= prefs.budget_min && property.price <= prefs.budget_max) {
        score += 25;
        matchingFeatures.push('Budget Match');
      } else if (property.price <= prefs.budget_max * 1.1) {
        score += 15; // Slightly over budget
        matchingFeatures.push('Near Budget');
      }
    }

    // Bedroom matching (20 points max)
    if (prefs.bedrooms_min && prefs.bedrooms_max) {
      if (property.bedrooms >= prefs.bedrooms_min && property.bedrooms <= prefs.bedrooms_max) {
        score += 20;
        matchingFeatures.push('Bedroom Count');
      } else if (property.bedrooms >= prefs.bedrooms_min) {
        score += 15; // More bedrooms than needed
        matchingFeatures.push('Extra Bedrooms');
      }
    }

    // Bathroom matching (15 points max)
    if (prefs.bathrooms_min && property.bathrooms >= prefs.bathrooms_min) {
      score += 15;
      matchingFeatures.push('Bathroom Count');
    }

    // Property type matching (15 points max)
    if (prefs.property_types && prefs.property_types.includes(property.property_type)) {
      score += 15;
      matchingFeatures.push('Property Type');
    }

    // Neighborhood matching (15 points max)
    if (prefs.neighborhoods && prefs.neighborhoods.includes(property.neighborhood)) {
      score += 15;
      matchingFeatures.push('Preferred Neighborhood');
    }

    // Must-have features (10 points max)
    if (prefs.must_have_features) {
      const hasAllMustHaves = prefs.must_have_features.every(feature => 
        property.features.includes(feature)
      );
      if (hasAllMustHaves) {
        score += 10;
        matchingFeatures.push('All Must-Have Features');
      } else {
        const matchingMustHaves = prefs.must_have_features.filter(feature => 
          property.features.includes(feature)
        );
        score += (matchingMustHaves.length / prefs.must_have_features.length) * 10;
        if (matchingMustHaves.length > 0) {
          matchingFeatures.push(`${matchingMustHaves.length}/${prefs.must_have_features.length} Must-Haves`);
        }
      }
    }

    // Bonus for nice-to-have features
    if (prefs.nice_to_have_features) {
      const matchingNiceToHaves = prefs.nice_to_have_features.filter(feature => 
        property.features.includes(feature)
      );
      if (matchingNiceToHaves.length > 0) {
        score += Math.min(matchingNiceToHaves.length * 2, 10); // Up to 10 bonus points
        matchingFeatures.push(`+${matchingNiceToHaves.length} Nice-to-Haves`);
      }
    }

    return { 
      score: Math.min(score, maxScore), 
      features: matchingFeatures 
    };
  };

  const searchProperties = async (searchPreferences?: Partial<UserPreferences>) => {
    setLoading(true);
    setError(null);

    try {
      // Get all properties (in a real app, you'd want pagination and filtering)
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'for-sale');

      if (propertiesError) {
        // Fallback to mock data if database query fails
        console.warn('Database query failed, using mock data:', propertiesError);
        const mockProperties = generateMockProperties();
        const processedProperties = processProperties(mockProperties, searchPreferences || preferences);
        setProperties(processedProperties);
        return;
      }

      const processedProperties = processProperties(propertiesData || [], searchPreferences || preferences);
      setProperties(processedProperties);

    } catch (err) {
      console.error('Error searching properties:', err);
      // Use mock data as fallback
      const mockProperties = generateMockProperties();
      const processedProperties = processProperties(mockProperties, searchPreferences || preferences);
      setProperties(processedProperties);
    } finally {
      setLoading(false);
    }
  };

  const processProperties = (propertiesData: Property[], prefs: Partial<UserPreferences> | null): PropertyWithMatch[] => {
    if (!prefs) return propertiesData;

    return propertiesData
      .map(property => {
        const { score, features } = calculateMatchScore(property, prefs);
        return {
          ...property,
          match_score: score,
          matching_features: features
        };
      })
      .sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  };

  const generateMockProperties = (): Property[] => {
    const neighborhoods = ['Downtown Sacramento', 'Midtown', 'East Sacramento', 'Land Park', 'Natomas'];
    const features = ['Garage', 'Swimming Pool', 'Fireplace', 'Hardwood Floors', 'Updated Kitchen', 'Master Suite', 'Fenced Yard', 'Central AC'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `prop-${i + 1}`,
      address: `${1000 + i * 100} ${['Oak', 'Pine', 'Maple', 'Cedar', 'Elm'][i % 5]} Street, Sacramento, CA`,
      price: 250000 + (i * 25000) + Math.random() * 100000,
      bedrooms: 2 + (i % 4),
      bathrooms: 1 + (i % 3),
      square_feet: 1200 + (i * 50) + Math.random() * 500,
      property_type: ['single-family', 'condo', 'townhouse'][i % 3] as Property['property_type'],
      status: 'for-sale' as const,
      latitude: 38.5816 + (Math.random() - 0.5) * 0.1,
      longitude: -121.4686 + (Math.random() - 0.5) * 0.1,
      images: [`/api/placeholder/800/600?property=${i + 1}`],
      description: `Beautiful ${['single-family', 'condo', 'townhouse'][i % 3]} home in ${neighborhoods[i % 5]}.`,
      features: features.slice(0, 3 + (i % 4)),
      neighborhood: neighborhoods[i % 5],
      school_district: `${neighborhoods[i % 5]} School District`,
      year_built: 1950 + (i * 3),
      lot_size: i % 2 === 0 ? 6000 + Math.random() * 2000 : undefined,
      garage_spaces: i % 3 === 0 ? 1 + (i % 3) : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      agent_id: 'agent-1'
    }));
  };

  // Search properties when preferences change
  useEffect(() => {
    if (preferences) {
      searchProperties();
    }
  }, [preferences]);

  return {
    properties,
    loading,
    error,
    searchProperties
  };
};