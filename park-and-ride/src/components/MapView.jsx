/**
 * Interactive map component using React Leaflet
 * Displays a map with user's current location for parking spot selection
 */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const MapView = () => {
  // State to store user's current geographical location
  const [userLocation, setUserLocation] = useState(null);

  /**
   * Hook to track user's geolocation
   * Uses browser's geolocation API to continuously update user position
   */
  useEffect(() => {
    if (navigator.geolocation) {
      // watchPosition provides continuous location updates
      navigator.geolocation.watchPosition(
        (position) => {
          // Update state with new coordinates when position changes
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true } // Request high accuracy location data
      );
    }
  }, []);

  return (
    // Initialize map centered on Delhi coordinates
    <MapContainer center={[28.7041, 77.1025]} zoom={12} className="h-[400px] w-full rounded-lg shadow-md">
      {/* OpenStreetMap tile layer for map rendering */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Conditional rendering of user location marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Your Current Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
