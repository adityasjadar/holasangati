import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { getMyMachinery, addMachine, updateMachine, setMachineStatus } from '../services/machineryService';
import MachineryForm from '../components/forms/MachineryForm';
import { Button, Badge, ErrorText } from '../components/ui';
import { MACHINE_TYPES, PRICE_UNITS, labelFor } from '../utils/constants';

export default function MyMachineryPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    try { setList(await getMyMachinery(user.id)); } catch (err) { setError(err.message); }
  }
  useEffect(() => { load(); }, [user.id]);

  async function handleAdd(fields) {
    await addMachine(user.id, fields);
    setShowForm(false);
    load();
  }
  async function handleEditSave(fields) {
    await updateMachine(editing.id, fields);
    setEditing(null);
    load();
  }
  async function toggleStatus(m) {
    await setMachineStatus(m.id, m.status === 'active' ? 'paused' : 'active');
    load();
  }
  async function remove(m) {
    await setMachineStatus(m.id, 'deleted');
    load();
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('my_machines')}</h2>
        <ErrorText>{error}</ErrorText>
        {!showForm && !editing && <Button variant="sky" onClick={() => setShowForm(true)}>➕ {t('add_machine')}</Button>}
        {showForm && (
          <div className="form-card" style={{ marginTop: 16 }}>
            <MachineryForm onSubmit={handleAdd} submitLabel={t('publish')} />
            <Button variant="ghost" onClick={() => setShowForm(false)} style={{ marginTop: 10 }}>{t('cancel')}</Button>
          </div>
        )}
        {editing && (
          <div className="form-card" style={{ marginTop: 16 }}>
            <MachineryForm initial={editing} onSubmit={handleEditSave} submitLabel={t('save')} />
            <Button variant="ghost" onClick={() => setEditing(null)} style={{ marginTop: 10 }}>{t('cancel')}</Button>
          </div>
        )}

        <div className="results-grid" style={{ marginTop: 20 }}>
          {list.map((m) => (
            <div className="listing-card" key={m.id}>
              <div className="listing-top">
                <span className="listing-icon">{MACHINE_TYPES.find((mt) => mt.value === m.machine_type)?.icon}</span>
                <Badge tone={m.status === 'active' ? 'leaf' : 'muted'}>{m.status}</Badge>
              </div>
              <div className="listing-title">{m.machine_name}</div>
              <div className="listing-meta">
                <span>📍 {m.village}, {m.taluk}</span>
                <span>💰 ₹{m.price} {labelFor(PRICE_UNITS, m.price_unit, lang)}</span>
              </div>
              <div className="listing-foot">
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(m)}>{t('edit')}</button>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(m)}>{m.status === 'active' ? t('pause') : t('resume')}</button>
                  <button className="btn btn-outline btn-sm" onClick={() => remove(m)}>{t('delete')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && !showForm && <div className="empty-note">{lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಯಂತ್ರ ಸೇರಿಸಿಲ್ಲ.' : 'No machines added yet.'}</div>}
      </div>
    </section>
  );
}
