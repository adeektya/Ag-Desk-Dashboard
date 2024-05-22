import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';
import { useFarm } from '../../contexts/FarmContext'; // Make sure the path is correct
import './map.css'; // Import your custom CSS file

declare global {
  interface Window {
    google: any;
  }
}

const SatelliteMapCard = () => {
  const { activeFarm } = useFarm();
  const [address, setAddress] = useState('');
  const [googleMap, setGoogleMap] = useState(null);
  const googleMapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const addMarker = (location, map) => {
    new window.google.maps.Marker({
      position: location,
      map: map,
      // Additional options can be added here
    });
  };

  useEffect(() => {
    if (window.google) {
      console.log('Google Maps already loaded');
      setGoogleMap(
        new window.google.maps.Map(googleMapRef.current, {
          zoom: 15,
          center: { lat: -27.4705, lng: 153.026 },
          mapTypeId: 'satellite',
        })
      );
      return; // If already loaded, then return early
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.onload = () => {
      console.log('Google Maps script loaded.');
      setGoogleMap(
        new window.google.maps.Map(googleMapRef.current, {
          zoom: 15,
          center: { lat: -27.4705, lng: 153.026 },
          mapTypeId: 'satellite',
        })
      );
    };
  }, [apiKey]);

  useEffect(() => {
    if (activeFarm && activeFarm.address) {
      setAddress(activeFarm.address);
    }
  }, [activeFarm]);

  useEffect(() => {
    if (address && googleMap) {
      handleSearch();
    }
  }, [address, googleMap]);

  const handleSearch = () => {
    if (!googleMap) {
      console.error('Google Map not initialized.');
      return;
    }

    const placesService = new window.google.maps.places.PlacesService(
      googleMap
    );
    placesService.findPlaceFromQuery(
      {
        query: address,
        fields: ['geometry'],
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results[0]
        ) {
          const location = results[0].geometry.location;
          googleMap.setCenter(location);
          addMarker(location, googleMap);
        } else {
          console.error('Place not found:', status);
        }
      }
    );
  };

  return (
    <Card className="satellite-map-card">
      <CardContent>
        <TextField
          label="Enter Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <div ref={googleMapRef} className="google-map" />
      </CardContent>
    </Card>
  );
};

export default SatelliteMapCard;
