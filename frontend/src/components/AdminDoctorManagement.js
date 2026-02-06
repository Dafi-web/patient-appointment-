import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDoctors, deleteDoctor } from '../services/api';
import { SPECIALIZATIONS, DEPARTMENTS } from '../constants/doctorOptions';
import ProfileIcon from './ProfileIcon';

const AdminDoctorManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await getDoctors();
      const list = response?.data?.data ?? response?.data;
      setDoctors(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert(error.response?.data?.error || 'Error deleting doctor');
      }
    }
  };

  const safeStr = (v) => (v != null ? String(v) : '');
  const filteredDoctors = doctors.filter((doctor) => {
    if (filterSpecialization && (doctor.specialization || '') !== filterSpecialization) return false;
    if (filterDepartment && (doctor.department || '') !== filterDepartment) return false;
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    const name = `${safeStr(doctor.firstName)} ${safeStr(doctor.lastName)}`.toLowerCase();
    const spec = (doctor.specialization || '').toLowerCase();
    return name.includes(term) || spec.includes(term);
  });

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Doctor Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/doctors/new')}
        >
          Add New Doctor
        </button>
      </div>

      <div className="filters-row">
        <div className="search-bar" style={{ flex: 1, maxWidth: '320px' }}>
          <input
            type="text"
            className="search-input"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select filter-select"
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value)}
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
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="empty-state">
          <h3>{t('noData')}</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>{t('firstName')}</th>
                <th>{t('lastName')}</th>
                <th>{t('email')}</th>
                <th>{t('phone')}</th>
                <th>{t('specialization')}</th>
                <th>{t('department')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>
                    <ProfileIcon
                      firstName={doctor.firstName}
                      lastName={doctor.lastName}
                      email={doctor.email}
                      size={40}
                    />
                  </td>
                  <td>{doctor.firstName}</td>
                  <td>{doctor.lastName}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.department}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => navigate(`/doctors/edit/${doctor._id}`)}
                      >
                        {t('edit')}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(doctor._id)}
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorManagement;
