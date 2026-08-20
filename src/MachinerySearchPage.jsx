import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { DISTRICTS, MACHINE_TYPES } from '../utils/constants';
import { searchMachinery } from '../services/machineryService';
import { sendContactRequest } from '../services/contactService';
import { DEMO_MACHINERY } from '../utils/demoData';
import { Field, Select, Input, Button, Modal, ErrorText, SuccessText } from '../components/ui';
import { MachineryCard, DemoNotice } from '../components/listings';

export default function MachinerySearchPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [district, setDistrict] = useState('all');
  const [machineType, setMachineType] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactTarget, setContactTarget] = useState(null);
  const [requestStatus, setRequestStatus] = useState('');

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchMachinery({ district, machineType, maxPrice: maxPrice ? Number(maxPrice) : undefined });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [district, machineType, maxPrice]);

  useEffect(() => { runSearch(); }, [runSearch]);

  function handleContact(ownerId) {
    setContactTarget(ownerId);
  }

  async function confirmContact() {
    setRequestStatus('');
    try {
      await sendContactRequest({ fromUser: user.id, toUser: contactTarget, listingType: 'machinery' });
      setRequestStatus(lang === 'kn' ? 'ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ.' : 'Request sent.');
    } catch (err) {
      setRequestStatus(err.message);
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('nav_machinery')}</h2>
        <div className="search-panel">
          <div className="field-grid cols-5">
            <Field label={t('district')}>
              <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="all">{t('all')}</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label={t('machine_type')}>
              <Select value={machineType} onChange={(e) => setMachineType(e.target.value)}>
                <option value="all">{t('all')}</option>
                {MACHINE_TYPES.map((m) => <option key={m.value} value={m.value}>{lang === 'kn' ? m.kn : m.en}</option>)}
              </Select>
            </Field>
            <Field label={lang === 'kn' ? 'ಗರಿಷ್ಠ ಬೆಲೆ (₹)' : 'Max price (₹)'}>
              <Input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </Field>
            <Field>
              <Button variant="sky" onClick={runSearch} block>{t('search')}</Button>
            </Field>
          </div>
        </div>

        <ErrorText>{error}</ErrorText>

        <div className="results-grid">
          {!loading && results.map((m) => (
            <MachineryCard key={m.id} machine={m} onContact={handleContact} onViewDetails={(id) => navigate(`/machinery/${id}`)} />
          ))}
        </div>

        {!loading && results.length === 0 && (
          <>
            <div className="empty-note">{lang === 'kn' ? 'ಯಾವುದೇ ಸೇವೆ ಕಂಡುಬಂದಿಲ್ಲ.' : 'No services found.'}</div>
            <DemoNotice />
            <div className="results-grid" style={{ marginTop: 10 }}>
              {DEMO_MACHINERY.map((m) => <MachineryCard key={m.id} machine={m} isDemo onContact={() => {}} onViewDetails={() => {}} />)}
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
              <Button variant="sky" onClick={confirmContact}>{t('send_request')}</Button>
            </>
          )}
        </Modal>
      </div>
    </section>
  );
}
