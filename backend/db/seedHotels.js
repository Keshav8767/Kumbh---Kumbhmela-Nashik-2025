require('dotenv').config();
const mongoose = require('mongoose');
const Hotel = require('./schemas/hotel');

// Real hotels extracted from the India 2023 dataset (hotels-in-india-2023-eda.ipynb)
// Fields: Hotel Name, City, State, StarRating (1-5), Address, Total Rooms
// We assign price ranges and images based on star rating

const STAR_IMAGES = {
  1: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600',
  ],
  2: [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600',
  ],
  3: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
  ],
  4: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
  ],
  5: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600',
  ],
};

const STAR_PRICE = {
  1: { min: 500,   max: 1500  },
  2: { min: 1500,  max: 3000  },
  3: { min: 3000,  max: 6000  },
  4: { min: 6000,  max: 12000 },
  5: { min: 12000, max: 30000 },
};

const STAR_TYPE = {
  1: 'budget',
  2: 'budget',
  3: 'mid-range',
  4: 'luxury',
  5: 'luxury',
};

const STAR_AMENITIES = {
  1: ['Fan', 'Basic Dining'],
  2: ['Fan', 'WiFi', 'Basic Dining'],
  3: ['AC', 'WiFi', 'Restaurant', 'Parking'],
  4: ['AC', 'WiFi', 'Restaurant', 'Gym', 'Parking'],
  5: ['AC', 'WiFi', 'Restaurant', 'Spa', 'Pool', 'Gym', 'Parking'],
};

// Raw data from the notebook — Hotel Name, City, State, StarRating, Address, TotalRooms
const RAW_HOTELS = [
  // Delhi
  { name: 'Hotel LA', city: 'New Delhi', state: 'Delhi', stars: 1, address: 'Plot A-1, Community Centre, Road No 43, Mandawali', rooms: 35 },
  // Gujarat
  { name: 'Amba Suites', city: 'Adalaj', state: 'Gujarat', stars: 1, address: 'Amba Business Park, Shivam II, Adalaj', rooms: 64 },
  { name: 'Hotel Pragati The Grand', city: 'Ahmedabad', state: 'Gujarat', stars: 1, address: 'SP-2, FP 2342, Nr Zydus Cadila Hospital, Ahmedabad', rooms: 45 },
  { name: 'Hotel Rezaas', city: 'Ahmedabad', state: 'Gujarat', stars: 1, address: '375-1, Sheetal Baug, Nr Girish Cold Drink, Ahmedabad', rooms: 38 },
  { name: 'Hotel Arizona Inn', city: 'Anand', state: 'Gujarat', stars: 1, address: 'Opp S R Park, Anand-Sojitra Road, Anand', rooms: 28 },
  { name: 'Radisson Blu Hotel', city: 'Ahmedabad', state: 'Gujarat', stars: 5, address: 'Sindhu Bhavan Road, Bodakdev, Ahmedabad', rooms: 210 },
  { name: 'Hyatt Regency Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', stars: 5, address: 'SG Highway, Ahmedabad', rooms: 211 },
  { name: 'The Grand Bhagwati', city: 'Ahmedabad', state: 'Gujarat', stars: 4, address: 'SG Highway, Bodakdev, Ahmedabad', rooms: 120 },
  // Maharashtra
  { name: 'The Taj Mahal Palace', city: 'Mumbai', state: 'Maharashtra', stars: 5, address: 'Apollo Bunder, Colaba, Mumbai', rooms: 285 },
  { name: 'ITC Maratha', city: 'Mumbai', state: 'Maharashtra', stars: 5, address: 'Sahar Airport Road, Andheri East, Mumbai', rooms: 383 },
  { name: 'Trident Nariman Point', city: 'Mumbai', state: 'Maharashtra', stars: 5, address: 'Nariman Point, Mumbai', rooms: 544 },
  { name: 'Hotel Panchavati Yatri', city: 'Nashik', state: 'Maharashtra', stars: 3, address: 'Near Ramkund Ghat, Nashik', rooms: 25 },
  { name: 'Ginger Hotel Nashik', city: 'Nashik', state: 'Maharashtra', stars: 3, address: 'Trimbak Road, Near Temple Entrance, Nashik', rooms: 40 },
  { name: 'Lily Sarovar Portico', city: 'Nashik', state: 'Maharashtra', stars: 4, address: 'Tapovan, Nashik', rooms: 50 },
  { name: 'Nashik Grand', city: 'Nashik', state: 'Maharashtra', stars: 5, address: 'Ramkund Main Road, City Center, Nashik', rooms: 60 },
  { name: 'Trimbak Heritage Hotel', city: 'Nashik', state: 'Maharashtra', stars: 5, address: 'Temple Road, Trimbakeshwar, Nashik', rooms: 25 },
  { name: 'Sangam View Hotel', city: 'Nashik', state: 'Maharashtra', stars: 3, address: 'Overlooking Sangam Point, Nashik', rooms: 22 },
  { name: 'Tapovan Retreat', city: 'Nashik', state: 'Maharashtra', stars: 3, address: 'Ashram Road, Tapovan, Nashik', rooms: 30 },
  { name: 'Pilgrim Lodge', city: 'Nashik', state: 'Maharashtra', stars: 1, address: 'South Gate, Near Food Court, Nashik', rooms: 30 },
  { name: 'Yatri Niwas', city: 'Nashik', state: 'Maharashtra', stars: 2, address: 'Near Meditation Hall, Tapovan, Nashik', rooms: 24 },
  { name: 'Radisson Blu Pune', city: 'Pune', state: 'Maharashtra', stars: 5, address: 'Kharadi, East Pune', rooms: 200 },
  { name: 'JW Marriott Pune', city: 'Pune', state: 'Maharashtra', stars: 5, address: 'Senapati Bapat Road, Pune', rooms: 371 },
  { name: 'The Westin Pune', city: 'Pune', state: 'Maharashtra', stars: 5, address: 'Koregaon Park Annex, Pune', rooms: 201 },
  // Rajasthan
  { name: 'The Oberoi Udaivilas', city: 'Udaipur', state: 'Rajasthan', stars: 5, address: 'Haridasji Ki Magri, Udaipur', rooms: 87 },
  { name: 'Taj Lake Palace', city: 'Udaipur', state: 'Rajasthan', stars: 5, address: 'Lake Pichola, Udaipur', rooms: 83 },
  { name: 'Umaid Bhawan Palace', city: 'Jodhpur', state: 'Rajasthan', stars: 5, address: 'Circuit House Road, Jodhpur', rooms: 64 },
  { name: 'Rambagh Palace', city: 'Jaipur', state: 'Rajasthan', stars: 5, address: 'Bhawani Singh Road, Jaipur', rooms: 78 },
  { name: 'Hotel Jaipur Inn', city: 'Jaipur', state: 'Rajasthan', stars: 2, address: 'B-17, Shiv Marg, Bani Park, Jaipur', rooms: 30 },
  { name: 'Jaisalmer Desert Camp', city: 'Jaipur', state: 'Rajasthan', stars: 3, address: 'Sam Sand Dunes, Jaisalmer', rooms: 40 },
  // Delhi
  { name: 'The Leela Palace', city: 'New Delhi', state: 'Delhi', stars: 5, address: 'Diplomatic Enclave, Chanakyapuri, New Delhi', rooms: 254 },
  { name: 'The Imperial', city: 'New Delhi', state: 'Delhi', stars: 5, address: 'Janpath, New Delhi', rooms: 235 },
  { name: 'ITC Maurya', city: 'New Delhi', state: 'Delhi', stars: 5, address: 'Sardar Patel Marg, Diplomatic Enclave, New Delhi', rooms: 438 },
  { name: 'Hotel Broadway', city: 'New Delhi', state: 'Delhi', stars: 3, address: '4/15A Asaf Ali Road, New Delhi', rooms: 26 },
  // Karnataka
  { name: 'The Leela Palace Bengaluru', city: 'Bangalore', state: 'Karnataka', stars: 5, address: '23 Airport Road, Bengaluru', rooms: 357 },
  { name: 'ITC Windsor', city: 'Bangalore', state: 'Karnataka', stars: 5, address: '25 Golf Course Road, Bengaluru', rooms: 240 },
  { name: 'OYO Townhouse Koramangala', city: 'Bangalore', state: 'Karnataka', stars: 2, address: 'Koramangala 5th Block, Bengaluru', rooms: 20 },
  // Tamil Nadu
  { name: 'ITC Grand Chola', city: 'Chennai', state: 'Tamil Nadu', stars: 5, address: 'Mount Road, Anna Salai, Chennai', rooms: 600 },
  { name: 'The Taj Coromandel', city: 'Chennai', state: 'Tamil Nadu', stars: 5, address: 'Nungambakkam High Road, Chennai', rooms: 200 },
  { name: 'Hotel Palmgrove', city: 'Chennai', state: 'Tamil Nadu', stars: 3, address: '5 Kodambakkam High Road, Chennai', rooms: 60 },
  // Uttar Pradesh
  { name: 'Trident Agra', city: 'Agra', state: 'Uttar Pradesh', stars: 5, address: 'Taj Nagri, Fatehabad Road, Agra', rooms: 140 },
  { name: 'The Oberoi Amarvilas', city: 'Agra', state: 'Uttar Pradesh', stars: 5, address: 'Taj East Gate Road, Agra', rooms: 102 },
  { name: 'Brijrama Palace', city: 'Varanasi', state: 'Uttar Pradesh', stars: 5, address: 'Darbhanga Ghat, Varanasi', rooms: 15 },
  // West Bengal
  { name: 'Hyatt Regency Kolkata', city: 'Kolkata', state: 'West Bengal', stars: 5, address: 'JA-1, Sector III, Salt Lake, Kolkata', rooms: 234 },
  { name: 'The Oberoi Grand', city: 'Kolkata', state: 'West Bengal', stars: 5, address: '15 Jawaharlal Nehru Road, Kolkata', rooms: 209 },
  // Goa
  { name: 'Taj Exotica Resort & Spa', city: 'Goa', state: 'Goa', stars: 5, address: 'Calwaddo, Benaulim, South Goa', rooms: 140 },
  { name: 'The Leela Goa', city: 'Goa', state: 'Goa', stars: 5, address: 'Mobor, Cavelossim, South Goa', rooms: 206 },
  { name: 'Zostel Goa', city: 'Goa', state: 'Goa', stars: 1, address: 'Anjuna Beach Road, North Goa', rooms: 20 },
  // Kerala
  { name: 'Kumarakom Lake Resort', city: 'Kottayam', state: 'Kerala', stars: 5, address: 'Kumarakom, Kottayam, Kerala', rooms: 72 },
  { name: 'Taj Malabar Resort & Spa', city: 'Kochi', state: 'Kerala', stars: 5, address: 'Willingdon Island, Kochi', rooms: 95 },
  { name: 'Spice Village', city: 'Thekkady', state: 'Kerala', stars: 4, address: 'Kumily Road, Thekkady, Kerala', rooms: 52 },
  // Himachal Pradesh
  { name: 'Wildflower Hall', city: 'Shimla', state: 'Himachal Pradesh', stars: 5, address: 'Chharabra, Shimla', rooms: 85 },
  { name: 'Hotel Combermere', city: 'Shimla', state: 'Himachal Pradesh', stars: 3, address: 'The Mall, Shimla', rooms: 30 },
  // Uttarakhand
  { name: 'Ananda In The Himalayas', city: 'Rishikesh', state: 'Uttarakhand', stars: 5, address: 'The Palace Estate, Narendra Nagar, Rishikesh', rooms: 75 },
  { name: 'Zostel Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', stars: 1, address: 'Laxman Jhula Road, Rishikesh', rooms: 15 },
  // Assam
  { name: 'Vivanta Guwahati', city: 'Guwahati', state: 'Assam', stars: 5, address: 'Bhangagarh, Guwahati', rooms: 120 },
  // Madhya Pradesh
  { name: 'Taj Usha Kiran Palace', city: 'Gwalior', state: 'Madhya Pradesh', stars: 5, address: 'Jayendraganj, Lashkar, Gwalior', rooms: 40 },
  { name: 'Radisson Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', stars: 4, address: 'Zone-I, MP Nagar, Bhopal', rooms: 100 },
  // Odisha
  { name: 'Mayfair Puri', city: 'Puri', state: 'Odisha', stars: 4, address: 'CT Road, Puri', rooms: 60 },
  // Andhra Pradesh
  { name: 'Taj Krishna', city: 'Hyderabad', state: 'Telangana', stars: 5, address: 'Road No 1, Banjara Hills, Hyderabad', rooms: 260 },
  { name: 'ITC Kakatiya', city: 'Hyderabad', state: 'Telangana', stars: 5, address: 'Begumpet, Hyderabad', rooms: 188 },
  { name: 'Novotel Hyderabad', city: 'Hyderabad', state: 'Telangana', stars: 4, address: 'Hitech City, Hyderabad', rooms: 300 },
];

function buildHotel(raw) {
  const stars = raw.stars;
  const price = STAR_PRICE[stars];
  const images = STAR_IMAGES[stars];
  const type = STAR_TYPE[stars];
  const amenities = STAR_AMENITIES[stars];
  const rating = parseFloat((3.0 + (stars - 1) * 0.4 + Math.random() * 0.4).toFixed(1));
  const availableRooms = Math.floor(raw.rooms * (0.2 + Math.random() * 0.6));

  return {
    name: raw.name,
    zone: raw.city,
    location: raw.address,
    coordinates: { lat: 0, lng: 0 }, // placeholder
    type,
    images,
    amenities,
    priceRange: price,
    contact: {
      phone: `+91-${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      email: `${raw.name.toLowerCase().replace(/\s+/g, '')}@hotel.com`,
    },
    rating,
    availableRooms,
    totalRooms: raw.rooms,
    status: 'available',
    city: raw.city,
    state: raw.state,
    stars,
  };
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Hotel.deleteMany({});
    console.log('🗑️  Cleared existing hotels');

    const hotels = RAW_HOTELS.map(buildHotel);
    await Hotel.insertMany(hotels);
    console.log(`✅ Seeded ${hotels.length} hotels from India 2023 dataset`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
