import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { WORK_TYPES } from '../../utils/constants';
import { Field, Input, TextArea, Button, ErrorText } from '../ui';

export default function WorkerProfileForm({ initial, onSubmit }) {
  const { t, lang } = useLanguage();
  const [workTypes, setWorkTypes] = useState(initial?.work_types || []);
  const [workersAvailable, setWorkersAvailable] = useState(initial?.workers_available || 1);
  const [availabilityText, setAvailabilityText] = useState(initial?.availability_text || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function toggle(value) {
    setWorkTypes((wt) => (wt.includes(value) ? wt.filter((v) => v !== value) : [...wt, value]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (workTypes.length === 0) {
      setError(t('fill_required'));
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ work_types: workTypes, workers_available: Number(workersAvailable), availability_text: availabilityText, description });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label={t('work_type')}>
        <div className="checkbox-row">
          {WORK_TYPES.map((w) => (
            <div className="chk" key={w.value}>
              <input type="checkbox" id={`wtf-${w.value}`} checked={workTypes.includes(w.value)} onChange={() => toggle(w.value)} />
              <label htmlFor={`wtf-${w.value}`}>{lang === 'kn' ? w.kn : w.en}</label>
            </div>
          ))}
        </div>
      </Field>
      <Field label={t('workers_available')}>
        <Input type="number" min="1" value={workersAvailable} onChange={(e) => setWorkersAvailable(e.target.value)} />
      </Field>
      <Field label={t('availability')}>
        <Input value={availabilityText} onChange={(e) => setAvailabilityText(e.target.value)} placeholder={lang === 'kn' ? 'ಉದಾ: ಆಗಸ್ಟ್ 20 ರಿಂದ' : 'e.g. from Aug 20'} />
      </Field>
      <Field label={t('description')}>
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </Field>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" variant="leaf" block disabled={busy}>{busy ? t('loading') : t('save')}</Button>
    </form>
  );
}
