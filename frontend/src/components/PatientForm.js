import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPatientById, createPatient, updatePatient } from '../services/api';

const PatientForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    language: 'en',
    timezone: 'UTC',
    medicalHistory: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  const fetchPatient = useCallback(async () => {
    try {
      const response = await getPatientById(id);
      const patient = response.data.data;
      setFormData({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchPatient();
    }
  }, [id, isEdit, fetchPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updatePatient(id, formData);
      } else {
        await createPatient(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Error saving patient: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{isEdit ? t('edit') : t('newPatient')}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('firstName')}</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('lastName')}</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('phone')}</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('dateOfBirth')}</label>
            <input
              type="date"
              name="dateOfBirth"
              className="form-input"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('gender')}</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Street</label>
          <input
            type="text"
            name="address.street"
            className="form-input"
            value={formData.address.street}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">City</label>
            <input
              type="text"
              name="address.city"
              className="form-input"
              value={formData.address.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input
              type="text"
              name="address.state"
              className="form-input"
              value={formData.address.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('country')}</label>
            <input
              type="text"
              name="address.country"
              className="form-input"
              value={formData.address.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Zip Code</label>
            <input
              type="text"
              name="address.zipCode"
              className="form-input"
              value={formData.address.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('language')}</label>
            <select
              name="language"
              className="form-select"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="am">አማርኛ (Amharic)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Timezone</label>
            <input
              type="text"
              name="timezone"
              className="form-input"
              value={formData.timezone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Medical History</label>
          <textarea
            name="medicalHistory"
            className="form-textarea"
            value={formData.medicalHistory}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContact.name"
            className="form-input"
            value={formData.emergencyContact.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Emergency Contact Phone</label>
            <input
              type="tel"
              name="emergencyContact.phone"
              className="form-input"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Relationship</label>
            <input
              type="text"
              name="emergencyContact.relationship"
              className="form-input"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {t('save')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ marginLeft: '1rem' }}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
