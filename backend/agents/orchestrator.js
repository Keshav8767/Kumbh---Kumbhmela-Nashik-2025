const Groq = require('groq-sdk');
const MedicalPost = require('../db/schemas/medicalPost');
const HOTELS_DATASET = require('../data/hotelsDataset');
const { translateText, detectLanguage } = require('../utils/translator');

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Session stores ───────────────────────────────────────────────────────────
const hotelSessions = {};
const lostSessions  = {};

// ─── In-memory lost person registry (QR wristband system) ────────────────────
const lostRegistry = {};
let caseCounter = 1000;

// ─── Hotel dataset helpers ────────────────────────────────────────────────────
const ALL_STATES = [...new Set(HOTELS_DATASET.map(h => h.state))].sort();

// ─── Router ───────────────────────────────────────────────────────────────────
async function routeToAgent(message, userId) {
  const lower = message.toLowerCase();
  if (hotelSessions[userId]) return 'hotel';
  if (lostSessions[userId])  return 'lost-and-found';

  if (lower.includes('medical') || lower.includes('doctor') ||
      lower.includes('hospital') || lower.includes('emergency') ||
      lower.includes('ambulance')) return 'medical';

  if (lower.includes('lost') || lower.includes('found') ||
      lower.includes('missing') || lower.includes('find person') ||
      lower.includes('register') || lower.match(/KM[-\s]?\d{3,6}/i))
    return 'lost-and-found';

  if (lower.includes('hotel') || lower.includes('room') ||
      lower.includes('stay') || lower.includes('accommodation') ||
      lower.includes('lodge') || lower.includes('dharamshala'))
    return 'hotel';

  return 'general';
}

// ─── Ambulance helper ─────────────────────────────────────────────────────────
function isAmbulanceRequest(message) {
  const keywords = ['ambulance','amblunce','ambluance','ambulence',
    'call ambulance','need ambulance','send ambulance','\u090f\u092e\u094d\u092c\u0941\u0932\u0947\u0902\u0938','\u0930\u0941\u0917\u094d\u0923\u0935\u093e\u0939\u093f\u0915\u093e'];
  return keywords.some(k => message.toLowerCase().includes(k));
}

// ─── Medical Agent ────────────────────────────────────────────────────────────
async function medicalAgent(message) {
  if (isAmbulanceRequest(message)) {
    return {
      agent: 'Medical Agent',
      reply: '\uD83D\uDEA8 Ambulance alert triggered! Calling 108 now. Stay calm and keep the patient still. Help is on the way.',
      callAmbulance: true,
      ambulanceContact: '108',
      data: []
    };
  }
  try {
    const medicalPosts = await MedicalPost.find({ status: 'operational' }).limit(5);
    const context = `You are a medical assistance agent at Kumbh Mela. Here are nearby medical facilities:\n${medicalPosts.map(p => `- ${p.name} at ${p.location} (${p.type}, ${p.capacity.beds - p.capacity.currentPatients} beds available)`).join('\n')}\n\nProvide helpful medical guidance.`;
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: `${context}\n\nUser question: ${message}` }],
      max_tokens: 500, temperature: 0.7,
    });
    return { agent: 'Medical Agent', reply: response.choices[0].message.content, data: medicalPosts.slice(0, 3) };
  } catch {
    return { agent: 'Medical Agent', reply: 'Please go to the nearest medical post or call 108 for emergencies.', data: [] };
  }
}

// ─── Hotel Agent ──────────────────────────────────────────────────────────────
async function hotelAgent(message, userId) {
  const lower = message.toLowerCase();
  const session = hotelSessions[userId] || { step: 'ask_state' };

  if (session.step === 'ask_state') {
    hotelSessions[userId] = { step: 'ask_stars' };
    const stateList = ALL_STATES.map((s, i) => `${i + 1}. ${s}`).join('\n');
    return { agent: 'Hotel Agent', reply: `\uD83C\uDFE8 Which state are you looking in?\n\n${stateList}\n\nSay the state name or number.` };
  }

  if (session.step === 'ask_stars') {
    let matchedState = null;
    const numMatch = lower.match(/(\d+)/);
    if (numMatch) {
      const idx = parseInt(numMatch[1]) - 1;
      if (idx >= 0 && idx < ALL_STATES.length) matchedState = ALL_STATES[idx];
    }
    if (!matchedState) matchedState = ALL_STATES.find(s => lower.includes(s.toLowerCase()));
    if (!matchedState) return { agent: 'Hotel Agent', reply: '\u274C State not found. Try: Maharashtra, Kerala, Delhi, Goa, etc.' };
    hotelSessions[userId] = { step: 'show_results', state: matchedState };
    return { agent: 'Hotel Agent', reply: `Hotels in ${matchedState}. What star rating?\n\n\u2B50 1 Star\n\u2B50\u2B50 2 Star\n\u2B50\u2B50\u2B50 3 Star\n\u2B50\u2B50\u2B50\u2B50 4 Star\n\u2B50\u2B50\u2B50\u2B50\u2B50 5 Star\n\uD83D\uDD04 Any\n\nSay the number or 'any'.` };
  }

  if (session.step === 'show_results') {
    const { state } = session;
    let stars = null;
    if (!lower.includes('any') && !lower.includes('all')) {
      const numMatch = lower.match(/(\d)/);
      if (numMatch) stars = parseInt(numMatch[1]);
    }
    let results = HOTELS_DATASET.filter(h => h.state === state);
    if (stars) results = results.filter(h => h.stars === stars);
    delete hotelSessions[userId];
    if (results.length === 0) return { agent: 'Hotel Agent', reply: `\uD83D\uDE14 No hotels found in ${state}${stars ? ` with ${stars} stars` : ''}. Say 'show hotels' to try again.`, hotels: [] };
    const imgs = ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600','https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600','https://images.unsplash.com/photo-1549294413-26f195200c16?w=600'];
    const hotels = results.slice(0, 8).map((h, i) => ({ name: h.name, city: h.city, state: h.state, rating: h.stars, address: h.address, rooms: h.rooms, alcohol: h.alcohol, images: [imgs[i % imgs.length]], type: h.stars >= 5 ? 'Luxury' : h.stars >= 3 ? 'Mid-range' : 'Budget', price: h.stars * 1500 }));
    return { agent: 'Hotel Agent', reply: `\u2705 Found ${results.length} hotel(s) in ${state}${stars ? ` (${stars}\u2B50)` : ''}! Showing top ${hotels.length}:`, hotels };
  }

  delete hotelSessions[userId];
  return { agent: 'Hotel Agent', reply: "Say 'show hotels' to search.", hotels: [] };
}

// ─── Lost & Found Agent ───────────────────────────────────────────────────────
async function lostAndFoundAgent(message, userId) {
  const lower = message.toLowerCase();
  const session = lostSessions[userId] || { step: 'ask_approach' };

  // ── IoT / QR scan fast-path ──────────────────────────────────────────────
  const qrMatch = message.match(/KM[-\s]?(\d{3,6})/i);
  if (qrMatch) {
    const qrId = 'KM-' + qrMatch[1];
    const found = Object.values(lostRegistry).find(c => c.qrId === qrId);
    delete lostSessions[userId];
    if (found) {
      return {
        agent: 'Lost & Found Agent',
        reply: `\uD83D\uDFE2 QR Match Found!\n\n\uD83D\uDC64 Name: ${found.name}\n\uD83D\uDC76 Age: ${found.age} | ${found.gender}\n\uD83D\uDCDE Family Contact: ${found.contact}\n\uD83D\uDCCD Last Seen: ${found.lastSeen}\n\uD83D\uDC55 Wearing: ${found.clothing}\n\nPlease call the family immediately and bring the person to the nearest Help Desk.`,
        lostFound: true, caseData: found
      };
    }
    return { agent: 'Lost & Found Agent', reply: `\u274C QR code ${qrId} not found. Please take the person to the nearest Help Desk at Gate 1 or Gate 3.` };
  }

  // ── STEP 1: Ask approach ─────────────────────────────────────────────────
  if (session.step === 'ask_approach') {
    lostSessions[userId] = { step: 'choose_approach' };
    return {
      agent: 'Lost & Found Agent',
      reply: `\uD83D\uDD0D Lost & Found System\n\nHow would you like to proceed?\n\n1\uFE0F\u20E3 I found a lost person\n2\uFE0F\u20E3 Register my family member (get QR wristband)\n3\uFE0F\u20E3 Search for a missing person\n\nSay the number.`
    };
  }

  // ── STEP 2: Choose approach ──────────────────────────────────────────────
  if (session.step === 'choose_approach') {
    if (lower.includes('1') || lower.includes('found a')) {
      lostSessions[userId] = { step: 'describe_found' };
      return {
        agent: 'Lost & Found Agent',
        reply: `\uD83D\uDCF7 IoT Approach: If the person has a QR wristband, type the code (e.g. KM-1234).\n\nNo wristband? Describe the person:\n- Age and gender\n- Clothing colour and type\n- Last seen location\n\nExample: "60 year old woman, red saree, near Ramkund"`
      };
    }
    if (lower.includes('2') || lower.includes('register')) {
      lostSessions[userId] = { step: 'register_name' };
      return { agent: 'Lost & Found Agent', reply: `\uD83D\uDCDD Register your family member for a QR wristband.\n\nWhat is their full name?` };
    }
    if (lower.includes('3') || lower.includes('search') || lower.includes('missing')) {
      lostSessions[userId] = { step: 'search_describe' };
      return { agent: 'Lost & Found Agent', reply: `\uD83D\uDD0D Describe the missing person:\n- Name (if known)\n- Age and gender\n- Clothing\n- Last seen location and time\n\nExample: "My father Ram, 65, white kurta, lost near Gate 2 at 10am"` };
    }
    lostSessions[userId] = { step: 'describe_found' };
    return { agent: 'Lost & Found Agent', reply: 'Please describe the person you found or are looking for.' };
  }

  // ── Found person: match against registry ─────────────────────────────────
  if (session.step === 'describe_found') {
    delete lostSessions[userId];
    const matches = Object.values(lostRegistry).filter(c =>
      lower.includes(c.name?.toLowerCase()) ||
      lower.includes(c.clothing?.toLowerCase()) ||
      lower.includes(c.lastSeen?.toLowerCase())
    );
    if (matches.length > 0) {
      const m = matches[0];
      return {
        agent: 'Lost & Found Agent',
        reply: `\uD83D\uDFE1 Possible Match Found!\n\n\uD83D\uDC64 Name: ${m.name}\n\uD83D\uDC76 Age: ${m.age} | ${m.gender}\n\uD83D\uDCDE Family Contact: ${m.contact}\n\uD83D\uDC55 Wearing: ${m.clothing}\n\uD83C\uDD94 QR Code: ${m.qrId}\n\nPlease call the family and bring the person to the nearest Help Desk.`,
        lostFound: true, caseData: m
      };
    }
    return {
      agent: 'Lost & Found Agent',
      reply: `\u2139\uFE0F No match found yet.\n\nPlease take the person to:\n\uD83D\uDCCD Gate 1 Help Desk\n\uD83D\uDCCD Gate 3 Help Desk\n\uD83D\uDCCD Ramkund Control Room\n\n\uD83D\uDCDE Lost & Found Helpline: 1800-XXX-XXXX`
    };
  }

  // ── Register: name → age/gender → contact → clothing → QR ───────────────
  if (session.step === 'register_name') {
    lostSessions[userId] = { step: 'register_age', name: message.trim() };
    return { agent: 'Lost & Found Agent', reply: `Got it. What is their age and gender? (e.g. "65 male")` };
  }
  if (session.step === 'register_age') {
    const ageMatch = message.match(/(\d+)/);
    const age = ageMatch ? parseInt(ageMatch[1]) : '?';
    const gender = (lower.includes('female') || lower.includes('woman') || lower.includes('girl')) ? 'female' : 'male';
    lostSessions[userId] = { ...session, step: 'register_contact', age, gender };
    return { agent: 'Lost & Found Agent', reply: `What is your contact number so we can reach you if they are found?` };
  }
  if (session.step === 'register_contact') {
    lostSessions[userId] = { ...session, step: 'register_clothing', contact: message.trim() };
    return { agent: 'Lost & Found Agent', reply: `What are they wearing? (e.g. "white kurta, blue dhoti")` };
  }
  if (session.step === 'register_clothing') {
    const { name, age, gender, contact } = session;
    const qrId = 'KM-' + (++caseCounter);
    lostRegistry[qrId] = { qrId, name, age, gender, contact, clothing: message.trim(), lastSeen: 'Kumbh Mela Nashik', registeredAt: new Date().toISOString() };
    delete lostSessions[userId];
    return {
      agent: 'Lost & Found Agent',
      reply: `\u2705 Registration Complete!\n\n\uD83C\uDD94 QR Wristband Code: ${qrId}\n\uD83D\uDC64 Name: ${name}\n\uD83D\uDC76 Age: ${age} | ${gender}\n\uD83D\uDCDE Contact: ${contact}\n\uD83D\uDC55 Wearing: ${message.trim()}\n\nCollect your QR wristband from the nearest Help Desk. If ${name} gets lost, any volunteer can scan it to find you instantly!`,
      qrCode: qrId
    };
  }

  // ── Search: describe missing person ──────────────────────────────────────
  if (session.step === 'search_describe') {
    delete lostSessions[userId];
    const matches = Object.values(lostRegistry).filter(c =>
      lower.includes(c.name?.toLowerCase()) ||
      lower.includes(c.clothing?.toLowerCase())
    );
    if (matches.length > 0) {
      const m = matches[0];
      return {
        agent: 'Lost & Found Agent',
        reply: `\uD83D\uDFE2 Match Found!\n\n\uD83D\uDC64 ${m.name} | Age: ${m.age} | ${m.gender}\n\uD83D\uDC55 Wearing: ${m.clothing}\n\uD83D\uDCCD Last Seen: ${m.lastSeen}\n\uD83C\uDD94 QR Code: ${m.qrId}\n\nGo to the nearest Help Desk with this QR code.`,
        lostFound: true, caseData: m
      };
    }
    return {
      agent: 'Lost & Found Agent',
      reply: `\uD83D\uDEA8 Missing Person Alert Registered!\n\nOur volunteers and camera network are now on alert.\n\n\uD83D\uDCDE Helpline: 1800-XXX-XXXX\n\uD83D\uDCCD Nearest Help Desk: Gate 1 or Gate 3\n\nStay calm. Most people are found within 30 minutes at Kumbh Mela.`
    };
  }

  delete lostSessions[userId];
  return { agent: 'Lost & Found Agent', reply: "Say 'lost person' or 'found person' to use the Lost & Found system." };
}

// ─── General Agent ────────────────────────────────────────────────────────────
async function generalAgent(message) {
  const context = `You are Milan AI, a helpful assistant at Kumbh Mela Nashik. You help pilgrims with medical emergencies, lost and found persons, hotel bookings, and general Kumbh Mela information. Be concise, helpful, and culturally sensitive.`;
  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: `${context}\n\nUser question: ${message}` }],
    max_tokens: 500, temperature: 0.7,
  });
  return { agent: 'General Agent', reply: response.choices[0].message.content, data: null };
}

// ─── Main orchestrator ────────────────────────────────────────────────────────
async function handleMessage(message, userLocation = null, userLanguage = 'en', userId = 'default') {
  try {
    const detectedLang = await detectLanguage(message);
    const sourceLang = userLanguage || detectedLang;
    let englishMessage = message;
    if (sourceLang !== 'en') englishMessage = await translateText(message, 'en');

    const agentType = await routeToAgent(englishMessage, userId);

    let result;
    switch (agentType) {
      case 'medical':        result = await medicalAgent(englishMessage); break;
      case 'hotel':          result = await hotelAgent(englishMessage, userId); break;
      case 'lost-and-found': result = await lostAndFoundAgent(englishMessage, userId); break;
      default:               result = await generalAgent(englishMessage);
    }

    if (sourceLang !== 'en' && result.reply) result.reply = await translateText(result.reply, sourceLang);
    return result;
  } catch (error) {
    console.error('Agent error:', error);
    return { agent: 'System', reply: 'Something went wrong. Please try again.', data: null };
  }
}

module.exports = { handleMessage };
