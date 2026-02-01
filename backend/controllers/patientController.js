import Patient from '../models/Patient.js';

// @desc    Create a new patient
// @route   POST /api/patients
export const createPatient = async (req, res) => {
  try {
    // Ensure address.country is provided
    if (req.body.address && !req.body.address.country) {
      req.body.address.country = req.body.address.country || 'Unknown';
    } else if (!req.body.address) {
      req.body.address = { country: 'Unknown' };
    }
    
    const patient = await Patient.create(req.body);
    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
    }
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
    }
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
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
