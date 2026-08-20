import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { registerUser } from '../services/authService';
import { ROLES, DISTRICTS } from '../utils/constants';
import { isValidPhone, isValidPassword, MESSAGES } from '../utils/validation';
import { Field, Input, Select, Button, ErrorText } from '../components/ui';

export default function RegisterPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', phone: '', password: '', district: DISTRICTS[0], taluk: '', village: '', role: 'farmer',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.taluk || !form.village) {
      setError(MESSAGES[lang].fillRequired);
      return;
    }
    if (!isValidPhone(form.phone)) {
      setError(MESSAGES[lang].invalidPhone);
      return;
    }
    if (!isValidPassword(form.password)) {
      setError(MESSAGES[lang].passwordShort);
      return;
    }
    setBusy(true);
    try {
      await registerUser({ ...form, preferredLanguage: lang });
      navigate('/');
    } catch (err) {
      if (String(err.message || '').toLowerCase().includes('already') || err.status === 400) {
        setError(MESSAGES[lang].phoneTaken);
      } else {
        setError(MESSAGES[lang].genericError);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 480 }}>
        <h2>{t('register_title')}</h2>
        <form className="form-card" onSubmit={handleSubmit}>
          <Field label={t('role')}>
            <div className="radio-group">
              {ROLES.map((r) => (
                <div className="radio-opt" key={r.value}>
                  <input type="radio" id={`role-${r.value}`} name="role" checked={form.role === r.value} onChange={() => update('role', r.value)} />
                  <label htmlFor={`role-${r.value}`}><span className="ic">{r.icon}</span><span>{lang === 'kn' ? r.kn : r.en}</span></label>
                </div>
              ))}
            </div>
          </Field>
          <Field label={t('full_name')}>
            <Input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
          </Field>
          <Field label={t('phone')}>
            <Input type="tel" pattern="[0-9]{10}" value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
          </Field>
          <Field label={t('password')}>
            <Input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
          </Field>
          <Field label={t('district')}>
            <Select value={form.district} onChange={(e) => update('district', e.target.value)}>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label={t('taluk')}>
            <Input value={form.taluk} onChange={(e) => update('taluk', e.target.value)} required />
          </Field>
          <Field label={t('village')}>
            <Input value={form.village} onChange={(e) => update('village', e.target.value)} required />
          </Field>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" block disabled={busy}>{busy ? t('loading') : t('btn_register')}</Button>
        </form>
        <p style={{ marginTop: 12 }}>{t('have_account')} <Link to="/login">{t('nav_login')}</Link></p>
      </div>
    </section>
  );
}
