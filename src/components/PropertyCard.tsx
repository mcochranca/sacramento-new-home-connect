import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";

interface PropertyCardProps {
  image: string;
  price: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  status: "For Sale" | "Pending" | "Sold";
}

const PropertyCard = ({ image, price, address, beds, baths, sqft, status }: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "For Sale": return "bg-secondary text-secondary-foreground";
      case "Pending": return "bg-accent text-accent-foreground";
      case "Sold": return "bg-muted text-muted-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-border/50">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={address}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 bg-background/80 hover:bg-background text-foreground"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">{price}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{address}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{beds} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{baths} baths</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{sqft.toLocaleString()} sqft</span>
            </div>
          </div>
          
          <Button className="w-full" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;