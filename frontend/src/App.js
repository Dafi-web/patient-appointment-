import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import HomePage from './components/HomePage';
import PatientList from './components/PatientList';
import DoctorList from './components/DoctorList';
import DoctorProfile from './components/DoctorProfile';
import AppointmentList from './components/AppointmentList';
import PatientForm from './components/PatientForm';
import DoctorForm from './components/DoctorForm';
import AppointmentForm from './components/AppointmentForm';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import AdminDoctorManagement from './components/AdminDoctorManagement';
import NotificationBell from './components/NotificationBell';

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isAdmin, user, logout, loading } = useAuth();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const isHome = location.pathname === '/' && !isAuthenticated;

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#667eea'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-title">{t('title')}</Link>
            <div className="nav-links">
              {isAuthenticated ? (
                <>
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/appointments" className="nav-link">{t('appointments')}</Link>
                  <Link to="/doctors" className="nav-link">{t('doctors')}</Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link">Admin Dashboard</Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin/doctors" className="nav-link">Manage Doctors</Link>
                  )}
                  {isAdmin && (
                    <Link to="/patients" className="nav-link">{t('patients')}</Link>
                  )}
                  {isAuthenticated && <NotificationBell />}
                  <span style={{ marginLeft: '1rem', color: '#667eea' }}>
                    {user?.firstName} {user?.lastName} ({user?.role})
                  </span>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={logout}
                    style={{ marginLeft: '1rem' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
                </>
              )}
              <div className="language-selector">
                <button
                  className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
                <button
                  className={`lang-btn ${currentLanguage === 'am' ? 'active' : ''}`}
                  onClick={() => changeLanguage('am')}
                >
                  አማ
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className={`main-content ${isHome ? 'main-content--full' : ''}`}>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/appointments" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/appointments" replace /> : <Register />}
            />
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/new"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/edit/:id"
              element={
                <ProtectedRoute>
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <DoctorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/new"
              element={
                <ProtectedRoute requireAdmin>
                  <DoctorForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/edit/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <DoctorForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors/:id"
              element={
                <ProtectedRoute>
                  <DoctorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients"
              element={
                <ProtectedRoute requireAdmin>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/new"
              element={
                <ProtectedRoute requireAdmin>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/edit/:id"
              element={
                <ProtectedRoute requireAdmin>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDoctorManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
