require('dotenv').config();
const mongoose = require('mongoose');
const Zone = require('./schemas/zone');
const MedicalPost = require('./schemas/medicalPost');
const Volunteer = require('./schemas/volunteer');
const FoundCase = require('./schemas/foundCase');
const LostCase = require('./schemas/lostCase');
const Hotel = require('./schemas/hotel');

const zones = [
  { name: 'Ramkund', description: 'Main bathing ghat', crowdDensity: 'high', coordinates: { lat: 19.8762, lng: 73.4329 }, landmarks: ['Ramkund Ghat', 'Temple Square'], capacity: 50000, currentCount: 42000 },
  { name: 'Trimbakeshwar', description: 'Sacred temple zone', crowdDensity: 'critical', coordinates: { lat: 19.9333, lng: 73.5333 }, landmarks: ['Trimbakeshwar Temple', 'Kushavarta Kund'], capacity: 30000, currentCount: 31000 },
  { name: 'Tapovan', description: 'Meditation area', crowdDensity: 'medium', coordinates: { lat: 19.8800, lng: 73.4400 }, landmarks: ['Tapovan Ashram', 'Meditation Hall'], capacity: 20000, currentCount: 12000 },
  { name: 'Gate 1', description: 'North entrance', crowdDensity: 'high', coordinates: { lat: 19.8850, lng: 73.4250 }, landmarks: ['North Gate', 'Bus Stand'], capacity: 15000, currentCount: 13500 },
  { name: 'Gate 2', description: 'East entrance', crowdDensity: 'medium', coordinates: { lat: 19.8700, lng: 73.4450 }, landmarks: ['East Gate', 'Parking Area'], capacity: 15000, currentCount: 9000 },
  { name: 'Gate 3', description: 'South entrance', crowdDensity: 'low', coordinates: { lat: 19.8650, lng: 73.4300 }, landmarks: ['South Gate', 'Food Court'], capacity: 15000, currentCount: 5000 },
  { name: 'Gate 4', description: 'West entrance', crowdDensity: 'medium', coordinates: { lat: 19.8750, lng: 73.4200 }, landmarks: ['West Gate', 'Information Center'], capacity: 15000, currentCount: 8500 },
  { name: 'Gate 5', description: 'VIP entrance', crowdDensity: 'low', coordinates: { lat: 19.8800, lng: 73.4350 }, landmarks: ['VIP Gate', 'Admin Office'], capacity: 10000, currentCount: 3000 }
];

const medicalPosts = [
  { name: 'Ramkund Medical Center', zone: 'Ramkund', location: 'Near Ramkund Ghat', coordinates: { lat: 19.8765, lng: 73.4330 }, type: 'emergency', staff: { doctors: 5, nurses: 10, paramedics: 8 }, equipment: ['Ambulance', 'Defibrillator', 'Oxygen', 'X-Ray'], capacity: { beds: 20, currentPatients: 8 }, contact: '+91-9876543210', status: 'operational', specialties: ['Emergency', 'Cardiology'] },
  { name: 'Trimbakeshwar First Aid', zone: 'Trimbakeshwar', location: 'Temple Entrance', coordinates: { lat: 19.9335, lng: 73.5335 }, type: 'first-aid', staff: { doctors: 2, nurses: 4, paramedics: 3 }, equipment: ['First Aid Kit', 'Stretcher'], capacity: { beds: 5, currentPatients: 2 }, contact: '+91-9876543211', status: 'busy', specialties: ['First Aid'] },
  { name: 'Tapovan Health Post', zone: 'Tapovan', location: 'Ashram Road', coordinates: { lat: 19.8802, lng: 73.4402 }, type: 'primary', staff: { doctors: 3, nurses: 6, paramedics: 4 }, equipment: ['Basic Medical', 'Oxygen'], capacity: { beds: 10, currentPatients: 3 }, contact: '+91-9876543212', status: 'operational', specialties: ['General Medicine'] },
  { name: 'Gate 1 Emergency Unit', zone: 'Gate 1', location: 'North Gate Complex', coordinates: { lat: 19.8852, lng: 73.4252 }, type: 'emergency', staff: { doctors: 4, nurses: 8, paramedics: 6 }, equipment: ['Ambulance', 'Defibrillator', 'Oxygen'], capacity: { beds: 15, currentPatients: 5 }, contact: '+91-9876543213', status: 'operational', specialties: ['Emergency', 'Trauma'] },
  { name: 'Gate 2 Medical Post', zone: 'Gate 2', location: 'East Gate', coordinates: { lat: 19.8702, lng: 73.4452 }, type: 'first-aid', staff: { doctors: 2, nurses: 3, paramedics: 2 }, equipment: ['First Aid Kit'], capacity: { beds: 5, currentPatients: 1 }, contact: '+91-9876543214', status: 'operational', specialties: ['First Aid'] },
  { name: 'Gate 3 Health Center', zone: 'Gate 3', location: 'South Gate', coordinates: { lat: 19.8652, lng: 73.4302 }, type: 'primary', staff: { doctors: 2, nurses: 4, paramedics: 3 }, equipment: ['Basic Medical', 'Oxygen'], capacity: { beds: 8, currentPatients: 2 }, contact: '+91-9876543215', status: 'operational', specialties: ['General Medicine'] },
  { name: 'Gate 4 First Aid', zone: 'Gate 4', location: 'West Gate', coordinates: { lat: 19.8752, lng: 73.4202 }, type: 'first-aid', staff: { doctors: 1, nurses: 3, paramedics: 2 }, equipment: ['First Aid Kit', 'Stretcher'], capacity: { beds: 5, currentPatients: 0 }, contact: '+91-9876543216', status: 'operational', specialties: ['First Aid'] },
  { name: 'Central Ambulance Hub', zone: 'Ramkund', location: 'Central Square', coordinates: { lat: 19.8770, lng: 73.4335 }, type: 'ambulance', staff: { doctors: 1, nurses: 2, paramedics: 10 }, equipment: ['5 Ambulances', 'Emergency Kit'], capacity: { beds: 0, currentPatients: 0 }, contact: '+91-9876543217', status: 'operational', specialties: ['Emergency Transport'] },
  { name: 'Tapovan Wellness Center', zone: 'Tapovan', location: 'Meditation Hall', coordinates: { lat: 19.8805, lng: 73.4405 }, type: 'primary', staff: { doctors: 2, nurses: 5, paramedics: 2 }, equipment: ['Basic Medical', 'Mental Health Support'], capacity: { beds: 8, currentPatients: 1 }, contact: '+91-9876543218', status: 'operational', specialties: ['General Medicine', 'Mental Health'] },
  { name: 'Gate 5 VIP Medical', zone: 'Gate 5', location: 'VIP Complex', coordinates: { lat: 19.8802, lng: 73.4352 }, type: 'primary', staff: { doctors: 3, nurses: 5, paramedics: 3 }, equipment: ['Advanced Medical', 'Oxygen', 'Defibrillator'], capacity: { beds: 10, currentPatients: 2 }, contact: '+91-9876543219', status: 'operational', specialties: ['General Medicine', 'VIP Care'] }
];

const languages = ['Hindi', 'English', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];
const names = ['Amit', 'Priya', 'Raj', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Pooja', 'Arjun', 'Kavya', 'Sanjay', 'Meera', 'Karan', 'Divya', 'Rohan', 'Nisha', 'Aditya', 'Ritu', 'Manish', 'Swati', 'Deepak', 'Neha', 'Suresh', 'Lakshmi', 'Vijay', 'Asha', 'Ramesh', 'Sunita', 'Prakash', 'Geeta'];

const volunteers = names.map((name, i) => ({
  name,
  volunteerId: `VOL${String(i + 1).padStart(4, '0')}`,
  languages: [languages[i % languages.length], languages[(i + 1) % languages.length]],
  currentZone: zones[i % zones.length].name,
  skills: i % 3 === 0 ? ['First Aid', 'Crowd Control'] : i % 3 === 1 ? ['Translation', 'Navigation'] : ['Lost and Found', 'Communication'],
  contact: { phone: `+91-98765${String(43220 + i).padStart(5, '0')}`, radio: `CH${(i % 10) + 1}` },
  status: i % 10 === 0 ? 'busy' : 'available',
  specialization: ['medical', 'navigation', 'lost-and-found', 'translation', 'general'][i % 5],
  shiftTiming: i % 2 === 0 ? '6AM-2PM' : '2PM-10PM',
  assignedTasks: [] // Intentionally empty — schema expects [{taskType, description, timestamp}]
}));

const genders = ['male', 'female', 'other'];
const heights = ['4\'5"', '4\'8"', '5\'0"', '5\'2"', '5\'4"', '5\'6"', '5\'8"', '5\'10"', '6\'0"'];
const builds = ['slim', 'average', 'heavy', 'athletic'];
const complexions = ['fair', 'wheatish', 'dark', 'very fair'];
const hairColors = ['black', 'grey', 'white', 'brown'];
const hairStyles = ['short', 'long', 'bald', 'shoulder-length', 'tied'];
const upperWear = ['white kurta', 'blue shirt', 'red saree', 'green kurta', 'yellow shirt', 'orange dhoti', 'purple kurta', 'brown jacket'];
const lowerWear = ['white dhoti', 'blue jeans', 'black pants', 'white pajama', 'brown pants'];
const conditions = ['healthy', 'distressed', 'injured', 'medical-attention'];

const hotels = [
  { name: 'Hotel Panchavati Yatri', zone: 'Ramkund', location: 'Near Ramkund Ghat, 200m from main bathing area', coordinates: { lat: 19.8770, lng: 73.4340 }, type: 'mid-range', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', 'Parking'], priceRange: { min: 1500, max: 3000 }, contact: { phone: '+91-253-2570301', email: 'panchavati@hotel.com' }, rating: 4.2, availableRooms: 8, totalRooms: 25, status: 'available' },
  { name: 'Ginger Hotel Nashik', zone: 'Trimbakeshwar', location: 'Trimbak Road, Near Temple Entrance', coordinates: { lat: 19.9340, lng: 73.5340 }, type: 'mid-range', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', '24/7 Service'], priceRange: { min: 2000, max: 4000 }, contact: { phone: '+91-253-6666000', email: 'ginger@hotel.com' }, rating: 4.5, availableRooms: 12, totalRooms: 40, status: 'available' },
  { name: 'Express Inn', zone: 'Gate 1', location: 'North Gate Complex, Bus Stand Area', coordinates: { lat: 19.8855, lng: 73.4255 }, type: 'budget', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600'], amenities: ['Fan', 'WiFi', 'Basic Dining'], priceRange: { min: 800, max: 1500 }, contact: { phone: '+91-253-2345678', email: 'express@hotel.com' }, rating: 3.5, availableRooms: 5, totalRooms: 20, status: 'available' },
  { name: 'Lily Sarovar Portico', zone: 'Tapovan', location: 'Tapovan Meditation Area, Peaceful Location', coordinates: { lat: 19.8810, lng: 73.4410 }, type: 'luxury', images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', 'Spa', 'Pool', 'Gym'], priceRange: { min: 4000, max: 8000 }, contact: { phone: '+91-253-6619999', email: 'lily@hotel.com' }, rating: 4.8, availableRooms: 15, totalRooms: 50, status: 'available' },
  { name: 'Kumbh Residency', zone: 'Gate 2', location: 'East Gate, Near Parking Area', coordinates: { lat: 19.8702, lng: 73.4452 }, type: 'budget', images: ['https://images.unsplash.com/photo-1586611292717-f828b167408c?w=600', 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600'], amenities: ['Fan', 'Basic Dining'], priceRange: { min: 600, max: 1200 }, contact: { phone: '+91-253-2456789', email: 'kumbh@hotel.com' }, rating: 3.2, availableRooms: 3, totalRooms: 15, status: 'available' },
  { name: 'Nashik Grand', zone: 'Ramkund', location: 'Ramkund Main Road, City Center', coordinates: { lat: 19.8765, lng: 73.4335 }, type: 'luxury', images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', 'Bar', 'Conference Hall'], priceRange: { min: 5000, max: 10000 }, contact: { phone: '+91-253-2580000', email: 'grand@hotel.com' }, rating: 4.6, availableRooms: 20, totalRooms: 60, status: 'available' },
  { name: 'Pilgrim Lodge', zone: 'Gate 3', location: 'South Gate, Near Food Court', coordinates: { lat: 19.8652, lng: 73.4302 }, type: 'budget', images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600'], amenities: ['Fan', 'WiFi', 'Shared Bathroom'], priceRange: { min: 400, max: 800 }, contact: { phone: '+91-253-2567890', email: 'pilgrim@lodge.com' }, rating: 3.0, availableRooms: 10, totalRooms: 30, status: 'available' },
  { name: 'Trimbak Heritage Hotel', zone: 'Trimbakeshwar', location: 'Temple Road, Heritage Property', coordinates: { lat: 19.9335, lng: 73.5335 }, type: 'luxury', images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600', 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', 'Heritage Tours', 'Cultural Programs'], priceRange: { min: 6000, max: 12000 }, contact: { phone: '+91-253-2690000', email: 'heritage@hotel.com' }, rating: 4.7, availableRooms: 8, totalRooms: 25, status: 'available' },
  { name: 'Budget Stay Inn', zone: 'Gate 4', location: 'West Gate, Information Center Nearby', coordinates: { lat: 19.8752, lng: 73.4202 }, type: 'budget', images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600', 'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=600'], amenities: ['Fan', 'Basic Dining'], priceRange: { min: 500, max: 1000 }, contact: { phone: '+91-253-2678901', email: 'budget@hotel.com' }, rating: 3.3, availableRooms: 6, totalRooms: 18, status: 'available' },
  { name: 'Tapovan Retreat', zone: 'Tapovan', location: 'Ashram Road, Quiet Area', coordinates: { lat: 19.8805, lng: 73.4405 }, type: 'mid-range', images: ['https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'], amenities: ['AC', 'WiFi', 'Yoga Classes', 'Meditation Hall'], priceRange: { min: 2500, max: 5000 }, contact: { phone: '+91-253-2689012', email: 'retreat@hotel.com' }, rating: 4.4, availableRooms: 10, totalRooms: 30, status: 'available' },
  { name: 'Dharamshala Kumbh', zone: 'Gate 5', location: 'VIP Gate Area, Government Facility', coordinates: { lat: 19.8802, lng: 73.4352 }, type: 'dharamshala', images: ['https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=600', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'], amenities: ['Fan', 'Shared Facilities', 'Free Meals'], priceRange: { min: 0, max: 200 }, contact: { phone: '+91-253-2690123', email: 'dharamshala@gov.in' }, rating: 3.8, availableRooms: 50, totalRooms: 100, status: 'available' },
  { name: 'Sangam View Hotel', zone: 'Ramkund', location: 'Overlooking Sangam Point', coordinates: { lat: 19.8768, lng: 73.4338 }, type: 'mid-range', images: ['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600', 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', 'River View'], priceRange: { min: 2000, max: 4500 }, contact: { phone: '+91-253-2701234', email: 'sangam@hotel.com' }, rating: 4.3, availableRooms: 7, totalRooms: 22, status: 'available' },
  { name: 'Nashik Inn', zone: 'Gate 1', location: 'Near Bus Stand, Easy Access', coordinates: { lat: 19.8850, lng: 73.4250 }, type: 'budget', images: ['https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600', 'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=600'], amenities: ['Fan', 'WiFi'], priceRange: { min: 700, max: 1400 }, contact: { phone: '+91-253-2712345', email: 'nashikinn@hotel.com' }, rating: 3.4, availableRooms: 4, totalRooms: 16, status: 'available' },
  { name: 'Royal Palace Hotel', zone: 'Trimbakeshwar', location: 'Main Market Area', coordinates: { lat: 19.9338, lng: 73.5338 }, type: 'luxury', images: ['https://images.unsplash.com/photo-1549294413-26f195200c16?w=600', 'https://images.unsplash.com/photo-1564501049559-0a02629a8414?w=600'], amenities: ['AC', 'WiFi', 'Restaurant', 'Banquet Hall', 'Valet Parking'], priceRange: { min: 7000, max: 15000 }, contact: { phone: '+91-253-2723456', email: 'royal@hotel.com' }, rating: 4.9, availableRooms: 18, totalRooms: 45, status: 'available' },
  { name: 'Yatri Niwas', zone: 'Tapovan', location: 'Near Meditation Hall', coordinates: { lat: 19.8808, lng: 73.4408 }, type: 'budget', images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600', 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600'], amenities: ['Fan', 'Basic Dining', 'Prayer Room'], priceRange: { min: 600, max: 1100 }, contact: { phone: '+91-253-2734567', email: 'yatri@hotel.com' }, rating: 3.6, availableRooms: 9, totalRooms: 24, status: 'available' }
];

const foundCases = Array.from({ length: 50 }, (_, i) => {
  const age = 5 + Math.floor(Math.random() * 75);
  const gender = genders[i % 3];
  const zone = zones[i % zones.length].name;
  
  return {
    caseId: `FOUND${String(i + 1).padStart(5, '0')}`,
    reportedBy: {
      name: volunteers[i % volunteers.length].name,
      volunteerId: volunteers[i % volunteers.length].volunteerId,
      contact: volunteers[i % volunteers.length].contact.phone
    },
    foundPerson: {
      approximateAge: age,
      gender,
      description: {
        height: heights[i % heights.length],
        build: builds[i % builds.length],
        complexion: complexions[i % complexions.length],
        hairColor: hairColors[i % hairColors.length],
        hairStyle: hairStyles[i % hairStyles.length],
        facialHair: gender === 'male' && i % 3 === 0 ? 'beard' : 'none',
        distinctiveFeatures: i % 5 === 0 ? ['scar on forehead'] : i % 5 === 1 ? ['mole on cheek'] : i % 5 === 2 ? ['tattoo on arm'] : []
      },
      clothing: {
        upperWear: upperWear[i % upperWear.length],
        lowerWear: lowerWear[i % lowerWear.length],
        footwear: i % 3 === 0 ? 'sandals' : i % 3 === 1 ? 'shoes' : 'barefoot',
        accessories: i % 4 === 0 ? ['glasses'] : i % 4 === 1 ? ['watch'] : [],
        colors: [['white', 'blue'], ['red', 'yellow'], ['green', 'brown']][i % 3]
      },
      currentLocation: zone,
      foundTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      condition: conditions[i % conditions.length],
      canCommunicate: i % 4 !== 0,
      spokenLanguages: [languages[i % languages.length]],
      statedName: i % 4 !== 0 ? ['Ram', 'Sita', 'Krishna', 'Radha', 'Shiva', 'Parvati'][i % 6] : null,
      statedHomeLocation: i % 4 !== 0 ? ['Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad'][i % 6] : null,
      behavioralNotes: i % 5 === 0 ? 'Confused and disoriented' : i % 5 === 1 ? 'Calm and cooperative' : i % 5 === 2 ? 'Anxious' : 'Non-responsive'
    },
    status: 'unmatched',
    currentCareLocation: medicalPosts[i % medicalPosts.length].name,
    notes: `Found near ${zone} area`
  };
});

async function seed() {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb+srv://...') {
      console.log('❌ MongoDB URI not configured in .env file');
      console.log('   Please set MONGODB_URI to a valid MongoDB connection string');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing data...');
    await Zone.deleteMany({});
    await MedicalPost.deleteMany({});
    await Volunteer.deleteMany({});
    await FoundCase.deleteMany({});
    await LostCase.deleteMany({});
    await Hotel.deleteMany({});

    console.log('📍 Seeding zones...');
    await Zone.insertMany(zones);
    console.log(`   ✓ ${zones.length} zones created`);

    console.log('🏥 Seeding medical posts...');
    await MedicalPost.insertMany(medicalPosts);
    console.log(`   ✓ ${medicalPosts.length} medical posts created`);

    console.log('👥 Seeding volunteers...');
    await Volunteer.insertMany(volunteers);
    console.log(`   ✓ ${volunteers.length} volunteers created`);

    console.log('🏨 Seeding hotels...');
    await Hotel.insertMany(hotels);
    console.log(`   ✓ ${hotels.length} hotels created`);

    console.log('🔍 Seeding found cases...');
    await FoundCase.insertMany(foundCases);
    console.log(`   ✓ ${foundCases.length} found cases created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Zones: ${zones.length}`);
    console.log(`   Medical Posts: ${medicalPosts.length}`);
    console.log(`   Volunteers: ${volunteers.length}`);
    console.log(`   Hotels: ${hotels.length}`);
    console.log(`   Found Cases: ${foundCases.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
