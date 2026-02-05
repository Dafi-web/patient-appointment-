import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDoctorById, createDoctor, updateDoctor } from '../services/api';

const DoctorForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    languages: [],
    timezone: 'UTC',
  });

  useEffect(() => {
    if (isEdit) {
      fetchDoctor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await getDoctorById(id);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLanguageToggle = (lang) => {
    setFormData({
      ...formData,
      languages: formData.languages.includes(lang)
        ? formData.languages.filter(l => l !== lang)
        : [...formData.languages, lang],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateDoctor(id, formData);
      } else {
        await createDoctor(formData);
      }
      navigate('/doctors');
    } catch (error) {
      console.error('Error saving doctor:', error);
      alert('Error saving doctor: ' + (error.response?.data?.error || error.message));
    }
  };

  const languages = ['en', 'am'];
  const languageNames = {
    en: 'English',
    am: 'አማርኛ (Amharic)',
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{isEdit ? t('edit') : t('newDoctor')}</h2>
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
            <label className="form-label">{t('specialization')}</label>
            <input
              type="text"
              name="specialization"
              className="form-input"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('department')}</label>
            <input
              type="text"
              name="department"
              className="form-input"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{t('language')}s</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`btn btn-sm ${formData.languages.includes(lang) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleLanguageToggle(lang)}
              >
                {languageNames[lang]}
              </button>
            ))}
          </div>
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

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {t('save')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/doctors')}
            style={{ marginLeft: '1rem' }}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
