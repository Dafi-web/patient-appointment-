import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getAppointmentById, createAppointment, updateAppointment, getAvailableSlots, getAvailableDates } from '../services/api';
import { getDoctors } from '../services/api';

const AppointmentForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { id } = useParams();
  const isEdit = !!id;

  // Prevent admins from editing appointments
  useEffect(() => {
    if (isEdit && isAdmin) {
      navigate('/admin');
    }
  }, [isEdit, isAdmin, navigate]);

  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: 30,
    appointmentType: 'consultation',
    reason: '',
    notes: '',
    timezone: 'UTC',
  });

  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDoctors();
    if (isEdit) {
      fetchAppointment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (formData.doctor) {
      fetchAvailableDates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctor]);

  useEffect(() => {
    if (formData.doctor && formData.appointmentDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctor, formData.appointmentDate]);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data.data || []);
      console.log('Doctors loaded:', response.data.data?.length || 0);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const fetchAppointment = async () => {
    try {
      const response = await getAppointmentById(id);
      const appointment = response.data.data;
      setFormData({
        doctor: appointment.doctor._id || appointment.doctor,
        appointmentDate: appointment.appointmentDate
          ? new Date(appointment.appointmentDate).toISOString().split('T')[0]
          : '',
        appointmentTime: appointment.appointmentTime || '',
        duration: appointment.duration || 30,
        appointmentType: appointment.appointmentType || 'consultation',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        timezone: appointment.timezone || 'UTC',
      });
      if (appointment.documentUrl) {
        setFilePreview(appointment.documentUrl);
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
    }
  };

  const fetchAvailableDates = async () => {
    if (!formData.doctor) {
      setAvailableDates([]);
      return;
    }
    
    try {
      const response = await getAvailableDates(formData.doctor);
      setAvailableDates(response.data.data || []);
      console.log('Available dates:', response.data.data);
    } catch (error) {
      console.error('Error fetching available dates:', error);
      setAvailableDates([]);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!formData.doctor || !formData.appointmentDate) return;
    
    setLoading(true);
    try {
      const response = await getAvailableSlots(formData.doctor, formData.appointmentDate);
      setAvailableSlots(response.data.data || []);
      if (response.data.data && response.data.data.length === 0) {
        setErrors(prev => ({ ...prev, appointmentDate: 'No available time slots for this date' }));
      } else {
        setErrors(prev => ({ ...prev, appointmentDate: '' }));
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
      setErrors(prev => ({ ...prev, appointmentDate: 'Error loading available slots' }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when user changes input
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Please upload an image (JPEG, PNG, GIF) or PDF file' }));
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 5MB' }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.doctor) {
      setErrors(prev => ({ ...prev, doctor: 'Please select a doctor' }));
      return;
    }
    if (!formData.appointmentDate) {
      setErrors(prev => ({ ...prev, appointmentDate: 'Please select a date' }));
      return;
    }
    if (!formData.appointmentTime) {
      setErrors(prev => ({ ...prev, appointmentTime: 'Please select a time' }));
      return;
    }
    if (!formData.reason.trim()) {
      setErrors(prev => ({ ...prev, reason: 'Please provide a reason for the appointment' }));
      return;
    }

    try {
      const appointmentData = {
        ...formData,
        patient: user?.patientProfile || user?._id, // Use authenticated user's patient profile
      };

      // Handle file upload if file is selected
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('document', selectedFile);
        Object.keys(appointmentData).forEach(key => {
          if (appointmentData[key] !== null && appointmentData[key] !== undefined) {
            formDataToSend.append(key, appointmentData[key]);
          }
        });

        // Send FormData when file is present
        if (isEdit) {
          await updateAppointment(id, formDataToSend);
        } else {
          await createAppointment(formDataToSend);
        }
      } else {
        // Send JSON when no file
        if (isEdit) {
          await updateAppointment(id, appointmentData);
        } else {
          await createAppointment(appointmentData);
        }
      }
      navigate('/appointments');
    } catch (error) {
      console.error('Error saving appointment:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error saving appointment';
      alert(errorMessage);
    }
  };

  const selectedDoctor = doctors.find(d => d._id === formData.doctor);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{isEdit ? t('edit') : t('newAppointment')}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Doctor Selection */}
        <div className="form-group">
          <label className="form-label">Select Doctor *</label>
          {doctors.length === 0 ? (
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', color: '#856404' }}>
              Loading doctors... If this persists, please create doctors first.
            </div>
          ) : (
            <>
              <select
                name="doctor"
                className={`form-select ${errors.doctor ? 'error' : ''}`}
                value={formData.doctor}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  fontSize: '1rem',
                  border: errors.doctor ? '2px solid #dc3545' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization} ({doctor.department})
                  </option>
                ))}
              </select>
              {errors.doctor && <span className="error-message">{errors.doctor}</span>}
              {formData.doctor && (
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#28a745' }}>
                  ✓ Doctor selected: {doctors.find(d => d._id === formData.doctor)?.firstName} {doctors.find(d => d._id === formData.doctor)?.lastName}
                </small>
              )}
            </>
          )}
        </div>

        {/* Appointment Type */}
        <div className="form-group">
          <label className="form-label">Appointment Type *</label>
          <select
            name="appointmentType"
            className="form-select"
            value={formData.appointmentType}
            onChange={handleChange}
            required
          >
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="checkup">Checkup</option>
            <option value="emergency">Emergency</option>
            <option value="surgery">Surgery</option>
          </select>
        </div>

        {/* Date Selection - Only show available dates */}
        <div className="form-group">
          <label className="form-label">{t('appointmentDate')} *</label>
          {formData.doctor ? (
            <>
              <input
                type="date"
                name="appointmentDate"
                className={`form-input ${errors.appointmentDate ? 'error' : ''}`}
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                max={availableDates.length > 0 ? availableDates[availableDates.length - 1] : ''}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  fontSize: '1rem',
                  border: errors.appointmentDate ? '2px solid #dc3545' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
              />
              {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
              {formData.appointmentDate && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.5rem', 
                  background: '#d4edda', 
                  borderRadius: '4px',
                  color: '#155724',
                  fontSize: '0.875rem'
                }}>
                  ✓ Selected date: {new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
              {availableDates.length > 0 && (
                <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                  Available dates for {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                </small>
              )}
            </>
          ) : (
            <input
              type="date"
              className="form-input"
              disabled
              placeholder="Please select a doctor first"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                fontSize: '1rem',
                backgroundColor: '#e9ecef',
                cursor: 'not-allowed',
                color: '#6c757d'
              }}
            />
          )}
        </div>

        {/* Time Selection - Only show available slots */}
        <div className="form-group">
          <label className="form-label">{t('appointmentTime')} *</label>
          {loading ? (
            <div style={{ padding: '1rem', background: '#d1ecf1', borderRadius: '8px', color: '#0c5460' }}>
              ⏳ Loading available time slots...
            </div>
          ) : formData.appointmentDate && availableSlots.length > 0 ? (
            <>
              <select
                name="appointmentTime"
                className={`form-select ${errors.appointmentTime ? 'error' : ''}`}
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  fontSize: '1rem',
                  border: errors.appointmentTime ? '2px solid #dc3545' : '2px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                <option value="">-- Select Time --</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
              {formData.appointmentTime && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.5rem', 
                  background: '#d4edda', 
                  borderRadius: '4px',
                  color: '#155724',
                  fontSize: '0.875rem'
                }}>
                  ✓ Selected time: {formData.appointmentTime}
                </div>
              )}
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                {availableSlots.length} time slot(s) available
              </small>
            </>
          ) : formData.appointmentDate ? (
            <div style={{ 
              padding: '1rem', 
              background: '#f8d7da', 
              borderRadius: '8px', 
              color: '#721c24',
              border: '1px solid #f5c6cb'
            }}>
              ⚠️ No available time slots for this date. Please select another date.
            </div>
          ) : (
            <input
              type="text"
              className="form-input"
              disabled
              placeholder="Please select a date first"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                fontSize: '1rem',
                backgroundColor: '#e9ecef',
                cursor: 'not-allowed',
                color: '#6c757d'
              }}
            />
          )}
        </div>

        {/* Duration */}
        <div className="form-group">
          <label className="form-label">Duration (minutes)</label>
          <select
            name="duration"
            className="form-select"
            value={formData.duration}
            onChange={handleChange}
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        {/* Reason */}
        <div className="form-group">
          <label className="form-label">{t('reason')} *</label>
          <textarea
            name="reason"
            className={`form-textarea ${errors.reason ? 'error' : ''}`}
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="Please describe the reason for this appointment"
            rows="4"
          />
          {errors.reason && <span className="error-message">{errors.reason}</span>}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Additional Notes</label>
          <textarea
            name="notes"
            className="form-textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information (optional)"
            rows="3"
          />
        </div>

        {/* ID/Document Upload */}
        <div className="form-group">
          <label className="form-label">Upload ID/Document (Optional)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="form-input"
            style={{ padding: '0.5rem' }}
          />
          {errors.file && <span className="error-message">{errors.file}</span>}
          {filePreview && (
            <div style={{ marginTop: '1rem' }}>
              {selectedFile?.type?.startsWith('image/') ? (
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              ) : (
                <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
                  📄 {selectedFile?.name || 'Document uploaded'}
                </div>
              )}
            </div>
          )}
          <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
            Accepted formats: JPEG, PNG, GIF, PDF (Max 5MB)
          </small>
        </div>

        {/* Status Display (for viewing existing appointments) */}
        {isEdit && formData.status && (
          <div className="form-group">
            <label className="form-label">Current Status</label>
            <div style={{ 
              padding: '1rem', 
              background: formData.status === 'approved' ? '#d4edda' : 
                         formData.status === 'rejected' ? '#f8d7da' : 
                         formData.status === 'pending' ? '#fff3cd' : '#d1ecf1',
              borderRadius: '8px',
              fontWeight: '600',
              color: formData.status === 'approved' ? '#155724' : 
                     formData.status === 'rejected' ? '#721c24' : 
                     formData.status === 'pending' ? '#856404' : '#0c5460'
            }}>
              {formData.status === 'pending' && '⏳ Pending Admin Approval'}
              {formData.status === 'approved' && '✅ Approved - Appointment Confirmed'}
              {formData.status === 'rejected' && '❌ Rejected'}
              {formData.status === 'confirmed' && '✓ Confirmed'}
              {formData.status === 'completed' && '✓ Completed'}
              {formData.status === 'cancelled' && '✗ Cancelled'}
            </div>
          </div>
        )}

        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? t('save') : 'Book Appointment')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/appointments')}
            style={{ marginLeft: '1rem' }}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
