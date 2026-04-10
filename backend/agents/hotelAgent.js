const Hotel = require('../db/schemas/hotel');

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function findHotels(userLocation, filters = {}) {
  try {
    let query = { status: 'available', availableRooms: { $gt: 0 } };
    
    // Apply filters
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.maxPrice) {
      query['priceRange.max'] = { $lte: filters.maxPrice };
    }
    if (filters.minRating) {
      query.rating = { $gte: filters.minRating };
    }
    if (filters.zone) {
      query.zone = filters.zone;
    }
    
    let hotels = await Hotel.find(query);
    
    // Calculate distances if user location provided
    if (userLocation && userLocation.lat && userLocation.lng) {
      hotels = hotels.map(hotel => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          hotel.coordinates.lat,
          hotel.coordinates.lng
        );
        return {
          ...hotel.toObject(),
          distance: parseFloat(distance.toFixed(2))
        };
      });
      
      // Sort by distance
      hotels.sort((a, b) => a.distance - b.distance);
    } else {
      // Sort by rating if no location
      hotels.sort((a, b) => b.rating - a.rating);
    }
    
    return hotels;
  } catch (error) {
    console.error('Error finding hotels:', error);
    throw error;
  }
}

async function getHotelRecommendations(userLocation, preferences = {}) {
  const filters = {};
  
  // Parse preferences from natural language
  if (preferences.budget === 'low' || preferences.budget === 'budget') {
    filters.type = 'budget';
    filters.maxPrice = 1500;
  } else if (preferences.budget === 'luxury' || preferences.budget === 'high') {
    filters.type = 'luxury';
    filters.minRating = 4.5;
  } else if (preferences.budget === 'mid' || preferences.budget === 'medium') {
    filters.type = 'mid-range';
  }
  
  if (preferences.zone) {
    filters.zone = preferences.zone;
  }
  
  return await findHotels(userLocation, filters);
}

async function bookHotelByName(hotelName, numberOfRooms = 1) {
  try {
    // Case-insensitive partial match
    const hotel = await Hotel.findOne({ 
      name: { $regex: new RegExp(hotelName, 'i') },
      status: 'available'
    });

    if (!hotel) {
      return { success: false, reason: 'NOT_FOUND', hotelName };
    }

    if (hotel.availableRooms < numberOfRooms) {
      return { success: false, reason: 'NO_ROOMS', hotel, requested: numberOfRooms, available: hotel.availableRooms };
    }

    // Deduct rooms
    hotel.availableRooms -= numberOfRooms;
    if (hotel.availableRooms === 0) {
      hotel.status = 'full';
    }
    await hotel.save();

    // Generate a simple booking reference
    const bookingRef = `KN-${Date.now().toString(36).toUpperCase()}`;

    return { success: true, hotel, bookedRooms: numberOfRooms, bookingRef, remainingRooms: hotel.availableRooms };
  } catch (error) {
    console.error('Error booking hotel:', error);
    throw error;
  }
}

module.exports = {
  findHotels,
  getHotelRecommendations,
  calculateDistance,
  bookHotelByName
};
