import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { logoutUser } from '../../services/authService';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const { user, profile, role } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo"><span className="mark">🌾</span><span>{t('brand')}</span></Link>

        <nav className={`main-nav ${open ? 'open' : ''}`}>
          <ul>
            <li><Link to="/workers" onClick={() => setOpen(false)}>{t('nav_workers')}</Link></li>
            <li><Link to="/machinery" onClick={() => setOpen(false)}>{t('nav_machinery')}</Link></li>
            <li><Link to="/nearby" onClick={() => setOpen(false)}>{t('nav_nearby')}</Link></li>
            {user && <li><Link to="/post-requirement" onClick={() => setOpen(false)}>{t('nav_post')}</Link></li>}
            {user && <li><Link to="/my-requirements" onClick={() => setOpen(false)}>{t('nav_myreqs')}</Link></li>}
            {role === 'owner' && <li><Link to="/my-machinery" onClick={() => setOpen(false)}>{t('nav_mymachinery')}</Link></li>}
            {role === 'worker' && <li><Link to="/my-work-profile" onClick={() => setOpen(false)}>{t('nav_myworkprofile')}</Link></li>}
            {role === 'admin' && <li><Link to="/admin" onClick={() => setOpen(false)}>{t('nav_admin')}</Link></li>}
            {user ? (
              <>
                <li><Link to="/profile" onClick={() => setOpen(false)}>{profile?.full_name ?? t('nav_profile')}</Link></li>
                <li><button className="linklike" onClick={handleLogout}>{t('nav_logout')}</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setOpen(false)}>{t('nav_login')}</Link></li>
                <li><Link to="/register" onClick={() => setOpen(false)}>{t('nav_register')}</Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="lang-switch">
            <button className={lang === 'kn' ? 'active' : ''} onClick={() => setLang('kn')}>ಕನ್ನಡ</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <button className="menu-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>☰</button>
        </div>
      </div>
    </header>
  );
}
