import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required'],
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required'],
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
  },
  duration: {
    type: Number,
    default: 30, // minutes
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },
  adminAction: {
    action: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actionAt: {
      type: Date,
    },
    adminNotes: {
      type: String,
    },
  },
  appointmentType: {
    type: String,
    enum: ['consultation', 'follow-up', 'checkup', 'emergency', 'surgery'],
    default: 'consultation',
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
  },
  notes: {
    type: String,
    default: '',
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  documentUrl: {
    type: String,
    default: '',
  },
  documentName: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for efficient queries
appointmentSchema.index({ appointmentDate: 1, doctor: 1 });
appointmentSchema.index({ patient: 1 });

export default mongoose.model('Appointment', appointmentSchema);
