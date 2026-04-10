const express = require('express');
const router = express.Router();
const Zone = require('../db/schemas/zone');
const MedicalPost = require('../db/schemas/medicalPost');
const Volunteer = require('../db/schemas/volunteer');
const FoundCase = require('../db/schemas/foundCase');
const LostCase = require('../db/schemas/lostCase');

// Helper: parse pagination params with sensible defaults
function paginate(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Get all zones
router.get('/zones', async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.crowdDensity) filter.crowdDensity = req.query.crowdDensity;

    const [data, total] = await Promise.all([
      Zone.find(filter).skip(skip).limit(limit),
      Zone.countDocuments(filter)
    ]);
    res.json({ success: true, data, page, limit, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all medical posts
router.get('/medical-posts', async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.zone) filter.zone = req.query.zone;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      MedicalPost.find(filter).skip(skip).limit(limit),
      MedicalPost.countDocuments(filter)
    ]);
    res.json({ success: true, data, page, limit, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all volunteers
router.get('/volunteers', async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.zone) filter.currentZone = req.query.zone;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.specialization) filter.specialization = req.query.specialization;

    const [data, total] = await Promise.all([
      Volunteer.find(filter).skip(skip).limit(limit),
      Volunteer.countDocuments(filter)
    ]);
    res.json({ success: true, data, page, limit, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all found cases
router.get('/found-cases', async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      FoundCase.find(filter).skip(skip).limit(limit),
      FoundCase.countDocuments(filter)
    ]);
    res.json({ success: true, data, page, limit, total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send a message to the agent system
router.post('/message', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'A non-empty "message" string is required in the request body.'
      });
    }

    const bus = req.app.get('bus');
    bus.publish('message.received', {
      userId: userId || 'api-user',
      text: message.trim(),
      timestamp: Date.now()
    });

    res.json({
      success: true,
      message: 'Message dispatched to agent system'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
