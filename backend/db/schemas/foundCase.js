const mongoose = require('mongoose');

const foundCaseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true
  },
  reportedBy: {
    name: String,
    volunteerId: String,
    contact: String
  },
  foundPerson: {
    approximateAge: Number,
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
    currentLocation: String,
    foundTime: Date,
    condition: {
      type: String,
      enum: ['healthy', 'distressed', 'injured', 'medical-attention'],
      default: 'healthy'
    },
    canCommunicate: Boolean,
    spokenLanguages: [String],
    statedName: String,
    statedHomeLocation: String,
    behavioralNotes: String
  },
  status: {
    type: String,
    enum: ['unmatched', 'potential-match', 'matched', 'reunited'],
    default: 'unmatched'
  },
  matchedWith: {
    lostCaseId: String,
    matchScore: Number,
    matchedAt: Date
  },
  currentCareLocation: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('FoundCase', foundCaseSchema);
