import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  adminListProfiles, adminListMachinery, adminListRequirements, adminListReports,
  adminSetUserStatus, adminSetMachineryStatus, adminSetReportStatus,
} from '../services/adminService';
import { Badge, ErrorText } from '../components/ui';

const TABS = ['users', 'machinery', 'requirements', 'reports'];

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('users');
  const [data, setData] = useState({ users: [], machinery: [], requirements: [], reports: [] });
  const [error, setError] = useState('');

  async function loadAll() {
    try {
      const [users, machinery, requirements, reports] = await Promise.all([
        adminListProfiles(), adminListMachinery(), adminListRequirements(), adminListReports(),
      ]);
      setData({ users, machinery, requirements, reports });
    } catch (err) { setError(err.message); }
  }
  useEffect(() => { loadAll(); }, []);

  const tabLabels = { users: t('admin_users'), machinery: t('admin_machinery'), requirements: t('admin_requirements'), reports: t('admin_reports') };

  return (
    <section className="section">
      <div className="wrap">
        <h2>{t('nav_admin')}</h2>
        <ErrorText>{error}</ErrorText>
        <div className="search-tabs">
          {TABS.map((tb) => (
            <button key={tb} className={`pill-btn ${tab === tb ? 'active' : ''}`} onClick={() => setTab(tb)}>{tabLabels[tb]}</button>
          ))}
        </div>

        {tab === 'users' && (
          <table className="admin-table">
            <thead><tr><th>{t('full_name')}</th><th>{t('role')}</th><th>{t('district')}</th><th>{t('status')}</th><th /></tr></thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td><td>{u.role}</td><td>{u.district}</td>
                  <td><Badge tone={u.status === 'active' ? 'leaf' : 'muted'}>{u.status}</Badge></td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={async () => { await adminSetUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active'); loadAll(); }}>
                      {u.status === 'active' ? t('admin_suspend') : t('admin_restore')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'machinery' && (
          <table className="admin-table">
            <thead><tr><th>{t('machine_name')}</th><th>{t('district')}</th><th>{t('status')}</th><th /></tr></thead>
            <tbody>
              {data.machinery.map((m) => (
                <tr key={m.id}>
                  <td>{m.machine_name}</td><td>{m.district}</td>
                  <td><Badge tone={m.status === 'active' ? 'leaf' : 'muted'}>{m.status}</Badge></td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={async () => { await adminSetMachineryStatus(m.id, 'deleted'); loadAll(); }}>
                      {t('admin_remove_listing')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'requirements' && (
          <table className="admin-table">
            <thead><tr><th>{t('district')}</th><th>{t('required_date')}</th><th>{t('status')}</th></tr></thead>
            <tbody>
              {data.requirements.map((r) => (
                <tr key={r.id}><td>{r.district}</td><td>{r.required_date}</td><td>{r.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'reports' && (
          <table className="admin-table">
            <thead><tr><th>{t('report_reason')}</th><th>{t('report_details')}</th><th>{t('status')}</th><th /></tr></thead>
            <tbody>
              {data.reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.reason}</td><td>{r.description}</td><td>{r.status}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={async () => { await adminSetReportStatus(r.id, 'reviewed'); loadAll(); }}>
                      ✔️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
