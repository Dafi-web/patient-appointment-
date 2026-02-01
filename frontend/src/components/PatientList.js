import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPatients, deletePatient } from '../services/api';
import ProfileIcon from './ProfileIcon';

const PatientList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPatients();
      setPatients(response.data.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient');
      }
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{t('patients')}</h2>
        <Link to="/patients/new" className="btn btn-primary">
          {t('newPatient')}
        </Link>
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

      {filteredPatients.length === 0 ? (
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
                <th>{t('country')}</th>
                <th>{t('language')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td>
                    <ProfileIcon
                      firstName={patient.firstName}
                      lastName={patient.lastName}
                      email={patient.email}
                      size={40}
                    />
                  </td>
                  <td>{patient.firstName}</td>
                  <td>{patient.lastName}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.address?.country || '-'}</td>
                  <td>{patient.language?.toUpperCase()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                      >
                        {t('edit')}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(patient._id)}
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

export default PatientList;
