const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  crowdDensity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  landmarks: [String],
  capacity: Number,
  currentCount: Number
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);
