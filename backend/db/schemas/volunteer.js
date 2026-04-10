const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  volunteerId: {
    type: String,
    required: true,
    unique: true
  },
  languages: [{
    type: String,
    required: true
  }],
  currentZone: {
    type: String,
    required: true
  },
  skills: [String],
  contact: {
    phone: String,
    radio: String
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'off-duty', 'emergency'],
    default: 'available'
  },
  specialization: {
    type: String,
    enum: ['medical', 'navigation', 'lost-and-found', 'crowd-control', 'translation', 'general'],
    default: 'general'
  },
  shiftTiming: String,
  assignedTasks: [{
    taskType: String,
    description: String,
    timestamp: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
