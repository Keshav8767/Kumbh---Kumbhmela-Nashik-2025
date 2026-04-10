require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./db/connection');
const { handleMessage } = require('./agents/orchestrator');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle user messages with AI agents
  socket.on('user-message', async (data) => {
    console.log('Received message:', data.message);
    console.log('User location:', data.userLocation);
    console.log('User language:', data.userLanguage);
    
    try {
      const result = await handleMessage(data.message, data.userLocation, data.userLanguage);
      console.log('Sending reply:', result.agent, '-', result.reply?.substring(0, 50));
      socket.emit('agent-reply', result);
    } catch (error) {
      console.error('Error handling message:', error);
      console.error('Error stack:', error.stack);
      socket.emit('agent-reply', {
        agent: 'System',
        reply: 'Sorry, I encountered an error. Please try again.',
        data: null
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Mount API routes
app.use('/api', require('./routes/pilgrim'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Async startup — await DB before listening
(async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
