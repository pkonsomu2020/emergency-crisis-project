
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LocationSharingProps {
  onLocationObtained?: (latitude: number, longitude: number) => void;
}

const LocationSharing: React.FC<LocationSharingProps> = ({ onLocationObtained }) => {
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support location sharing.",
        variant: "destructive",
      });
      return;
    }

    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLocationStatus('success');
        
        if (onLocationObtained) {
          onLocationObtained(latitude, longitude);
        }

        toast({
          title: "Location obtained",
          description: "Your current location has been successfully retrieved.",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus('error');
        
        toast({
          title: "Location error",
          description: getLocationErrorMessage(error),
          variant: "destructive",
        });
      }
    );
  };

  const getLocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission was denied. Please enable location services.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "Location request timed out.";
      default:
        return "An unknown error occurred while getting your location.";
    }
  };

  const openInMaps = () => {
    if (!location) return;
    
    // Create Google Maps URL with coordinates
    const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <Card className="w-full p-4 mt-4 border-2 border-emergency-yellow">
      <h2 className="text-center font-bold mb-4 flex justify-center items-center">
        <MapPin className="mr-2 text-emergency-red" /> Share Your Location
      </h2>
      
      <div className="flex flex-col items-center space-y-4">
        {locationStatus === 'success' && location && (
          <div className="w-full p-2 bg-gray-50 rounded text-sm text-center">
            <p className="mb-1">
              <span className="font-bold">Location:</span> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={openInMaps}
            >
              Open in Maps
            </Button>
          </div>
        )}
        
        <Button 
          onClick={getLocation} 
          className="w-full bg-emergency-yellow text-black hover:bg-yellow-600 hover:text-white"
          disabled={locationStatus === 'loading'}
        >
          {locationStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting location...
            </>
          ) : locationStatus === 'success' ? (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Refresh Location
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Share My Location
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Sharing your location can help emergency services find you quickly.
        </p>
      </div>
    </Card>
  );
};

export default LocationSharing;
