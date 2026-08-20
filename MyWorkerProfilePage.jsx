import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { getMyWorkerProfile, upsertMyWorkerProfile, setWorkerActive } from '../services/workerService';
import WorkerProfileForm from '../components/forms/WorkerProfileForm';
import { Button, ErrorText, SuccessText } from '../components/ui';

export default function MyWorkerProfilePage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [wp, setWp] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function load() {
    try { setWp(await getMyWorkerProfile(user.id)); } catch (err) { setError(err.message); }
  }
  useEffect(() => { load(); }, [user.id]);

  async function handleSave(fields) {
    await upsertMyWorkerProfile(user.id, fields);
    setSaved(true);
    load();
  }

  async function toggleActive() {
    await setWorkerActive(user.id, !wp?.is_active);
    load();
  }

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <h2>{t('my_work_info')}</h2>
        <ErrorText>{error}</ErrorText>
        {saved && <SuccessText>{t('save')}</SuccessText>}
        <div className="form-card">
          <WorkerProfileForm initial={wp} onSubmit={handleSave} />
        </div>
        {wp && (
          <Button variant="outline" style={{ marginTop: 12 }} onClick={toggleActive}>
            {wp.is_active ? t('pause') : t('resume')}
          </Button>
        )}
      </div>
    </section>
  );
}
