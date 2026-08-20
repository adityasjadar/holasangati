import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { REPORT_REASONS } from '../../utils/constants';
import { Field, Select, TextArea, Button, ErrorText, SuccessText } from '../ui';
import { submitReport } from '../../services/reportService';
import { useAuth } from '../../auth/AuthContext';

export default function ReportForm({ reportedUserId, onDone }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [reason, setReason] = useState(REPORT_REASONS[0].value);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await submitReport({ reporterId: user.id, reportedUserId, reason, description });
      setDone(true);
      onDone?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) return <SuccessText>{lang === 'kn' ? 'ವರದಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು.' : 'Report submitted. Thank you.'}</SuccessText>;

  return (
    <form onSubmit={handleSubmit}>
      <Field label={t('report_reason')}>
        <Select value={reason} onChange={(e) => setReason(e.target.value)}>
          {REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{lang === 'kn' ? r.kn : r.en}</option>)}
        </Select>
      </Field>
      <Field label={t('report_details')}>
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </Field>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" variant="outline" disabled={busy}>{busy ? t('loading') : t('report_submit')}</Button>
    </form>
  );
}
