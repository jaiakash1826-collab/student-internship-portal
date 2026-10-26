require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Configure allowed CORS origins
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://internship-portal-khaki.vercel.app',
];

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    const normalized = origin.trim().replace(/\/+$/, '');
    if (allowedOrigins.includes(normalized) || normalized.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy: Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Root service-status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Student Internship Portal API',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Database health check endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    return res.status(200).json({
      status: 'OK',
      database: 'connected',
      message: 'Service is operational and database connection is established.',
    });
  }
  return res.status(503).json({
    status: 'Service Unavailable',
    database: 'disconnected',
    message: 'Database connection is not ready.',
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// JSON 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Central error handling middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Access denied by CORS policy',
    });
  }

  // Prevent leaking internal stack traces or secrets to clients
  return res.status(err.status || 500).json({
    error: 'An internal server error occurred. Please try again later.',
  });
});

// Startup function to ensure MongoDB connects before listening
async function startServer() {
  const mongoUri = process.env.MONGO_DB_URI;

  if (!mongoUri || typeof mongoUri !== 'string' || !mongoUri.trim()) {
    console.error('Fatal configuration error: MONGO_DB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri.trim(), {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connection successfully established.');

    return new Promise((resolve) => {
      const server = app.listen(PORT, HOST, () => {
        console.log(`Student Internship Portal API server listening on http://${HOST}:${PORT}`);
        resolve(server);
      });
    });
  } catch (error) {
    console.error('Fatal database error: Failed to connect to MongoDB within timeout.');
    process.exit(1);
  }
}

// Only start the server when executed directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
