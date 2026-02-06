import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';

// @desc    Create a new appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    // Get patient from authenticated user or from request body
    let patientId = req.body.patient;
    
    // If user is a patient, use their patient profile
    if (req.user && req.user.role === 'patient') {
      const user = await User.findById(req.user._id).populate('patientProfile');
      if (user.patientProfile) {
        patientId = user.patientProfile._id;
      } else {
        // Create patient profile from user if it doesn't exist
        // Ensure address.country is always provided
        const patientAddress = user.address || {};
        if (!patientAddress.country) {
          patientAddress.country = user.address?.country || 'Unknown';
        }
        
        const newPatient = await Patient.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '+0000000000',
          dateOfBirth: user.dateOfBirth || new Date('1990-01-01'),
          gender: user.gender || 'other',
          address: {
            street: patientAddress.street || '',
            city: patientAddress.city || '',
            state: patientAddress.state || '',
            country: patientAddress.country || 'Unknown',
            zipCode: patientAddress.zipCode || '',
          },
          language: user.language || 'en',
          timezone: user.timezone || 'UTC',
        });
        patientId = newPatient._id;
        // Link patient profile to user
        user.patientProfile = newPatient._id;
        await user.save();
      }
    }

    // Check if patient and doctor exist
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(req.body.doctor);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: new Date(req.body.appointmentDate),
      appointmentTime: req.body.appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] },
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is already booked',
      });
    }

    // Handle file upload if present (Cloudinary)
    let documentUrl = '';
    let documentName = '';
    if (req.file) {
      // Cloudinary returns the URL in req.file.path or req.file.url
      documentUrl = req.file.path || req.file.url || req.file.secure_url;
      documentName = req.file.originalname || req.file.filename || '';
    } else if (req.body.documentUrl) {
      documentUrl = req.body.documentUrl;
      documentName = req.body.documentName || '';
    }

    const appointment = await Appointment.create({
      ...req.body,
      patient: patientId,
      status: 'pending', // New appointments start as pending
      documentUrl,
      documentName,
    });
    await appointment.populate('patient doctor');
    
    // Send notification to admin
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      await createNotification(
        admin._id,
        'New Appointment Request',
        `New appointment request from ${appointment.patient.firstName} ${appointment.patient.lastName} with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}`,
        'appointment',
        appointment._id
      );
    }

    // Send notification to patient if user exists
    const patientUser = await User.findOne({ patientProfile: appointment.patient._id });
    if (patientUser) {
      await createNotification(
        patientUser._id,
        'Appointment Request Submitted',
        `Your appointment request with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been submitted and is pending admin approval.`,
        'appointment',
        appointment._id
      );
    }
    
    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // If user is admin, show all appointments
    if (req.user.role === 'admin') {
      // Admins can see all appointments
      query = {};
    } else if (req.user.role === 'patient') {
      // Patients can only see their own appointments
      const user = await User.findById(req.user._id).populate('patientProfile');
      if (user.patientProfile) {
        query = { patient: user.patientProfile._id };
      } else {
        // If no patient profile exists, return empty
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
    } else if (req.user.role === 'doctor') {
      // Doctors can only see their own appointments
      const user = await User.findById(req.user._id).populate('doctorProfile');
      if (user.doctorProfile) {
        query = { doctor: user.doctorProfile._id };
      } else {
        // If no doctor profile exists, return empty
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
    } else {
      // Unknown role, return empty
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization department')
      .sort({ appointmentDate: -1, appointmentTime: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// Note: Admins cannot use this route - they must use approve/reject instead
export const updateAppointment = async (req, res) => {
  try {
    // Check if user is admin - admins should use approve/reject endpoints
    if (req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admins cannot edit appointments. Use /appointments/:id/approve or /appointments/:id/reject instead.',
      });
    }

    // Only allow editing if appointment is pending
    const existingAppointment = await Appointment.findById(req.params.id);
    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    if (existingAppointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending appointments can be edited. Current status: ' + existingAppointment.status,
      });
    }

    // Handle file upload if present (Cloudinary)
    const updateData = { ...req.body };
    if (req.file) {
      // Cloudinary returns the URL in req.file.path or req.file.url
      updateData.documentUrl = req.file.path || req.file.url || req.file.secure_url;
      updateData.documentName = req.file.originalname || req.file.filename || '';
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('patient doctor');
    
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get appointments by patient
// @route   GET /api/appointments/patient/:patientId
export const getAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('doctor', 'firstName lastName specialization department')
      .sort({ appointmentDate: -1, appointmentTime: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get appointments by doctor
// @route   GET /api/appointments/doctor/:doctorId
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient', 'firstName lastName email phone')
      .sort({ appointmentDate: -1, appointmentTime: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get available time slots
// @route   POST /api/appointments/available-slots
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Get doctor's availability for this day
    let dayAvailability = doctor.availability?.[dayName] || [];
    
    // If no availability set, use default (9 AM - 5 PM)
    if (dayAvailability.length === 0) {
      dayAvailability = [{ start: '09:00', end: '17:00' }];
    }

    // Get all appointments for the doctor on the given date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ['scheduled', 'confirmed', 'approved', 'pending'] },
    });

    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

    // Generate available slots based on doctor's availability
    const availableSlots = [];
    
    dayAvailability.forEach(slot => {
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        if (!bookedTimes.includes(timeString)) {
          availableSlots.push(timeString);
        }
        
        currentMin += 30;
        if (currentMin >= 60) {
          currentMin = 0;
          currentHour += 1;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get available dates for a doctor
// @route   GET /api/appointments/available-dates/:doctorId
export const getAvailableDates = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found',
      });
    }

    // Get available days from doctor's schedule
    const availableDays = [];
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    dayNames.forEach((dayName, index) => {
      const dayAvailability = doctor.availability?.[dayName] || [];
      // If no availability set, assume available Monday-Friday by default
      if (dayAvailability.length > 0 || (index >= 1 && index <= 5)) {
        availableDays.push(index);
      }
    });
    
    // If no days are available, default to Monday-Friday
    if (availableDays.length === 0) {
      availableDays.push(1, 2, 3, 4, 5); // Monday to Friday
    }

    // Generate available dates for the next 30 days
    const availableDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayOfWeek = checkDate.getDay();
      
      if (availableDays.includes(dayOfWeek)) {
        availableDates.push(checkDate.toISOString().split('T')[0]);
      }
    }

    res.status(200).json({
      success: true,
      data: availableDates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Approve appointment (Admin only)
// @route   PUT /api/appointments/:id/approve
export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    appointment.status = 'approved';
    appointment.adminAction = {
      action: 'approved',
      actionBy: req.user._id,
      actionAt: new Date(),
      adminNotes: req.body.adminNotes || '',
    };
    await appointment.save();

    // Send notification to patient
    const patientUser = await User.findOne({ patientProfile: appointment.patient._id });
    if (patientUser) {
      await createNotification(
        patientUser._id,
        'Appointment Approved',
        `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been approved.`,
        'approval',
        appointment._id
      );
    }

    // Send notification to doctor if user exists
    const doctorUser = await User.findOne({ doctorProfile: appointment.doctor._id });
    if (doctorUser) {
      await createNotification(
        doctorUser._id,
        'New Appointment Approved',
        `You have a new appointment with ${appointment.patient.firstName} ${appointment.patient.lastName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}.`,
        'appointment',
        appointment._id
      );
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Reject appointment (Admin only)
// @route   PUT /api/appointments/:id/reject
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    appointment.status = 'rejected';
    appointment.adminAction = {
      action: 'rejected',
      actionBy: req.user._id,
      actionAt: new Date(),
      adminNotes: req.body.adminNotes || req.body.reason || '',
    };
    await appointment.save();

    // Send notification to patient
    const patientUser = await User.findOne({ patientProfile: appointment.patient._id });
    if (patientUser) {
      await createNotification(
        patientUser._id,
        'Appointment Rejected',
        `Your appointment request with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been rejected.${req.body.adminNotes ? ` Reason: ${req.body.adminNotes}` : ''}`,
        'approval',
        appointment._id
      );
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get pending appointments (Admin)
// @route   GET /api/appointments/pending
export const getPendingAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'pending' })
      .populate('patient', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
