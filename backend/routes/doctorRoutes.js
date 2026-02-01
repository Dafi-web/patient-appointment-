import express from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All doctor routes require authentication

router.route('/').get(getDoctors).post(authorize('admin'), createDoctor);
router.route('/:id').get(getDoctorById).put(authorize('admin'), updateDoctor).delete(authorize('admin'), deleteDoctor);

export default router;
