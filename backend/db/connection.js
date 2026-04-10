const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip MongoDB connection if URI is not configured
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb+srv://...') {
    console.log('⚠️  MongoDB URI not configured. Skipping database connection.');
    console.log('   Server will run without database for testing.');
    return;
  }

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
        console.error('⚠️  Max retries reached. Server will run without database.');
        return; // Don't exit, just continue without DB
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000)));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

module.exports = connectDB;
