import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

const app = express();

// Connect to MongoDB - wait for connection before starting server
let serverStarted = false;

const ensureDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) return;
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
    });
    console.log('Default admin created: admin@example.com / admin123');
  } catch (err) {
    if (err.code === 11000) return; // already exists (duplicate email)
    console.error('Could not create default admin:', err.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await ensureDefaultAdmin();

    if (!serverStarted) {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        serverStarted = true;
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    // Still start server but log warning
    if (!serverStarted) {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (MongoDB connection pending)`);
        serverStarted = true;
      });
    }
  }
};

startServer();

// Middleware - CORS configuration
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://127.0.0.1:3000',
];

// Add Vercel frontend URL if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and Vercel domains
    if (
      allowedOrigins.includes(origin) ||
      origin.includes('.vercel.app') ||
      origin.includes('vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now - restrict in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', (req, res, next) => {
  const filePath = join(__dirname, 'uploads', req.path);
  
  // Check if file exists before serving
  if (!fs.existsSync(filePath)) {
    console.warn('File not found:', filePath);
    return res.status(404).json({
      success: false,
      error: 'File not found'
    });
  }
  
  // Serve the file
  express.static(join(__dirname, 'uploads'))(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Server is started in startServer() function above
