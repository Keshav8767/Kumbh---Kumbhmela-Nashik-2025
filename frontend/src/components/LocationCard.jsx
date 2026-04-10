import React from 'react';
import './LocationCard.css';

function LocationCard({ location, distance }) {
  return (
    <div className="location-card">
      <div className="location-header">
        <h4>{location.name}</h4>
        {(distance || location.distance) && (
          <span className="distance">{distance || location.distance} km</span>
        )}
      </div>
      <p className="location-address">{location.location}</p>
      {location.type && <span className="location-type">{location.type}</span>}
      {location.priceRange && (
        <p className="location-price">
          ₹{location.priceRange.min} - ₹{location.priceRange.max}/night
        </p>
      )}
      {location.rating && (
        <p className="location-rating">⭐ {location.rating}/5</p>
      )}
      {location.availableRooms !== undefined && (
        <p className="location-rooms">{location.availableRooms} rooms available</p>
      )}
      {location.contact && location.contact.phone && (
        <a href={`tel:${location.contact.phone}`} className="location-contact">
          📞 {location.contact.phone}
        </a>
      )}
    </div>
  );
}

export default LocationCard;
