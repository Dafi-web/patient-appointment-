import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../models/Doctor.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleDoctors = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@hospital.com',
    phone: '+1-555-0101',
    specialization: 'Cardiology',
    department: 'Cardiology',
    languages: ['en', 'es'],
    availability: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1-555-0102',
    specialization: 'Pediatrics',
    department: 'Pediatrics',
    languages: ['en', 'fr'],
    availability: {
      monday: [{ start: '08:00', end: '16:00' }],
      tuesday: [{ start: '08:00', end: '16:00' }],
      wednesday: [{ start: '08:00', end: '16:00' }],
      thursday: [{ start: '08:00', end: '16:00' }],
      friday: [{ start: '08:00', end: '16:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@hospital.com',
    phone: '+1-555-0103',
    specialization: 'Orthopedics',
    department: 'Orthopedics',
    languages: ['en'],
    availability: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@hospital.com',
    phone: '+1-555-0104',
    specialization: 'Dermatology',
    department: 'Dermatology',
    languages: ['en', 'es', 'fr'],
    availability: {
      monday: [{ start: '09:00', end: '15:00' }],
      tuesday: [{ start: '09:00', end: '15:00' }],
      wednesday: [{ start: '09:00', end: '15:00' }],
      thursday: [{ start: '09:00', end: '15:00' }],
      friday: [{ start: '09:00', end: '15:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@hospital.com',
    phone: '+1-555-0105',
    specialization: 'Neurology',
    department: 'Neurology',
    languages: ['en', 'de'],
    availability: {
      monday: [{ start: '08:00', end: '16:00' }],
      tuesday: [{ start: '08:00', end: '16:00' }],
      wednesday: [{ start: '08:00', end: '16:00' }],
      thursday: [{ start: '08:00', end: '16:00' }],
      friday: [{ start: '08:00', end: '16:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@hospital.com',
    phone: '+1-555-0106',
    specialization: 'Gynecology',
    department: 'Gynecology',
    languages: ['en', 'es'],
    availability: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@hospital.com',
    phone: '+1-555-0107',
    specialization: 'Oncology',
    department: 'Oncology',
    languages: ['en', 'fr'],
    availability: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jennifer.martinez@hospital.com',
    phone: '+1-555-0108',
    specialization: 'Psychiatry',
    department: 'Psychiatry',
    languages: ['en', 'es', 'pt'],
    availability: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'James',
    lastName: 'Garcia',
    email: 'james.garcia@hospital.com',
    phone: '+1-555-0109',
    specialization: 'Emergency Medicine',
    department: 'Emergency',
    languages: ['en', 'es'],
    availability: {
      monday: [{ start: '08:00', end: '20:00' }],
      tuesday: [{ start: '08:00', end: '20:00' }],
      wednesday: [{ start: '08:00', end: '20:00' }],
      thursday: [{ start: '08:00', end: '20:00' }],
      friday: [{ start: '08:00', end: '20:00' }],
      saturday: [{ start: '08:00', end: '20:00' }],
      sunday: [{ start: '08:00', end: '20:00' }],
    },
    timezone: 'UTC',
  },
  {
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@hospital.com',
    phone: '+1-555-0110',
    specialization: 'General Medicine',
    department: 'General Medicine',
    languages: ['en', 'es', 'fr'],
    availability: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
    },
    timezone: 'UTC',
  },
];

const createSampleDoctors = async () => {
  try {
    await connectDB();

    // Clear existing doctors (optional - remove if you want to keep existing)
    // await Doctor.deleteMany({});

    let created = 0;
    let skipped = 0;

    for (const doctorData of sampleDoctors) {
      const existingDoctor = await Doctor.findOne({ email: doctorData.email });
      
      if (existingDoctor) {
        console.log(`Doctor ${doctorData.email} already exists, skipping...`);
        skipped++;
      } else {
        await Doctor.create(doctorData);
        console.log(`Created doctor: Dr. ${doctorData.firstName} ${doctorData.lastName} - ${doctorData.specialization}`);
        created++;
      }
    }

    console.log(`\n✅ Sample doctors creation complete!`);
    console.log(`Created: ${created}`);
    console.log(`Skipped (already exist): ${skipped}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample doctors:', error);
    process.exit(1);
  }
};

createSampleDoctors();
