import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, MessageCircle } from "lucide-react";

interface AgentCardProps {
  image: string;
  name: string;
  title: string;
  experience: string;
  specialties: string[];
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  isOwner?: boolean;
}

const AgentCard = ({ 
  image, 
  name, 
  title, 
  experience, 
  specialties, 
  rating, 
  reviews, 
  phone, 
  email,
  isOwner = false 
}: AgentCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-border/50">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="relative">
            <img 
              src={image} 
              alt={name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-secondary shadow-lg"
            />
            {isOwner && (
              <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground">
                Owner
              </Badge>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            <p className="text-muted-foreground font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{experience}</p>
          </div>
          
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground'}`} 
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">({reviews} reviews)</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Specialties:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Button className="w-full" variant="default">
              <Phone className="h-4 w-4 mr-2" />
              Call {name}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;