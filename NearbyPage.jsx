import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { DISTRICTS } from '../utils/constants';
import { searchMachinery } from '../services/machineryService';
import { searchWorkers } from '../services/workerService';
import { distanceKm, formatDistance } from '../utils/distance';
import { Button, Field, Select, ErrorText } from '../components/ui';
import { MachineryCard, WorkerCard } from '../components/listings';

// Real GPS-based "nearby" architecture: ask permission, get device
// coordinates, compute a true haversine distance to each listing that has
// stored lat/lng, and sort by that. If permission is denied or a listing
// has no coordinates yet, we NEVER invent a distance — we fall back to a
// plain district/taluk browse instead (see IMPORTANT note in the brief).
export default function NearbyPage() {
  const { t, lang } = useLanguage();
  const [mode, setMode] = useState('ask'); // ask | gps | manual
  const [coords, setCoords] = useState(null);
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [workers, setWorkers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function askLocation() {
    if (!navigator.geolocation) {
      setError(t('checkInternet'));
      setMode('manual');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMode('gps');
        loadNearby({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setMode('manual'),
      { timeout: 8000 }
    );
  }

  async function loadNearby(loc) {
    setLoading(true);
    setError('');
    try {
      const [w, m] = await Promise.all([searchWorkers({}), searchMachinery({})]);
      const withDist = (list, latKey, lngKey) =>
        list
          .map((item) => {
            const lat = latKey === 'profile' ? item.profile?.latitude : item[latKey];
            const lng = lngKey === 'profile' ? item.profile?.longitude : item[lngKey];
            const d = distanceKm(loc.lat, loc.lng, lat, lng);
            return { ...item, _distanceKm: d };
          })
          .filter((item) => item._distanceKm !== null)
          .sort((a, b) => a._distanceKm - b._distanceKm);
      setWorkers(withDist(w, 'profile', 'profile'));
      setMachines(withDist(m, 'latitude', 'longitude'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadManual() {
    setLoading(true);
    setError('');
    try {
      const [w, m] = await Promise.all([
        searchWorkers({ district }),
        searchMachinery({ district }),
      ]);
      setWorkers(w);
      setMachines(m);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('nav_nearby')}</h2>

        {mode === 'ask' && (
          <div className="empty-note">
            <p style={{ marginBottom: 12 }}>{t('nearby_ask')}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button onClick={askLocation}>📍 {t('nearby_allow')}</Button>
              <Button variant="ghost" onClick={() => setMode('manual')}>{t('nearby_manual')}</Button>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className="search-panel">
            <div className="field-grid">
              <Field label={t('district')}>
                <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </Field>
              <Field><Button onClick={loadManual} block>{t('search')}</Button></Field>
            </div>
          </div>
        )}

        <ErrorText>{error}</ErrorText>
        {loading && <p>{t('loading')}</p>}

        {!loading && (workers.length > 0 || machines.length > 0) && (
          <div className="results-grid" style={{ marginTop: 18 }}>
            {workers.map((w) => (
              <div key={w.user_id}>
                <WorkerCard worker={w} onContact={() => {}} />
                {w._distanceKm !== undefined && <div className="nearby-hint">📍 {formatDistance(w._distanceKm, lang)}</div>}
              </div>
            ))}
            {machines.map((m) => (
              <div key={m.id}>
                <MachineryCard machine={m} onContact={() => {}} onViewDetails={() => {}} />
                {m._distanceKm !== undefined && <div className="nearby-hint">📍 {formatDistance(m._distanceKm, lang)}</div>}
              </div>
            ))}
          </div>
        )}

        {!loading && mode !== 'ask' && workers.length === 0 && machines.length === 0 && (
          <div className="empty-note">{lang === 'kn' ? 'ಯಾವುದೇ ಸೇವೆ ಕಂಡುಬಂದಿಲ್ಲ.' : 'No services found.'}</div>
        )}
      </div>
    </section>
  );
}
