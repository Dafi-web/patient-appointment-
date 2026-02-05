import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDoctorById } from '../services/api';

const DoctorProfile = () => {
  useTranslation(); // i18n ready
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await getDoctorById(id);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card">Loading doctor profile...</div>;
  }

  if (error || !doctor) {
    return (
      <div className="card">
        <div className="empty-state">
          <h3>{error || 'Doctor not found'}</h3>
          <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Doctors List
          </Link>
        </div>
      </div>
    );
  }

  const languageNames = {
    en: 'English',
    am: 'አማርኛ (Amharic)',
  };

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">
          <h2 className="card-title">Doctor Profile</h2>
          <Link to="/doctors" className="btn btn-secondary">
            Back to Doctors List
          </Link>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Doctor Photo/Icon */}
          <div style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {doctor.firstName[0]}{doctor.lastName[0]}
          </div>

          {/* Doctor Info */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ marginBottom: '0.5rem', color: '#333' }}>
              Dr. {doctor.firstName} {doctor.lastName}
            </h1>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                padding: '0.5rem 1rem', 
                background: '#667eea', 
                color: 'white', 
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {doctor.specialization}
              </span>
            </div>
            <div style={{ color: '#666', marginBottom: '0.5rem' }}>
              <strong>Department:</strong> {doctor.department}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Contact Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
              {doctor.email}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <div style={{ padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px' }}>
              {doctor.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Languages */}
      {doctor.languages && doctor.languages.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Languages Spoken</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {doctor.languages.map((lang) => (
              <span
                key={lang}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#e9ecef',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                }}
              >
                {languageNames[lang] || lang.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {doctor.availability && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Availability</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(doctor.availability).map(([day, slots]) => {
              if (!slots || slots.length === 0) return null;
              return (
                <div
                  key={day}
                  style={{
                    padding: '1rem',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ fontWeight: '600', minWidth: '120px' }}>
                    {dayNames[day] || day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {slots.map((slot, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#d4edda',
                          color: '#155724',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {slot.start} - {slot.end}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {Object.values(doctor.availability).every(slots => !slots || slots.length === 0) && (
            <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>
              Availability schedule not set. Please contact the clinic for appointment times.
            </div>
          )}
        </div>
      )}

      {/* Timezone */}
      {doctor.timezone && (
        <div className="card">
          <div style={{ color: '#666' }}>
            <strong>Timezone:</strong> {doctor.timezone}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/appointments/new" className="btn btn-primary">
            Book Appointment with Dr. {doctor.firstName} {doctor.lastName}
          </Link>
          <Link to="/doctors" className="btn btn-secondary">
            View All Doctors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
