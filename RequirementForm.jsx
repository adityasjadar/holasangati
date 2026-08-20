import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { REQUIREMENT_TYPES, WORK_TYPES, MACHINE_TYPES, DISTRICTS } from '../../utils/constants';
import { Field, Input, Select, TextArea, Button, ErrorText } from '../ui';

export default function RequirementForm({ initial, onSubmit, submitLabel }) {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState(
    initial || {
      requirement_type: 'workers',
      work_type: '',
      machine_type: '',
      village: '',
      taluk: '',
      district: DISTRICTS[0],
      required_date: '',
      quantity: '',
      description: '',
      contact_preference: 'request',
    }
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.village || !form.taluk || !form.district || !form.required_date || !form.quantity) {
      setError(t('fill_required'));
      return;
    }
    setBusy(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || t('fill_required'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="radio-group">
        {REQUIREMENT_TYPES.map((rt) => (
          <div className="radio-opt" key={rt.value}>
            <input
              type="radio"
              id={`rt-${rt.value}`}
              name="requirement_type"
              checked={form.requirement_type === rt.value}
              onChange={() => update('requirement_type', rt.value)}
            />
            <label htmlFor={`rt-${rt.value}`}><span className="ic">{rt.icon}</span><span>{lang === 'kn' ? rt.kn : rt.en}</span></label>
          </div>
        ))}
      </div>

      {form.requirement_type === 'workers' && (
        <Field label={t('work_type')}>
          <Select value={form.work_type} onChange={(e) => update('work_type', e.target.value)}>
            <option value="">—</option>
            {WORK_TYPES.map((w) => <option key={w.value} value={w.value}>{lang === 'kn' ? w.kn : w.en}</option>)}
          </Select>
        </Field>
      )}
      {form.requirement_type !== 'workers' && (
        <Field label={t('machine_type')}>
          <Select value={form.machine_type} onChange={(e) => update('machine_type', e.target.value)}>
            <option value="">—</option>
            {MACHINE_TYPES.map((m) => <option key={m.value} value={m.value}>{lang === 'kn' ? m.kn : m.en}</option>)}
          </Select>
        </Field>
      )}

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
      <Field label={t('required_date')}>
        <Input type="date" value={form.required_date} onChange={(e) => update('required_date', e.target.value)} required />
      </Field>
      <Field label={t('quantity')}>
        <Input value={form.quantity} onChange={(e) => update('quantity', e.target.value)} required placeholder={lang === 'kn' ? 'ಉದಾ: 5 ಜನ' : 'e.g. 5 people'} />
      </Field>
      <Field label={t('additional_details')}>
        <TextArea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} />
      </Field>
      <Field label={t('contact_preference')}>
        <Select value={form.contact_preference} onChange={(e) => update('contact_preference', e.target.value)}>
          <option value="request">{t('send_request')}</option>
          <option value="call">{t('contact')}</option>
        </Select>
      </Field>

      <ErrorText>{error}</ErrorText>
      <Button type="submit" block disabled={busy}>{busy ? t('loading') : (submitLabel || t('btn_post'))}</Button>
    </form>
  );
}
