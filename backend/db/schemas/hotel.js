const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zone: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  type: { type: String, enum: ['budget', 'mid-range', 'luxury', 'lodge', 'dharamshala'], default: 'mid-range' },
  images: [String],
  amenities: [String],
  priceRange: {
    min: Number,
    max: Number
  },
  contact: {
    phone: String,
    email: String
  },
  rating: { type: Number, min: 0, max: 5, default: 3 },
  availableRooms: { type: Number, default: 0 },
  totalRooms: { type: Number, required: true },
  distance: Number, // Will be calculated dynamically
  status: { type: String, enum: ['available', 'full', 'closed'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
