import { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { DISTRICTS, WORK_TYPES } from '../utils/constants';
import { searchWorkers } from '../services/workerService';
import { sendContactRequest } from '../services/contactService';
import { DEMO_WORKERS } from '../utils/demoData';
import { Field, Select, Input, Button, Modal, ErrorText, SuccessText } from '../components/ui';
import { WorkerCard, DemoNotice } from '../components/listings';

export default function WorkerSearchPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [district, setDistrict] = useState('all');
  const [workType, setWorkType] = useState('all');
  const [minWorkers, setMinWorkers] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactTarget, setContactTarget] = useState(null);
  const [requestStatus, setRequestStatus] = useState('');

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchWorkers({ district, workType, minWorkers: minWorkers ? Number(minWorkers) : undefined });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [district, workType, minWorkers]);

  useEffect(() => { runSearch(); }, [runSearch]);

  async function handleContact(toUser) {
    if (!user) {
      setContactTarget(toUser);
      return;
    }
    setContactTarget(toUser);
  }

  async function confirmContact() {
    setRequestStatus('');
    try {
      await sendContactRequest({ fromUser: user.id, toUser: contactTarget, listingType: 'worker' });
      setRequestStatus(lang === 'kn' ? 'ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ.' : 'Request sent.');
    } catch (err) {
      setRequestStatus(err.message);
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('nav_workers')}</h2>
        <div className="search-panel">
          <div className="field-grid cols-5">
            <Field label={t('district')}>
              <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="all">{t('all')}</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label={t('work_type')}>
              <Select value={workType} onChange={(e) => setWorkType(e.target.value)}>
                <option value="all">{t('all')}</option>
                {WORK_TYPES.map((w) => <option key={w.value} value={w.value}>{lang === 'kn' ? w.kn : w.en}</option>)}
              </Select>
            </Field>
            <Field label={t('num_workers')}>
              <Input type="number" min="1" value={minWorkers} onChange={(e) => setMinWorkers(e.target.value)} />
            </Field>
            <Field>
              <Button onClick={runSearch} block>{t('search')}</Button>
            </Field>
          </div>
        </div>

        <ErrorText>{error}</ErrorText>

        <div className="results-grid">
          {!loading && results.map((w) => (
            <WorkerCard key={w.user_id} worker={w} onContact={handleContact} />
          ))}
        </div>

        {!loading && results.length === 0 && (
          <>
            <div className="empty-note">{t('fill_required') && null}{lang === 'kn' ? 'ಯಾವುದೇ ಸೇವೆ ಕಂಡುಬಂದಿಲ್ಲ.' : 'No services found.'}</div>
            <DemoNotice />
            <div className="results-grid" style={{ marginTop: 10 }}>
              {DEMO_WORKERS.map((w) => <WorkerCard key={w.id} worker={{ ...w, profile: null }} isDemo onContact={() => {}} />)}
            </div>
          </>
        )}

        <Modal open={!!contactTarget} onClose={() => { setContactTarget(null); setRequestStatus(''); }} title={t('send_request')}>
          {!user ? (
            <p>{lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.' : 'Please log in to contact.'}</p>
          ) : requestStatus ? (
            <SuccessText>{requestStatus}</SuccessText>
          ) : (
            <>
              <p>{t('safety_notice')}</p>
              <Button onClick={confirmContact}>{t('send_request')}</Button>
            </>
          )}
        </Modal>
      </div>
    </section>
  );
}
