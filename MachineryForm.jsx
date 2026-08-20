import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { MACHINE_TYPES, PRICE_UNITS, DISTRICTS } from '../../utils/constants';
import { Field, Input, Select, TextArea, Button, ErrorText } from '../ui';
import { uploadMachineImage } from '../../services/machineryService';
import { useAuth } from '../../auth/AuthContext';

export default function MachineryForm({ initial, onSubmit, submitLabel }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [form, setForm] = useState(
    initial || {
      machine_type: 'tractor', machine_name: '', description: '', price: '', price_unit: 'hour',
      district: DISTRICTS[0], taluk: '', village: '', available_from: '', available_to: '', image_url: '',
    }
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMachineImage(user.id, file);
      update('image_url', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.machine_name || !form.price || !form.district || !form.taluk || !form.village) {
      setError(t('fill_required'));
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ ...form, price: Number(form.price) });
    } catch (err) {
      setError(err.message || t('fill_required'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label={t('machine_type')}>
        <Select value={form.machine_type} onChange={(e) => update('machine_type', e.target.value)}>
          {MACHINE_TYPES.map((m) => <option key={m.value} value={m.value}>{lang === 'kn' ? m.kn : m.en}</option>)}
        </Select>
      </Field>
      <Field label={t('machine_name')}>
        <Input value={form.machine_name} onChange={(e) => update('machine_name', e.target.value)} required />
      </Field>
      <Field label={lang === 'kn' ? 'ಯಂತ್ರದ ಫೋಟೋ' : 'Machine photo'}>
        <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} />
        {form.image_url && <img src={form.image_url} alt="" style={{ marginTop: 8, maxWidth: 160, borderRadius: 8 }} />}
      </Field>
      <div className="field-grid">
        <Field label={t('rate')}>
          <Input type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required />
        </Field>
        <Field label={t('price_unit')}>
          <Select value={form.price_unit} onChange={(e) => update('price_unit', e.target.value)}>
            {PRICE_UNITS.map((u) => <option key={u.value} value={u.value}>{lang === 'kn' ? u.kn : u.en}</option>)}
          </Select>
        </Field>
      </div>
      <Field label={t('district')}>
        <Select value={form.district} onChange={(e) => update('district', e.target.value)}>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </Field>
      <div className="field-grid">
        <Field label={t('taluk')}>
          <Input value={form.taluk} onChange={(e) => update('taluk', e.target.value)} required />
        </Field>
        <Field label={t('village')}>
          <Input value={form.village} onChange={(e) => update('village', e.target.value)} required />
        </Field>
      </div>
      <div className="field-grid">
        <Field label={t('available_from')}>
          <Input type="date" value={form.available_from} onChange={(e) => update('available_from', e.target.value)} />
        </Field>
        <Field label={t('available_to')}>
          <Input type="date" value={form.available_to} onChange={(e) => update('available_to', e.target.value)} />
        </Field>
      </div>
      <Field label={t('description')}>
        <TextArea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} />
      </Field>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" variant="sky" block disabled={busy || uploading}>{busy ? t('loading') : (submitLabel || t('publish'))}</Button>
    </form>
  );
}
