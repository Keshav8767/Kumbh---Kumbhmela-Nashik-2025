const mongoose = require('mongoose');

const medicalPostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  type: {
    type: String,
    enum: ['primary', 'emergency', 'first-aid', 'ambulance'],
    default: 'first-aid'
  },
  staff: {
    doctors: { type: Number, default: 0 },
    nurses: { type: Number, default: 0 },
    paramedics: { type: Number, default: 0 }
  },
  equipment: [String],
  capacity: {
    beds: Number,
    currentPatients: Number
  },
  contact: String,
  status: {
    type: String,
    enum: ['operational', 'busy', 'emergency', 'closed'],
    default: 'operational'
  },
  specialties: [String]
}, { timestamps: true });

module.exports = mongoose.model('MedicalPost', medicalPostSchema);
