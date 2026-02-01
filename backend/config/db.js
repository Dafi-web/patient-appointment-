import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected - attempting to reconnect...');
      isConnected = false;
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('SSL/TLS Error detected. This might be a network or certificate issue.');
      console.error('Please check:');
      console.error('1. Your internet connection');
      console.error('2. MongoDB Atlas cluster status');
      console.error('3. IP whitelist settings in MongoDB Atlas');
    }
    isConnected = false;
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};

export { isConnected };
export default connectDB;
