import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { loginUser } from '../services/authService';
import { Field, Input, Button, ErrorText } from '../components/ui';
import { MESSAGES } from '../utils/validation';

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await loginUser({ phone, password });
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(MESSAGES[lang].loginFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 440 }}>
        <h2>{t('login_title')}</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          <Field label={t('phone')}>
            <Input type="tel" pattern="[0-9]{10}" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Field label={t('password')}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" block disabled={busy}>{busy ? t('loading') : t('btn_login')}</Button>
        </form>
        <p style={{ marginTop: 12 }}>{t('no_account')} <Link to="/register">{t('nav_register')}</Link></p>
      </div>
    </section>
  );
}
