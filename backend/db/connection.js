const mongoose = require('mongoose');

const connectDB = async () => {
  // Try native MongoDB first
  if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb+srv://...') {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
        return;
      } catch (error) {
        retries++;
        console.error(`MongoDB connection error (attempt ${retries}/${maxRetries}):`, error.message);
        
        if (retries === maxRetries) {
          console.error('⚠️  Max retries reached.');
          break;
        }
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000)));
      }
    }
  }

  // Fallback to in-memory database
  console.log('⚠️  Valid MongoDB URI not found or connection failed.');
  console.log('🚀 Setting up a local, in-memory MongoDB instance for development (0 setup required)...');
  
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB connected successfully at ${uri}`);
    
    // Automatically seed the database
    console.log('🌱 Seeding the in-memory database with Kumbh Mela data...');
    const { seed } = require('./seed');
    await seed();
    console.log('✅ In-Memory Database is fully populated and ready for queries!');
  } catch (err) {
    console.error('❌ Failed to start in-memory MongoDB. Please check if mongodb-memory-server is installed properly:', err);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

module.exports = connectDB;
