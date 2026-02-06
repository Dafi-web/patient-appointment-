import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '962794492474534',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'patient-appointments', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    resource_type: 'auto', // Automatically detect image or raw (for PDFs)
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Limit image size
      { quality: 'auto' }, // Auto optimize quality
    ],
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) and PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Helper function to upload file to Cloudinary
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'patient-appointments',
      resource_type: 'auto',
      ...options,
    });
    return result.secure_url; // Returns the secure URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default upload;
export { cloudinary };
