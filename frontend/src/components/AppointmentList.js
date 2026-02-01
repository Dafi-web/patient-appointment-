import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { getAppointments, deleteAppointment } from '../services/api';
import ProfileIcon from './ProfileIcon';

const AppointmentList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAdmin, isPatient } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments();
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      rejected: 'badge-rejected',
      scheduled: 'badge-scheduled',
      confirmed: 'badge-confirmed',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    return statusMap[status] || 'badge-scheduled';
  };

  const filteredAppointments = appointments.filter(appointment => {
    const patientName = appointment.patient
      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
      : '';
    const doctorName = appointment.doctor
      ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      : '';
    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          {isAdmin ? 'All Appointments' : 'My Appointments'}
        </h2>
        {!isAdmin && (
          <Link to="/appointments/new" className="btn btn-primary">
            {t('newAppointment')}
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="btn btn-primary">
            Admin Dashboard
          </Link>
        )}
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

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <h3>{t('noData')}</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {isAdmin && <th>Patient</th>}
                {isAdmin && <th>Doctor</th>}
                {!isAdmin && <th>Doctor</th>}
                <th>{t('appointmentDate')}</th>
                <th>{t('appointmentTime')}</th>
                <th>{t('reason')}</th>
                <th>{t('status')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ProfileIcon
                          firstName={appointment.patient?.firstName}
                          lastName={appointment.patient?.lastName}
                          email={appointment.patient?.email}
                          size={35}
                        />
                        <div>
                          {appointment.patient
                            ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                            : 'N/A'}
                          <br />
                          <small>{appointment.patient?.email}</small>
                        </div>
                      </div>
                    </td>
                  )}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ProfileIcon
                        firstName={appointment.doctor?.firstName}
                        lastName={appointment.doctor?.lastName}
                        email={appointment.doctor?.email}
                        size={35}
                      />
                      <div>
                        {appointment.doctor
                          ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} (${appointment.doctor.specialization})`
                          : 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td>
                    {appointment.appointmentDate
                      ? format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')
                      : 'N/A'}
                  </td>
                  <td>{appointment.appointmentTime || 'N/A'}</td>
                  <td>{appointment.reason || '-'}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status === 'pending' && '⏳ '}
                      {appointment.status === 'approved' && '✅ '}
                      {appointment.status === 'rejected' && '❌ '}
                      {appointment.status === 'confirmed' && '✓ '}
                      {appointment.status === 'completed' && '✓ '}
                      {appointment.status === 'cancelled' && '✗ '}
                      {t(appointment.status)}
                    </span>
                    {appointment.status === 'pending' && (
                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                        Awaiting admin approval
                      </div>
                    )}
                    {appointment.status === 'approved' && (
                      <div style={{ fontSize: '0.75rem', color: '#155724', marginTop: '0.25rem' }}>
                        Your appointment is confirmed
                      </div>
                    )}
                    {appointment.status === 'rejected' && appointment.adminAction?.adminNotes && (
                      <div style={{ fontSize: '0.75rem', color: '#721c24', marginTop: '0.25rem' }}>
                        Reason: {appointment.adminAction.adminNotes}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {/* Admins cannot edit appointments - they can only approve/reject from admin dashboard */}
                      {!isAdmin && (
                        <>
                          {appointment.status === 'pending' && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => navigate(`/appointments/edit/${appointment._id}`)}
                            >
                              {t('edit')}
                            </button>
                          )}
                          {(appointment.status === 'pending' || appointment.status === 'approved') && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(appointment._id)}
                            >
                              {t('delete')}
                            </button>
                          )}
                        </>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="btn btn-sm btn-primary"
                        >
                          Manage in Dashboard
                        </Link>
                      )}
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

export default AppointmentList;
