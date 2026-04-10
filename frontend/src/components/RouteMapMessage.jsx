import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RoutingMachine({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#ea580c', weight: 5, opacity: 0.7 }]
      },
      createMarker: function(i, waypoint, n) {
        const marker = L.marker(waypoint.latLng, {
          icon: i === 0 ? startIcon : endIcon,
          draggable: false
        });
        return marker;
      }
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
}

function RouteMapMessage({ start, end, startName, endName, distance, duration }) {
  return (
    <div style={{ width: '100%', marginTop: '12px' }}>
      <div style={{ 
        background: '#fff7ed', 
        padding: '12px 16px', 
        borderRadius: '12px 12px 0 0',
        borderBottom: '2px solid #ea580c'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🗺️</span>
          <strong style={{ color: '#1f2937' }}>Route Navigation</strong>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#059669', fontWeight: 'bold' }}>📍 From:</span> {startName || 'Your Location'}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>📍 To:</span> {endName}
          </div>
          {distance && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '16px' }}>
              <span><strong>Distance:</strong> {distance}</span>
              {duration && <span><strong>Time:</strong> {duration}</span>}
            </div>
          )}
        </div>
      </div>
      <div style={{ width: '100%', height: '350px', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
        <MapContainer 
          center={[start.lat, start.lng]} 
          zoom={14} 
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <RoutingMachine start={start} end={end} />
        </MapContainer>
      </div>
    </div>
  );
}

export default RouteMapMessage;
