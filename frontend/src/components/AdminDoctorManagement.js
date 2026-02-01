import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDoctors, deleteDoctor } from '../services/api';
import ProfileIcon from './ProfileIcon';

const AdminDoctorManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
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
        alert('Error deleting doctor');
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
