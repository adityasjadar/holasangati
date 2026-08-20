import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { getMyRequirements, updateRequirementStatus, deleteRequirement } from '../services/requirementService';
import { RequirementCard } from '../components/listings';
import { ErrorText } from '../components/ui';

export default function MyRequirementsPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [reqs, setReqs] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      setReqs(await getMyRequirements(user.id));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, [user.id]);

  async function handleDelete(id) {
    await deleteRequirement(id);
    load();
  }

  async function handleEdit(req) {
    const nextStatus = req.status === 'open' ? 'fulfilled' : 'open';
    await updateRequirementStatus(req.id, nextStatus);
    load();
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('nav_myreqs')}</h2>
        <ErrorText>{error}</ErrorText>
        {reqs.length === 0 && <div className="empty-note">{lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಅವಶ್ಯಕತೆ ಪ್ರಕಟಿಸಿಲ್ಲ.' : 'No requirements posted yet.'}</div>}
        <div className="results-grid">
          {reqs.map((r) => <RequirementCard key={r.id} req={r} mine onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>
      </div>
    </section>
  );
}
