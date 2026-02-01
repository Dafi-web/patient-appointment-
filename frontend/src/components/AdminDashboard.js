import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import ProfileIcon from './ProfileIcon';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState({});
  const [viewingDocument, setViewingDocument] = useState(null);

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const response = await api.get('/appointments/pending');
      setPendingAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching pending appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/approve`, {
        adminNotes: adminNotes[appointmentId] || '',
      });
      fetchPendingAppointments();
      alert('Appointment approved successfully!');
    } catch (error) {
      console.error('Error approving appointment:', error);
      alert('Error approving appointment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleReject = async (appointmentId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return;

    try {
      await api.put(`/appointments/${appointmentId}/reject`, {
        adminNotes: reason,
      });
      fetchPendingAppointments();
      alert('Appointment rejected successfully!');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('Error rejecting appointment: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">
          <h2 className="card-title">Admin Dashboard</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin" className="btn btn-primary">
            Pending Appointments
          </Link>
          <Link to="/admin/doctors" className="btn btn-secondary">
            Manage Doctors
          </Link>
          <Link to="/patients" className="btn btn-secondary">
            Manage Patients
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Pending Appointments</h2>
        </div>

      {pendingAppointments.length === 0 ? (
        <div className="empty-state">
          <h3>No pending appointments</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>ID Card</th>
                <th>Admin Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ProfileIcon
                        firstName={appointment.patient?.firstName}
                        lastName={appointment.patient?.lastName}
                        email={appointment.patient?.email}
                        size={40}
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
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ProfileIcon
                        firstName={appointment.doctor?.firstName}
                        lastName={appointment.doctor?.lastName}
                        email={appointment.doctor?.email}
                        size={40}
                      />
                      <div>
                        {appointment.doctor
                          ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                          : 'N/A'}
                        <br />
                        <small>{appointment.doctor?.specialization}</small>
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
                    {appointment.documentUrl ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setViewingDocument({
                          url: appointment.documentUrl,
                          name: appointment.documentName || 'ID Card',
                          patient: appointment.patient
                        })}
                        style={{ fontSize: '0.875rem' }}
                      >
                        📄 View ID Card
                      </button>
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.875rem' }}>No ID uploaded</span>
                    )}
                  </td>
                  <td>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: '60px', width: '200px' }}
                      placeholder="Admin notes (optional)"
                      value={adminNotes[appointment._id] || ''}
                      onChange={(e) =>
                        setAdminNotes({
                          ...adminNotes,
                          [appointment._id]: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleApprove(appointment._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(appointment._id)}
                      >
                        Reject
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

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setViewingDocument(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '90%',
              maxHeight: '90%',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>
                ID Card - {viewingDocument.patient
                  ? `${viewingDocument.patient.firstName} ${viewingDocument.patient.lastName}`
                  : 'Patient'}
              </h3>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setViewingDocument(null)}
                style={{ fontSize: '1.5rem', lineHeight: 1, padding: '0.25rem 0.5rem' }}
              >
                ×
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              {viewingDocument.url.endsWith('.pdf') ? (
                <iframe
                  src={`http://localhost:5001${viewingDocument.url}`}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  title="ID Card PDF"
                />
              ) : (
                <img
                  src={`http://localhost:5001${viewingDocument.url}`}
                  alt={viewingDocument.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '600px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  onError={(e) => {
                    e.target.src = `http://localhost:5001${viewingDocument.url}`;
                    e.target.onerror = null;
                  }}
                />
              )}
              <div style={{ marginTop: '1rem' }}>
                <a
                  href={`http://localhost:5001${viewingDocument.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
