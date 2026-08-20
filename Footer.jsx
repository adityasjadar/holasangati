import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 10 }}><span className="mark">🌾</span><span>{t('brand')}</span></div>
            <p>{lang === 'kn' ? 'ಕರ್ನಾಟಕದ ರೈತರು, ಕೃಷಿ ಕೆಲಸಗಾರರು ಮತ್ತು ಯಂತ್ರ ಮಾಲೀಕರನ್ನು ಒಂದುಗೂಡಿಸುವ ವೇದಿಕೆ.' : "A platform bringing together Karnataka's farmers, workers, and machine owners."}</p>
          </div>
          <div>
            <p style={{ fontSize: '.82rem' }}>{t('not_verified_notice')}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {t('brand')}</span>
        </div>
      </div>
    </footer>
  );
}
