import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Users, Search, Phone, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">EquityBoys</h1>
              <p className="text-xs text-muted-foreground">Sacramento Real Estate</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#properties" className="text-foreground hover:text-primary transition-colors font-medium">
              Properties
            </a>
            <a href="#agents" className="text-foreground hover:text-primary transition-colors font-medium">
              Our Agents
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4" />
                      <span className="text-foreground/80">{user.email}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={signOut}
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="hero">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact DJ
                    </Button>
                    <Link to="/auth">
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a href="#properties" className="text-foreground hover:text-primary transition-colors font-medium">
                Properties
              </a>
              <a href="#agents" className="text-foreground hover:text-primary transition-colors font-medium">
                Our Agents
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search Properties
                </Button>
                
                {!loading && (
                  <>
                    {user ? (
                      <div className="flex flex-col space-y-3 pt-4 border-t border-border/50">
                        <div className="flex items-center space-x-2 text-sm text-foreground/80">
                          <User className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={signOut}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button variant="hero">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact DJ Dawson
                        </Button>
                        <Link to="/auth">
                          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover">
                            Sign In
                          </Button>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;