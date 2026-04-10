const mongoose = require('mongoose');

const lostCaseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true
  },
  reportedBy: {
    name: String,
    contact: String,
    relationship: String
  },
  missingPerson: {
    name: String,
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    description: {
      height: String,
      build: String,
      complexion: String,
      hairColor: String,
      hairStyle: String,
      facialHair: String,
      distinctiveFeatures: [String]
    },
    clothing: {
      upperWear: String,
      lowerWear: String,
      footwear: String,
      accessories: [String],
      colors: [String]
    },
    lastSeenLocation: String,
    lastSeenTime: Date,
    lastSeenWith: String,
    medicalConditions: [String],
    languages: [String]
  },
  status: {
    type: String,
    enum: ['active', 'found', 'closed'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  matchedCases: [{
    foundCaseId: String,
    matchScore: Number,
    matchedAt: Date
  }],
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('LostCase', lostCaseSchema);
