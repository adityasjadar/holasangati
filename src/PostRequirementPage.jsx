import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { postRequirement } from '../services/requirementService';
import RequirementForm from '../components/forms/RequirementForm';
import { SuccessText } from '../components/ui';
import { useState } from 'react';

export default function PostRequirementPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  async function handleSubmit(form) {
    await postRequirement(user.id, form);
    setDone(true);
    setTimeout(() => navigate('/my-requirements'), 1200);
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('post_title')}</h2>
        {done ? <SuccessText>{t('requirementPosted') || t('save')}</SuccessText> : <RequirementForm onSubmit={handleSubmit} />}
      </div>
    </section>
  );
}
