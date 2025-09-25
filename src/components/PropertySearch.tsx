import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Map, List, SlidersHorizontal, Star, Heart, MapPin } from "lucide-react";
import PropertyCard from "./PropertyCard";
import PropertyMap from "./PropertyMap";
import PropertyQuestionnaire from "./PropertyQuestionnaire";
import { usePropertyMatching, type PropertyWithMatch } from "@/hooks/usePropertyMatching";
import { type UserPreferences } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const PropertySearch = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [preferences, setPreferences] = useState<Partial<UserPreferences> | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithMatch | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: ""
  });

  const { properties, loading, searchProperties } = usePropertyMatching(preferences);

  const handleQuestionnaireComplete = (userPrefs: Partial<UserPreferences>) => {
    setPreferences(userPrefs);
    setShowQuestionnaire(false);
  };

  const filteredProperties = properties.filter(property => {
    if (searchFilters.location && !property.address.toLowerCase().includes(searchFilters.location.toLowerCase())) {
      return false;
    }
    if (searchFilters.minPrice && property.price < parseInt(searchFilters.minPrice)) {
      return false;
    }
    if (searchFilters.maxPrice && property.price > parseInt(searchFilters.maxPrice)) {
      return false;
    }
    if (searchFilters.bedrooms && searchFilters.bedrooms !== 'any' && property.bedrooms < parseInt(searchFilters.bedrooms)) {
      return false;
    }
    if (searchFilters.propertyType && searchFilters.propertyType !== 'all' && property.property_type !== searchFilters.propertyType) {
      return false;
    }
    return true;
  });

  const getMatchBadgeColor = (score?: number) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 80) return "bg-accent text-accent-foreground";
    if (score >= 60) return "bg-secondary text-secondary-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header with Smart Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Find Your Perfect Sacramento Home</span>
            <Button 
              variant="hero" 
              onClick={() => setShowQuestionnaire(true)}
              className="hidden md:flex"
            >
              <Star className="h-4 w-4 mr-2" />
              Smart Match Questionnaire
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Location, neighborhood, or address..."
                value={searchFilters.location}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Select value={searchFilters.propertyType} onValueChange={(value) => 
                setSearchFilters(prev => ({ ...prev, propertyType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Min Price"
                value={searchFilters.minPrice}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                type="number"
              />
            </div>
            <div>
              <Input
                placeholder="Max Price"
                value={searchFilters.maxPrice}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                type="number"
              />
            </div>
            <div>
              <Select value={searchFilters.bedrooms} onValueChange={(value) => 
                setSearchFilters(prev => ({ ...prev, bedrooms: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Smart Match Button */}
          <Button 
            variant="hero" 
            onClick={() => setShowQuestionnaire(true)}
            className="w-full md:hidden"
          >
            <Star className="h-4 w-4 mr-2" />
            Get Smart Recommendations
          </Button>

          {/* Active Preferences Display */}
          {preferences && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Active Preferences</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowQuestionnaire(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  ${preferences.budget_min?.toLocaleString()} - ${preferences.budget_max?.toLocaleString()}
                </Badge>
                <Badge variant="secondary">
                  {preferences.bedrooms_min}+ bedrooms
                </Badge>
                {preferences.property_types?.map(type => (
                  <Badge key={type} variant="secondary">{type}</Badge>
                ))}
                {preferences.neighborhoods?.slice(0, 2).map(neighborhood => (
                  <Badge key={neighborhood} variant="secondary">{neighborhood}</Badge>
                ))}
                {preferences.neighborhoods && preferences.neighborhoods.length > 2 && (
                  <Badge variant="secondary">+{preferences.neighborhoods.length - 2} more</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filteredProperties.length} Properties Found
              {preferences && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (sorted by match score)
                </span>
              )}
            </CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-1" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map">
                  <Map className="h-4 w-4 mr-1" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="list" className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <AnimatePresence>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Match Score Badge */}
                        {property.match_score && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge className={getMatchBadgeColor(property.match_score)}>
                              {property.match_score}% match
                            </Badge>
                          </div>
                        )}
                        
                        <PropertyCard
                          image={property.images[0] || "/api/placeholder/800/600"}
                          price={`$${property.price.toLocaleString()}`}
                          address={property.address}
                          beds={property.bedrooms}
                          baths={property.bathrooms}
                          sqft={property.square_feet}
                          status={property.status === 'for-sale' ? 'For Sale' : property.status === 'pending' ? 'Pending' : 'Sold'}
                        />
                        
                        {/* Matching Features */}
                        {property.matching_features && property.matching_features.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Why it matches:</p>
                            <div className="flex flex-wrap gap-1">
                              {property.matching_features.slice(0, 3).map(feature => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {property.matching_features.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{property.matching_features.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
              
              {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or{" "}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto"
                      onClick={() => setShowQuestionnaire(true)}
                    >
                      take our questionnaire
                    </Button>{" "}
                    for personalized recommendations.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="map">
              <PropertyMap
                properties={filteredProperties}
                onPropertySelect={setSelectedProperty}
                selectedProperty={selectedProperty}
              />
              
              {/* Selected Property Details */}
              {selectedProperty && (
                <div className="mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{selectedProperty.price.toLocaleString()}</h3>
                          <p className="text-muted-foreground">{selectedProperty.address}</p>
                          <div className="flex items-center space-x-4 text-sm mt-2">
                            <span>{selectedProperty.bedrooms} bed</span>
                            <span>{selectedProperty.bathrooms} bath</span>
                            <span>{selectedProperty.square_feet.toLocaleString()} sqft</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          {selectedProperty.match_score && (
                            <Badge className={getMatchBadgeColor(selectedProperty.match_score)}>
                              {selectedProperty.match_score}% match
                            </Badge>
                          )}
                          <div>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Questionnaire Modal */}
      {showQuestionnaire && (
        <PropertyQuestionnaire
          onComplete={handleQuestionnaireComplete}
          onClose={() => setShowQuestionnaire(false)}
        />
      )}
    </div>
  );
};

export default PropertySearch;