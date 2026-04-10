const Groq = require('groq-sdk');
const Zone = require('../db/schemas/zone');
const MedicalPost = require('../db/schemas/medicalPost');
const Volunteer = require('../db/schemas/volunteer');
const FoundCase = require('../db/schemas/foundCase');
const { findHotels, getHotelRecommendations } = require('./hotelAgent');
const { translateText, detectLanguage } = require('../utils/translator');

// Import calculateDistance from hotelAgent
const { calculateDistance } = require('./hotelAgent');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Determine which agent should handle the request
async function routeToAgent(message) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('medical') || lowerMsg.includes('doctor') || lowerMsg.includes('hospital') || lowerMsg.includes('emergency') || lowerMsg.includes('ambulance')) {
    return 'medical';
  }
  if (lowerMsg.includes('lost') || lowerMsg.includes('found') || lowerMsg.includes('missing') || lowerMsg.includes('find person')) {
    return 'lost-and-found';
  }
  if (lowerMsg.includes('want to go') || lowerMsg.includes('go to') || lowerMsg.includes('go from') || lowerMsg.includes('route') || lowerMsg.includes('direction') || lowerMsg.includes('navigate') || lowerMsg.includes('path') || lowerMsg.includes('how to go') || lowerMsg.includes('how do i go') || lowerMsg.includes('take me to') || lowerMsg.includes('how to reach') || lowerMsg.includes('way to') || lowerMsg.includes('hotel') || lowerMsg.includes('accommodation') || lowerMsg.includes('stay') || lowerMsg.includes('lodge') || lowerMsg.includes('nearby') || lowerMsg.includes('crowd')) {
    return 'navigation';
  }
  return 'general';
}

// Medical Agent
async function medicalAgent(message) {
  const medicalPosts = await MedicalPost.find({ status: 'operational' }).limit(5);
  
  const context = `You are a medical assistance agent at Kumbh Mela. Here are nearby medical facilities:
${medicalPosts.map(p => `- ${p.name} at ${p.location} (${p.type}, ${p.capacity.beds - p.capacity.currentPatients} beds available)`).join('\n')}

Provide helpful medical guidance and direct them to appropriate facilities.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'user', content: `${context}\n\nUser question: ${message}` }
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return {
    agent: 'Medical Agent',
    reply: response.choices[0].message.content,
    data: medicalPosts.slice(0, 3)
  };
}

// Navigation Agent
async function navigationAgent(message, userLocation) {
  const zones = await Zone.find();
  const lowerMsg = message.toLowerCase();
  
  // Check if asking for route/directions
  const isRouteRequest = lowerMsg.includes('want to go') || lowerMsg.includes('go to') || lowerMsg.includes('go from') || lowerMsg.includes('route') || lowerMsg.includes('direction') || lowerMsg.includes('navigate') || lowerMsg.includes('path') || lowerMsg.includes('how to go') || lowerMsg.includes('take me to') || lowerMsg.includes('how do i go') || lowerMsg.includes('how to reach') || lowerMsg.includes('way to');
  
  if (isRouteRequest) {
    // Extract destination from message
    let destination = null;
    const zoneNames = zones.map(z => z.name.toLowerCase());
    
    for (const zone of zones) {
      if (lowerMsg.includes(zone.name.toLowerCase())) {
        destination = zone;
        break;
      }
    }
    
    // Check medical posts
    if (!destination) {
      const medicalPosts = await MedicalPost.find();
      for (const post of medicalPosts) {
        if (lowerMsg.includes(post.name.toLowerCase()) || lowerMsg.includes(post.zone.toLowerCase())) {
          destination = post;
          break;
        }
      }
    }
    
    // Check hotels
    if (!destination) {
      const hotels = await findHotels(null, {});
      for (const hotel of hotels) {
        if (lowerMsg.includes(hotel.name.toLowerCase()) || lowerMsg.includes(hotel.zone.toLowerCase())) {
          destination = hotel;
          break;
        }
      }
    }
    
    if (!userLocation) {
      return {
        agent: 'Navigation Agent',
        reply: 'To show you the route, I need your current location. Please share your live location so I can guide you to your destination.',
        needsLocation: true,
        requestingRoute: true,
        destination: destination,
        data: null
      };
    }
    
    if (!destination) {
      return {
        agent: 'Navigation Agent',
        reply: 'I couldn\'t identify your destination. Please specify a location like Ramkund, Trimbakeshwar, or a specific medical post/hotel name.',
        data: null
      };
    }
    
    // Calculate route
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      destination.coordinates.lat,
      destination.coordinates.lng
    );
    
    const duration = Math.ceil((distance / 5) * 60); // Assuming 5 km/h walking speed
    
    return {
      agent: 'Navigation Agent',
      reply: `I'll show you the route from your current location to ${destination.name}. The distance is approximately ${distance.toFixed(2)} km and will take about ${duration} minutes on foot.`,
      showRoute: true,
      routeData: {
        start: userLocation,
        end: destination.coordinates,
        startName: 'Your Location',
        endName: destination.name,
        distance: `${distance.toFixed(2)} km`,
        duration: `${duration} min`
      },
      data: destination
    };
  }
  
  // Check if asking for hotels
  if (lowerMsg.includes('hotel') || lowerMsg.includes('accommodation') || lowerMsg.includes('stay') || lowerMsg.includes('lodge')) {
    const needsLocation = !userLocation && (lowerMsg.includes('nearby') || lowerMsg.includes('nearest') || lowerMsg.includes('close'));
    
    if (needsLocation) {
      return {
        agent: 'Hotel Finder Agent',
        reply: 'To find the nearest hotels, I need your current location. Please share your location or tell me which zone you prefer (Ramkund, Trimbakeshwar, Tapovan, Gate 1-5).',
        needsLocation: true,
        data: null
      };
    }
    
    // Parse budget preferences
    let preferences = {};
    if (lowerMsg.includes('budget') || lowerMsg.includes('cheap') || lowerMsg.includes('affordable')) {
      preferences.budget = 'budget';
    } else if (lowerMsg.includes('luxury') || lowerMsg.includes('premium') || lowerMsg.includes('best')) {
      preferences.budget = 'luxury';
    }
    
    // Parse zone preference
    const zoneNames = ['ramkund', 'trimbakeshwar', 'tapovan', 'gate 1', 'gate 2', 'gate 3', 'gate 4', 'gate 5'];
    for (const zoneName of zoneNames) {
      if (lowerMsg.includes(zoneName)) {
        preferences.zone = zoneName.charAt(0).toUpperCase() + zoneName.slice(1);
        break;
      }
    }
    
    const hotels = await getHotelRecommendations(userLocation, preferences);
    
    if (hotels.length === 0) {
      return {
        agent: 'Hotel Finder Agent',
        reply: 'Sorry, no hotels are currently available matching your criteria. Would you like to see all available options?',
        data: null
      };
    }
    
    const hotelList = hotels.slice(0, 5).map(h => 
      `- ${h.name} (${h.type}) - ₹${h.priceRange.min}-${h.priceRange.max}/night, ${h.availableRooms} rooms available${h.distance ? `, ${h.distance}km away` : ''}, Rating: ${h.rating}/5`
    ).join('\n');
    
    const context = `You are a hotel booking assistant at Kumbh Mela. Here are the best available hotels:
${hotelList}

Provide a helpful summary and recommend the best options based on the user's needs. Be concise and friendly.`;
    
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: `${context}\n\nUser question: ${message}` }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return {
      agent: 'Hotel Finder Agent',
      reply: response.choices[0].message.content,
      showMap: true,
      locations: hotels.slice(0, 5),
      userLocation: userLocation,
      data: hotels
    };
  }
  
  // Regular navigation queries
  const medicalPosts = await MedicalPost.find();
  const context = `You are a navigation assistant at Kumbh Mela. Here are the zones and their crowd levels:
${zones.map(z => `- ${z.name}: ${z.crowdDensity} crowd (${z.currentCount}/${z.capacity} people)`).join('\n')}

Provide clear directions and crowd-aware route suggestions.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'user', content: `${context}\n\nUser question: ${message}` }
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return {
    agent: 'Navigation Agent',
    reply: response.choices[0].message.content,
    data: zones
  };
}

// Lost and Found Agent
async function lostAndFoundAgent(message) {
  const foundCases = await FoundCase.find({ status: 'unmatched' }).limit(10);
  
  const context = `You are a lost and found specialist at Kumbh Mela. We currently have ${foundCases.length} unmatched found persons.

Help users report lost persons or search for found persons. Ask for detailed descriptions (age, gender, clothing, physical features).`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'user', content: `${context}\n\nUser question: ${message}` }
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return {
    agent: 'Lost & Found Agent',
    reply: response.choices[0].message.content,
    data: foundCases.slice(0, 5)
  };
}

// General Agent
async function generalAgent(message) {
  const context = `You are Milan AI, a helpful assistant at Kumbh Mela Nashik. You help pilgrims with:
- Medical emergencies and health facilities
- Navigation and crowd management
- Lost and found persons
- General information about Kumbh Mela events

Be concise, helpful, and culturally sensitive.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'user', content: `${context}\n\nUser question: ${message}` }
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return {
    agent: 'General Agent',
    reply: response.choices[0].message.content,
    data: null
  };
}

// Main orchestrator
async function handleMessage(message, userLocation = null, userLanguage = 'en', onAgentAssigned = null) {
  try {
    // Detect language if not provided
    const detectedLang = await detectLanguage(message);
    const sourceLang = userLanguage || detectedLang;
    
    // Translate to English if needed for agent processing
    let englishMessage = message;
    if (sourceLang !== 'en') {
      englishMessage = await translateText(message, 'en');
    }
    
    const agentType = await routeToAgent(englishMessage);
    
    if (onAgentAssigned) {
      let prettyName = 'General AI Assistant';
      if (agentType === 'medical') prettyName = 'Medical Agent';
      else if (agentType === 'navigation') prettyName = 'Navigation Agent';
      else if (agentType === 'lost-and-found') prettyName = 'Lost & Found Agent';
      onAgentAssigned({ type: agentType, name: prettyName });
    }
    
    let result;
    switch (agentType) {
      case 'medical':
        result = await medicalAgent(englishMessage);
        break;
      case 'navigation':
        result = await navigationAgent(englishMessage, userLocation);
        break;
      case 'lost-and-found':
        result = await lostAndFoundAgent(englishMessage);
        break;
      default:
        result = await generalAgent(englishMessage);
    }
    
    // Translate response back to user's language
    if (sourceLang !== 'en' && result.reply) {
      result.reply = await translateText(result.reply, sourceLang);
    }
    
    return result;
  } catch (error) {
    console.error('Agent error:', error);
    return {
      agent: 'System',
      reply: 'I apologize, but I encountered an error. Please try again or contact a volunteer for assistance.',
      data: null
    };
  }
}

module.exports = { handleMessage };
