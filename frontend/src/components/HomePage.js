import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80')`,
          }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">{t('heroTitle')}</h1>
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-hero">
              {t('bookAppointment')}
            </Link>
            <Link to="/login" className="btn btn-hero-outline">
              {t('patientLogin')}
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section section-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80"
                alt="Healthcare professionals"
                className="about-image"
              />
            </div>
            <div className="about-text">
              <h2 className="section-title">{t('aboutUs')}</h2>
              <p className="section-lead">
                {t('aboutText1')}
              </p>
              <p>
                {t('aboutText2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section section-vision">
        <div className="container">
          <h2 className="section-title section-title-center">{t('visionMission')}</h2>
          <div className="vision-grid">
            <div className="vision-card">
              <div className="vision-icon">👁️</div>
              <h3>{t('vision')}</h3>
              <p>
                {t('visionText')}
              </p>
            </div>
            <div className="vision-card">
              <div className="vision-icon">🎯</div>
              <h3>{t('mission')}</h3>
              <p>
                {t('missionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-why">
        <div className="container">
          <h2 className="section-title section-title-center">{t('whyChooseUs')}</h2>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon">🏥</span>
              <h3>{t('qualityCare')}</h3>
              <p>{t('qualityCareText')}</p>
            </div>
            <div className="why-card">
              <span className="why-icon">👨‍⚕️</span>
              <h3>{t('expertDoctors')}</h3>
              <p>{t('expertDoctorsText')}</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📅</span>
              <h3>{t('easyBooking')}</h3>
              <p>{t('easyBookingText')}</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🌍</span>
              <h3>{t('multilingual')}</h3>
              <p>{t('multilingualText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section section-services">
        <div className="container">
          <h2 className="section-title section-title-center">{t('ourServices')}</h2>
          <div className="services-grid">
            <div className="service-item">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80"
                alt="Consultation"
              />
              <h3>{t('consultations')}</h3>
              <p>{t('consultationsText')}</p>
            </div>
            <div className="service-item">
              <img
                src="https://images.unsplash.com/photo-1631217868269-e6e1b7df5a4d?w=600&q=80"
                alt="Appointments"
              />
              <h3>{t('onlineAppointments')}</h3>
              <p>{t('onlineAppointmentsText')}</p>
            </div>
            <div className="service-item">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"
                alt="Care"
              />
              <h3>{t('continuityOfCare')}</h3>
              <p>{t('continuityOfCareText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-cta">
        <div className="container">
          <div className="cta-box">
            <h2>{t('readyToBook')}</h2>
            <p>{t('readyToBookText')}</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                {t('createAccount')}
              </Link>
              <Link to="/login" className="btn btn-hero-outline btn-lg">
                {t('signIn')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-inner">
            <p className="footer-brand">{t('footerBrand')}</p>
            <p className="footer-copy">© {new Date().getFullYear()} — {t('footerCopy')}</p>
            <div className="footer-links">
              <Link to="/login">{t('patientLogin')}</Link>
              <Link to="/register">{t('createAccount')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
