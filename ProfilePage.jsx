import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { updateProfile } from '../services/profileService';
import { changePassword, deleteOwnAccount } from '../services/authService';
import { DISTRICTS } from '../utils/constants';
import { Field, Input, Select, Button, ErrorText, SuccessText } from '../components/ui';
import { getIncomingRequests, respondToContactRequest } from '../services/contactService';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { t, lang } = useLanguage();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: profile?.full_name, district: profile?.district, taluk: profile?.taluk, village: profile?.village });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [incoming, setIncoming] = useState([]);

  useEffect(() => { getIncomingRequests(user.id).then(setIncoming).catch(() => {}); }, [user.id]);

  async function saveProfile(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateProfile(user.id, form);
      refreshProfile();
      setSuccess(t('save'));
    } catch (err) { setError(err.message); }
  }

  async function savePassword(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await changePassword(newPassword);
      setNewPassword('');
      setSuccess(t('save'));
    } catch (err) { setError(err.message); }
  }

  async function handleDelete() {
    if (!confirm(t('delete_account_confirm'))) return;
    await deleteOwnAccount(user.id);
    navigate('/');
  }

  async function respond(id, status) {
    await respondToContactRequest(id, status);
    setIncoming((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <h2>{t('nav_profile')}</h2>
        <ErrorText>{error}</ErrorText>
        <SuccessText>{success}</SuccessText>

        <form className="form-card" onSubmit={saveProfile}>
          <Field label={t('full_name')}>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </Field>
          <Field label={t('district')}>
            <Select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label={t('taluk')}>
            <Input value={form.taluk} onChange={(e) => setForm({ ...form, taluk: e.target.value })} />
          </Field>
          <Field label={t('village')}>
            <Input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
          </Field>
          <Button type="submit">{t('save')}</Button>
        </form>

        <form className="form-card" style={{ marginTop: 16 }} onSubmit={savePassword}>
          <Field label={t('new_password')}>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
          </Field>
          <Button type="submit" variant="ghost">{t('change_password')}</Button>
        </form>

        {incoming.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3>{lang === 'kn' ? 'ಬಂದ ವಿನಂತಿಗಳು' : 'Incoming requests'}</h3>
            {incoming.map((r) => (
              <div className="listing-card" key={r.id} style={{ marginBottom: 8 }}>
                <div className="listing-meta"><span>{r.listing_type} · {r.status}</span></div>
                {r.status === 'pending' && (
                  <div className="listing-foot">
                    <button className="btn btn-leaf btn-sm" onClick={() => respond(r.id, 'accepted')}>✅</button>
                    <button className="btn btn-outline btn-sm" onClick={() => respond(r.id, 'declined')}>✖️</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" style={{ marginTop: 24 }} onClick={handleDelete}>{t('delete_account')}</Button>
      </div>
    </section>
  );
}
