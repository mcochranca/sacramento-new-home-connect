import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertySearch from "@/components/PropertySearch";
import DatabaseSetup from "@/components/DatabaseSetup";
import PropertyCard from "@/components/PropertyCard";
import AgentCard from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, ChevronRight, Star, Users, Home as HomeIcon, Heart, Search, Brain, Map, Zap } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import djDawson from "@/assets/dj-dawson.jpg";

const Index = () => {
  const featuredProperties = [
    {
      image: property1,
      price: "$485,000",
      address: "1234 Oak Street, Sacramento, CA",
      beds: 3,
      baths: 2,
      sqft: 1850,
      status: "For Sale" as const
    },
    {
      image: property2,
      price: "$325,000",
      address: "567 Pine Ave, Sacramento, CA",
      beds: 2,
      baths: 2,
      sqft: 1200,
      status: "Pending" as const
    },
    {
      image: property3,
      price: "$395,000",
      address: "890 Maple Drive, Sacramento, CA",
      beds: 3,
      baths: 2.5,
      sqft: 1650,
      status: "For Sale" as const
    }
  ];

  const agents = [
    {
      image: djDawson,
      name: "DJ Dawson",
      title: "Owner & Senior Real Estate Agent",
      experience: "8+ years in Sacramento real estate",
      specialties: ["First-time buyers", "Family homes", "Investment properties"],
      rating: 5,
      reviews: 127,
      phone: "(916) 555-0123",
      email: "dj@equityboys.com",
      isOwner: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Advanced Property Search Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Smart Property Search & Matching
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Our advanced AI-powered system learns your preferences and finds homes that perfectly match your family's needs. 
              Experience the future of home searching.
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">AI learns your preferences</p>
              </Card>
              <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                <Map className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Interactive Maps</h3>
                <p className="text-sm text-muted-foreground">Explore neighborhoods visually</p>
              </Card>
              <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                <Zap className="h-8 w-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">Live property availability</p>
              </Card>
              <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Match Scoring</h3>
                <p className="text-sm text-muted-foreground">See how well homes fit</p>
              </Card>
            </div>
          </div>

          <PropertySearch />
        </div>
      </section>

      {/* Database Setup Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Database Setup Required
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete your Supabase database setup to enable all advanced features
            </p>
          </div>
          <DatabaseSetup />
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="properties" className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Properties in Sacramento
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover your perfect family home in Sacramento's most desirable neighborhoods
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between mb-8 p-4 bg-background rounded-lg shadow-sm border border-border/50">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Filter by:</span>
              <Button variant="outline" size="sm">Price Range</Button>
              <Button variant="outline" size="sm">Bedrooms</Button>
              <Button variant="outline" size="sm">Neighborhood</Button>
            </div>
            <Button variant="ghost" className="text-primary">
              View All Properties <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={index} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Agents Section */}
      <section id="agents" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Our Sacramento Real Estate Experts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team of local agents knows Sacramento inside and out, 
              helping families find their perfect home since 2016.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {agents.map((agent, index) => (
              <AgentCard key={index} {...agent} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Why Choose EquityBoys?
              </h2>
              <p className="text-xl text-muted-foreground">
                We're not just real estate agents – we're your neighbors, 
                dedicated to helping Sacramento families build their future.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Family-Focused</h3>
                  <p className="text-muted-foreground">
                    We understand the unique needs of growing families and prioritize 
                    schools, safety, and community.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <HomeIcon className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Local Expertise</h3>
                  <p className="text-muted-foreground">
                    Born and raised in Sacramento, we know every neighborhood, 
                    school district, and hidden gem.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Personal Service</h3>
                  <p className="text-muted-foreground">
                    Every client gets DJ's personal attention and commitment 
                    to finding your perfect home.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's start your Sacramento home buying journey today. 
            DJ Dawson and the EquityBoys team are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="warm" size="lg" className="text-lg px-8 py-4">
              Schedule a Consultation
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Browse All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <HomeIcon className="h-5 w-5 text-background" />
                </div>
                <h3 className="text-xl font-bold">EquityBoys</h3>
              </div>
              <p className="text-background/80">
                Sacramento's trusted real estate team, 
                helping families find their perfect home.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-background/80">
                <li>Home Buying</li>
                <li>Home Selling</li>
                <li>Property Investment</li>
                <li>Market Analysis</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Areas</h4>
              <ul className="space-y-2 text-background/80">
                <li>Downtown Sacramento</li>
                <li>Midtown</li>
                <li>East Sacramento</li>
                <li>Natomas</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-background/80">
                <p>(916) 555-0123</p>
                <p>info@equityboys.com</p>
                <p>Sacramento, CA</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <p>&copy; 2024 EquityBoys Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
