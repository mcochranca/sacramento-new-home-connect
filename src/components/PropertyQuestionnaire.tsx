import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, DollarSign, MapPin, Users, Clock, Heart } from "lucide-react";
import { supabase, type UserPreferences } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface QuestionnaireProps {
  onComplete: (preferences: Partial<UserPreferences>) => void;
  onClose?: () => void;
}

const PropertyQuestionnaire = ({ onComplete, onClose }: QuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    budget_min: 200000,
    budget_max: 600000,
    bedrooms_min: 2,
    bedrooms_max: 4,
    bathrooms_min: 1,
    property_types: [],
    neighborhoods: [],
    must_have_features: [],
    nice_to_have_features: [],
    family_size: 2,
    pets: false,
    timeline: 'flexible',
    first_time_buyer: false,
  });
  const { toast } = useToast();

  const steps = [
    { title: "Budget", icon: DollarSign },
    { title: "Home Size", icon: Home },
    { title: "Location", icon: MapPin },
    { title: "Family Details", icon: Users },
    { title: "Features", icon: Heart },
    { title: "Timeline", icon: Clock },
  ];

  const propertyTypes = [
    { id: 'single-family', label: 'Single Family Home' },
    { id: 'condo', label: 'Condominium' },
    { id: 'townhouse', label: 'Townhouse' },
    { id: 'multi-family', label: 'Multi-Family' },
  ];

  const neighborhoods = [
    'Downtown Sacramento',
    'Midtown',
    'East Sacramento',
    'Land Park',
    'Natomas',
    'Elk Grove',
    'Folsom',
    'Roseville',
    'Davis',
    'West Sacramento'
  ];

  const features = [
    'Garage',
    'Swimming Pool',
    'Fireplace',
    'Hardwood Floors',
    'Updated Kitchen',
    'Master Suite',
    'Basement',
    'Fenced Yard',
    'Central AC',
    'Walk-in Closet',
    'Home Office',
    'Laundry Room'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const sessionId = crypto.randomUUID();
      const preferencesData = {
        ...preferences,
        session_id: sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to Supabase
      const { error } = await supabase
        .from('user_preferences')
        .insert([preferencesData]);

      if (error) {
        console.error('Error saving preferences:', error);
        toast({
          title: "Error",
          description: "Failed to save preferences. Continuing with local data.",
          variant: "destructive",
        });
      }

      onComplete(preferencesData);
      toast({
        title: "Preferences Saved!",
        description: "Finding your perfect matches...",
      });
    } catch (error) {
      console.error('Error:', error);
      onComplete(preferences);
    }
  };

  const toggleArrayItem = (array: string[] = [], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Budget
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">What's your budget range?</Label>
              <p className="text-muted-foreground mb-4">Help us find homes in your price range</p>
              <div className="space-y-4">
                <div>
                  <Label>Budget Range: ${preferences.budget_min?.toLocaleString()} - ${preferences.budget_max?.toLocaleString()}</Label>
                  <div className="mt-2 space-y-4">
                    <div>
                      <Label className="text-sm">Minimum Budget</Label>
                      <Slider
                        value={[preferences.budget_min || 200000]}
                        onValueChange={([value]) => setPreferences(prev => ({ ...prev, budget_min: value }))}
                        max={1000000}
                        min={100000}
                        step={25000}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Maximum Budget</Label>
                      <Slider
                        value={[preferences.budget_max || 600000]}
                        onValueChange={([value]) => setPreferences(prev => ({ ...prev, budget_max: value }))}
                        max={1500000}
                        min={200000}
                        step={25000}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Home Size
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">How much space do you need?</Label>
              <p className="text-muted-foreground mb-4">Tell us about your ideal home size</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Minimum Bedrooms</Label>
                  <Select value={preferences.bedrooms_min?.toString()} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, bedrooms_min: parseInt(value) }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}+ bedrooms</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Minimum Bathrooms</Label>
                  <Select value={preferences.bathrooms_min?.toString()} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, bathrooms_min: parseFloat(value) }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}+ baths</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Property Types</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {propertyTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.id}
                        checked={preferences.property_types?.includes(type.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPreferences(prev => ({
                              ...prev,
                              property_types: [...(prev.property_types || []), type.id]
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              property_types: prev.property_types?.filter(t => t !== type.id)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={type.id} className="text-sm">{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Location
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Where would you like to live?</Label>
              <p className="text-muted-foreground mb-4">Choose your preferred Sacramento neighborhoods</p>
              
              <div className="grid grid-cols-2 gap-3">
                {neighborhoods.map(neighborhood => (
                  <div key={neighborhood} className="flex items-center space-x-2">
                    <Checkbox
                      id={neighborhood}
                      checked={preferences.neighborhoods?.includes(neighborhood)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferences(prev => ({
                            ...prev,
                            neighborhoods: [...(prev.neighborhoods || []), neighborhood]
                          }));
                        } else {
                          setPreferences(prev => ({
                            ...prev,
                            neighborhoods: prev.neighborhoods?.filter(n => n !== neighborhood)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={neighborhood} className="text-sm">{neighborhood}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Family Details
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Tell us about your family</Label>
              <p className="text-muted-foreground mb-4">This helps us understand your needs better</p>
              
              <div className="space-y-4">
                <div>
                  <Label>Family Size</Label>
                  <Select value={preferences.family_size?.toString()} onValueChange={(value) => 
                    setPreferences(prev => ({ ...prev, family_size: parseInt(value) }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pets"
                    checked={preferences.pets}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pets: !!checked }))}
                  />
                  <Label htmlFor="pets">We have pets</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="first-time"
                    checked={preferences.first_time_buyer}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, first_time_buyer: !!checked }))}
                  />
                  <Label htmlFor="first-time">This is our first home purchase</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Features
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">What features matter most?</Label>
              <p className="text-muted-foreground mb-4">Select your must-haves and nice-to-haves</p>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-destructive">Must-Have Features</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {features.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`must-${feature}`}
                          checked={preferences.must_have_features?.includes(feature)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPreferences(prev => ({
                                ...prev,
                                must_have_features: [...(prev.must_have_features || []), feature]
                              }));
                            } else {
                              setPreferences(prev => ({
                                ...prev,
                                must_have_features: prev.must_have_features?.filter(f => f !== feature)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`must-${feature}`} className="text-sm">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium text-secondary">Nice-to-Have Features</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {features.filter(f => !preferences.must_have_features?.includes(f)).map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`nice-${feature}`}
                          checked={preferences.nice_to_have_features?.includes(feature)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPreferences(prev => ({
                                ...prev,
                                nice_to_have_features: [...(prev.nice_to_have_features || []), feature]
                              }));
                            } else {
                              setPreferences(prev => ({
                                ...prev,
                                nice_to_have_features: prev.nice_to_have_features?.filter(f => f !== feature)
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`nice-${feature}`} className="text-sm">{feature}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Timeline
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">When are you looking to move?</Label>
              <p className="text-muted-foreground mb-4">This helps us prioritize the right properties</p>
              
              <div className="space-y-3">
                {[
                  { value: 'immediate', label: 'Immediately (within 1 month)', color: 'bg-destructive' },
                  { value: '3-months', label: 'Within 3 months', color: 'bg-accent' },
                  { value: '6-months', label: 'Within 6 months', color: 'bg-secondary' },
                  { value: 'flexible', label: 'Flexible timeline', color: 'bg-primary' },
                ].map(option => (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      preferences.timeline === option.value 
                        ? 'border-primary shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, timeline: option.value as any }))}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${option.color}`} />
                      <span className="font-medium">{option.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Find Your Perfect Home</CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <div className="border-t p-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <Button 
            onClick={handleNext}
            variant={currentStep === steps.length - 1 ? "hero" : "default"}
          >
            {currentStep === steps.length - 1 ? 'Find Matches' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PropertyQuestionnaire;