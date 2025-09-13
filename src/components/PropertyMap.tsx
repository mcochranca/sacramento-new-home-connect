import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Layers, Settings } from 'lucide-react';
import { Property } from '@/lib/supabase';

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  selectedProperty?: Property | null;
  center?: [number, number];
  zoom?: number;
}

const PropertyMap = ({ 
  properties, 
  onPropertySelect, 
  selectedProperty,
  center = [-121.4686, 38.5816], // Sacramento coordinates
  zoom = 11 
}: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    setShowTokenInput(false);

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, center, zoom]);

  // Add property markers
  useEffect(() => {
    if (!map.current || !properties.length) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    properties.forEach((property) => {
      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'property-marker';
      markerEl.innerHTML = `
        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <span class="text-primary-foreground font-bold text-sm">$${Math.round(property.price / 1000)}K</span>
        </div>
      `;

      // Add click handler
      markerEl.addEventListener('click', () => {
        onPropertySelect?.(property);
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: 'property-popup'
      }).setHTML(`
        <div class="p-3 min-w-[250px]">
          <h3 class="font-bold text-lg mb-2">$${property.price.toLocaleString()}</h3>
          <p class="text-sm text-gray-600 mb-2">${property.address}</p>
          <div class="flex items-center space-x-4 text-sm">
            <span>${property.bedrooms} bed</span>
            <span>${property.bathrooms} bath</span>
            <span>${property.square_feet.toLocaleString()} sqft</span>
          </div>
          <div class="mt-2">
            <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${property.status}</span>
          </div>
        </div>
      `);

      // Create and add marker
      new mapboxgl.Marker(markerEl)
        .setLngLat([property.longitude, property.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [properties, onPropertySelect]);

  // Center map on selected property
  useEffect(() => {
    if (!map.current || !selectedProperty) return;

    map.current.flyTo({
      center: [selectedProperty.longitude, selectedProperty.latitude],
      zoom: 15,
      duration: 1000
    });
  }, [selectedProperty]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="w-full h-96 flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-lg font-semibold">Enable Interactive Map</h3>
          <p className="text-muted-foreground">
            Enter your Mapbox public token to view properties on an interactive map
          </p>
          <div className="flex space-x-2 max-w-md">
            <Input
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGQ..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
              Connect
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your free token at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map overlay controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <Card className="p-2">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Available Properties ({properties.length})</span>
          </div>
        </Card>
      </div>

      {/* Property count badge */}
      <div className="absolute bottom-4 left-4">
        <Badge variant="secondary" className="px-3 py-1">
          <MapPin className="h-3 w-3 mr-1" />
          {properties.length} properties shown
        </Badge>
      </div>

      {/* Map style controls */}
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            if (map.current) {
              map.current.setStyle('mapbox://styles/mapbox/light-v11');
            }
          }}
        >
          Light
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            if (map.current) {
              map.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
            }
          }}
        >
          Satellite
        </Button>
      </div>
    </div>
  );
};

export default PropertyMap;