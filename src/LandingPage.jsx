import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  return (
    <section className="hero">
      <div className="wrap hero-inner">
        <div className="hero-tag"><span className="dot" />{t('brand')} · MVP</div>
        <h1>{t('hero_h1')}</h1>
        <p className="sub">{t('hero_sub')}</p>
        <div className="hero-actions">
          <Link to="/workers" className="btn hero-card hc-1"><span className="ic">🌾</span><span className="ttl">{t('card_workers_t')}</span></Link>
          <Link to="/machinery" className="btn hero-card hc-2"><span className="ic">🚜</span><span className="ttl">{t('card_machinery_t')}</span></Link>
          <Link to="/nearby" className="btn hero-card hc-3"><span className="ic">📍</span><span className="ttl">{t('card_nearby_t')}</span></Link>
        </div>
      </div>
    </section>
  );
}
