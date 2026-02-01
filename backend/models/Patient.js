import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      required: true,
    },
    zipCode: String,
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'ja'],
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  medicalHistory: {
    type: String,
    default: '',
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Patient', patientSchema);
