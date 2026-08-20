import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';

export default function FarmerDashboard() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  return (
    <section className="section">
      <div className="wrap">
        <h2>👋 {profile?.full_name}</h2>
        <div className="hero-actions" style={{ maxWidth: 760 }}>
          <Link to="/workers" className="btn hero-card hc-1"><span className="ic">🌾</span><span className="ttl">{t('card_workers_t')}</span></Link>
          <Link to="/machinery" className="btn hero-card hc-2"><span className="ic">🚜</span><span className="ttl">{t('card_machinery_t')}</span></Link>
          <Link to="/nearby" className="btn hero-card hc-3"><span className="ic">📍</span><span className="ttl">{t('card_nearby_t')}</span></Link>
          <Link to="/my-requirements" className="btn hero-card hc-1"><span className="ic">📝</span><span className="ttl">{t('card_myreqs_t')}</span></Link>
          <Link to="/profile" className="btn hero-card hc-3"><span className="ic">👤</span><span className="ttl">{t('nav_profile')}</span></Link>
        </div>
      </div>
    </section>
  );
}
