import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAvailableSlots,
  getAvailableDates,
  approveAppointment,
  rejectAppointment,
  getPendingAppointments,
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(protect, getAppointments).post(protect, upload.single('document'), createAppointment);
router.route('/pending').get(protect, authorize('admin'), getPendingAppointments);
router.route('/patient/:patientId').get(protect, getAppointmentsByPatient);
router.route('/doctor/:doctorId').get(protect, getAppointmentsByDoctor);
router.route('/available-slots').post(protect, getAvailableSlots);
router.route('/available-dates/:doctorId').get(protect, getAvailableDates);
router.route('/:id/approve').put(protect, authorize('admin'), approveAppointment);
router.route('/:id/reject').put(protect, authorize('admin'), rejectAppointment);
// Only non-admin users can update appointments (admins use approve/reject instead)
const updateAppointmentMiddleware = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admins cannot edit appointments. Use approve/reject instead.',
    });
  }
  next();
};

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointmentMiddleware, upload.single('document'), updateAppointment)
  .delete(protect, deleteAppointment);

export default router;
