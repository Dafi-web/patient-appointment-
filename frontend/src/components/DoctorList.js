import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { getDoctors, deleteDoctor } from '../services/api';
import { SPECIALIZATIONS, DEPARTMENTS } from '../constants/doctorOptions';
import ProfileIcon from './ProfileIcon';

const DoctorList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getDoctors();
      const list = response?.data?.data ?? response?.data;
      setDoctors(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load doctors. Please try again.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        fetchDoctors();
      } catch (err) {
        console.error('Error deleting doctor:', err);
        alert(err.response?.data?.error || 'Error deleting doctor');
      }
    }
  };

  const safeStr = (v) => (v != null ? String(v) : '');
  const filteredDoctors = doctors.filter((doctor) => {
    if (filterSpecialization && (doctor.specialization || '') !== filterSpecialization) return false;
    if (filterDepartment && (doctor.department || '') !== filterDepartment) return false;
    const name = `${safeStr(doctor.firstName)} ${safeStr(doctor.lastName)}`.toLowerCase();
    const spec = (doctor.specialization || '').toLowerCase();
    const dept = (doctor.department || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return !term || name.includes(term) || spec.includes(term) || dept.includes(term);
  });

  if (loading) {
    return (
      <div className="card doctors-card">
        <div className="card-header">
          <h2 className="card-title">{t('doctors')}</h2>
        </div>
        <div className="doctors-loading">
          <div className="loading-spinner" />
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card doctors-card">
      <div className="card-header">
        <h2 className="card-title">{t('doctors')}</h2>
        {isAdmin && (
          <Link to="/doctors/new" className="btn btn-primary">
            {t('newDoctor')}
          </Link>
        )}
        {!isAdmin && (
          <span className="card-subtitle">View only — contact admin to add or edit doctors</span>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-primary" onClick={fetchDoctors}>
            Retry
          </button>
        </div>
      )}

      <div className="filters-row">
        <div className="search-bar" style={{ flex: 1, maxWidth: '320px' }}>
          <input
            type="text"
            className="search-input"
            placeholder={t('search') || 'Search by name...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select filter-select"
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value)}
          title="Filter by specialization"
        >
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="form-select filter-select"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          title="Filter by department"
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="empty-state empty-state-nice">
          <div className="empty-state-icon">👨‍⚕️</div>
          <h3>{doctors.length === 0 && !error ? 'No doctors yet' : 'No matching doctors'}</h3>
          <p>
            {doctors.length === 0 && !error
              ? 'Doctors will appear here once an admin adds them.'
              : 'Try a different search term.'}
          </p>
          {isAdmin && doctors.length === 0 && (
            <Link to="/doctors/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {t('newDoctor')}
            </Link>
          )}
        </div>
      ) : (
        <div className="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <div
              className="doctor-card"
              key={doctor._id}
              onClick={() => navigate(`/doctors/${doctor._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/doctors/${doctor._id}`);
                }
              }}
            >
              <div className="doctor-card-avatar">
                <ProfileIcon
                  firstName={doctor.firstName}
                  lastName={doctor.lastName}
                  email={doctor.email}
                  size={64}
                />
              </div>
              <div className="doctor-card-body">
                <h3 className="doctor-card-name">
                  {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="doctor-card-spec">{doctor.specialization || '—'}</p>
                <p className="doctor-card-dept">{doctor.department || '—'}</p>
                {doctor.phone && (
                  <p className="doctor-card-phone">{doctor.phone}</p>
                )}
              </div>
              <div className="doctor-card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate(`/doctors/${doctor._id}`)}
                >
                  View Profile
                </button>
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => navigate(`/doctors/edit/${doctor._id}`)}
                    >
                      {t('edit')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(doctor._id)}
                    >
                      {t('delete')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
