import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { getMachineById } from '../services/machineryService';
import { getReviewsForUser } from '../services/reviewService';
import { sendContactRequest } from '../services/contactService';
import { MACHINE_TYPES, PRICE_UNITS, labelFor } from '../utils/constants';
import { Button, Modal, ErrorText, SuccessText, StarRatingDisplay } from '../components/ui';
import ReportForm from '../components/forms/ReportForm';

export default function MachineDetailsPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [machine, setMachine] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    getMachineById(id).then(setMachine).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (machine?.owner_id) getReviewsForUser(machine.owner_id).then(setReviews).catch(() => {});
  }, [machine]);

  async function confirmContact() {
    try {
      await sendContactRequest({ fromUser: user.id, toUser: machine.owner_id, listingType: 'machinery', listingId: machine.id });
      setRequestStatus(lang === 'kn' ? 'ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ.' : 'Request sent.');
    } catch (err) {
      setRequestStatus(err.message);
    }
  }

  if (error) return <section className="section"><div className="wrap"><ErrorText>{error}</ErrorText></div></section>;
  if (!machine) return <section className="section"><div className="wrap">{t('loading')}</div></section>;

  const icon = MACHINE_TYPES.find((m) => m.value === machine.machine_type)?.icon ?? '🚜';

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 640 }}>
        <div className="listing-card" style={{ padding: 24 }}>
          {machine.image_url && <img src={machine.image_url} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 14 }} />}
          <div className="listing-title" style={{ fontSize: '1.3rem' }}>{icon} {machine.machine_name}</div>
          <p>{machine.description}</p>
          <div className="listing-meta">
            <span>📍 {machine.village}, {machine.taluk}, {machine.district}</span>
            <span>💰 ₹{machine.price} {labelFor(PRICE_UNITS, machine.price_unit, lang)}</span>
            {machine.available_from && <span>📅 {machine.available_from} → {machine.available_to || '—'}</span>}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <Button variant="sky" onClick={() => setShowContact(true)}>{t('contact')}</Button>
            <Button variant="outline" onClick={() => setShowReport(true)}>{t('report_user')}</Button>
          </div>
        </div>

        <h3 style={{ marginTop: 24 }}>{t('reviews')}</h3>
        {reviews.length === 0 && <p>{t('no_reviews_yet')}</p>}
        {reviews.map((r) => (
          <div className="listing-card" key={r.id} style={{ marginBottom: 10 }}>
            <StarRatingDisplay rating={r.rating} />
            {r.review && <p style={{ marginTop: 6 }}>{r.review}</p>}
          </div>
        ))}

        <Modal open={showContact} onClose={() => { setShowContact(false); setRequestStatus(''); }} title={t('send_request')}>
          {!user ? <p>{lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.' : 'Please log in to contact.'}</p>
          : requestStatus ? <SuccessText>{requestStatus}</SuccessText>
          : (<><p>{t('safety_notice')}</p><Button variant="sky" onClick={confirmContact}>{t('send_request')}</Button></>)}
        </Modal>
        <Modal open={showReport} onClose={() => setShowReport(false)} title={t('report_user')}>
          {user ? <ReportForm reportedUserId={machine.owner_id} onDone={() => setShowReport(false)} /> : <p>{lang === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ.' : 'Please log in.'}</p>}
        </Modal>
      </div>
    </section>
  );
}
