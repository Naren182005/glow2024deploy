
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// More permissive CORS settings
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Key validation middleware for secure routes
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Skip API key validation for development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  // Check if API key is provided and matches
  if (!apiKey || apiKey !== process.env.PRIVATE_API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or missing API key'
    });
  }
  
  next();
};

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/orders', validateApiKey, ordersRoutes); // Apply API key validation to orders

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Glow24 Organics API', 
    status: 'Server is running correctly',
    env: {
      mongodb: process.env.MONGODB_URI ? 'Configured' : 'Not configured',
      apiKey: process.env.PRIVATE_API_KEY ? 'Configured' : 'Not configured'
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
