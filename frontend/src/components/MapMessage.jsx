import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapMessage({ locations, center, userLocation }) {
  return (
    <div style={{ width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', marginTop: '8px' }}>
      <MapContainer 
        center={center || [19.8762, 73.4329]} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Location markers */}
        {locations && locations.map((loc, idx) => (
          <Marker key={idx} position={[loc.coordinates.lat, loc.coordinates.lng]}>
            <Popup>
              <strong>{loc.name}</strong><br />
              {loc.location}<br />
              {loc.type && <em>{loc.type}</em>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapMessage;
