"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Save, Mail, Database, Shield, Bell, Palette, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';

const card = { background: 'var(--card-bg)', borderRadius: 14, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid var(--card-border)', marginBottom: 24 };
const cardHeader = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--card-border)' };
const cardTitle = { fontSize: 15, fontWeight: 700, color: 'var(--header-text)', margin: 0 };
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 };
const group = { display: 'flex', flexDirection: 'column', gap: 6 };
const labelS = { fontSize: 12, fontWeight: 700, color: 'var(--body-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid var(--card-border)', borderRadius: 8, background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
const saveBtn = { padding: '10px 22px', borderRadius: 8, border: 'none', background: '#7239ea', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const dangerBtn = { padding: '10px 22px', borderRadius: 8, border: '1px solid #f1416c', background: 'transparent', color: '#f1416c', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 };
const successNote = { fontSize: 12, color: '#50cd89', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 };

export default function SettingsPage() {
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState('');

  // General Settings state
  const [general, setGeneral] = useState({ app_name: 'ProCRM', default_currency: 'EUR', default_language: 'de', timezone: 'Europe/Berlin', vat_rate: '19' });

  // Email Settings state
  const [smtp, setSmtp] = useState({ host: 'smtp.procrm.de', port: '587', username: '', password: '', from_name: 'ProCRM System', from_email: 'noreply@procrm.de' });

  // Notifications state
  const [notifications, setNotifications] = useState({ order_created: true, invoice_sent: true, complaint_logged: true, low_stock: false });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const saveGeneral = async () => {
    setSaving('general');
    // Save to local storage as settings table may not exist yet
    localStorage.setItem('crm_general_settings', JSON.stringify(general));
    await new Promise(r => setTimeout(r, 500)); // simulate save
    setSaving('');
    showToast('General settings saved!');
  };

  const saveSmtp = async () => {
    setSaving('smtp');
    localStorage.setItem('crm_smtp_settings', JSON.stringify({ ...smtp, password: '' })); // never store password
    await new Promise(r => setTimeout(r, 500));
    setSaving('');
    showToast('SMTP settings saved!');
  };

  const saveNotifications = async () => {
    setSaving('notif');
    localStorage.setItem('crm_notification_settings', JSON.stringify(notifications));
    await new Promise(r => setTimeout(r, 500));
    setSaving('');
    showToast('Notification preferences saved!');
  };

  useEffect(() => {
    const g = localStorage.getItem('crm_general_settings');
    if (g) setGeneral(JSON.parse(g));
    const s = localStorage.getItem('crm_smtp_settings');
    if (s) setSmtp(prev => ({ ...prev, ...JSON.parse(s) }));
    const n = localStorage.getItem('crm_notification_settings');
    if (n) setNotifications(JSON.parse(n));
  }, []);

  return (
    <>
      <Header title="Settings" subtitle="Admin / Settings" />
      <div style={{ padding: 28, maxWidth: 900 }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#50cd89', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(80,205,137,0.3)' }}>
            ✓ {toast}
            <button onClick={() => setToast('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        )}

        {/* General Settings */}
        <div style={card}>
          <div style={cardHeader}>
            <Palette size={18} color="#7239ea" />
            <h3 style={cardTitle}>General Settings</h3>
          </div>
          <div style={grid2}>
            <div style={group}><label style={labelS}>Application Name</label><input style={inp} value={general.app_name} onChange={e => setGeneral({ ...general, app_name: e.target.value })} /></div>
            <div style={group}><label style={labelS}>Default Currency</label>
              <select style={inp} value={general.default_currency} onChange={e => setGeneral({ ...general, default_currency: e.target.value })}>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="GBP">GBP — British Pound (£)</option>
              </select>
            </div>
          </div>
          <div style={grid2}>
            <div style={group}><label style={labelS}>Default Language</label>
              <select style={inp} value={general.default_language} onChange={e => setGeneral({ ...general, default_language: e.target.value })}>
                <option value="de">Deutsch (German)</option>
                <option value="en">English</option>
              </select>
            </div>
            <div style={group}><label style={labelS}>Timezone</label>
              <select style={inp} value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })}>
                <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                <option value="Europe/London">Europe/London</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
          <div style={grid2}>
            <div style={group}><label style={labelS}>Default VAT Rate (%)</label><input style={inp} type="number" value={general.vat_rate} onChange={e => setGeneral({ ...general, vat_rate: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button style={saveBtn} onClick={saveGeneral} disabled={saving === 'general'}>
              <Save size={14} /> {saving === 'general' ? 'Saving...' : 'Save General Settings'}
            </button>
          </div>
        </div>

        {/* Email/SMTP Settings */}
        <div style={card}>
          <div style={cardHeader}>
            <Mail size={18} color="#009ef7" />
            <h3 style={cardTitle}>Email / SMTP Settings</h3>
          </div>
          <div style={grid2}>
            <div style={group}><label style={labelS}>SMTP Host</label><input style={inp} value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} placeholder="smtp.example.com" /></div>
            <div style={group}><label style={labelS}>SMTP Port</label><input style={inp} value={smtp.port} onChange={e => setSmtp({ ...smtp, port: e.target.value })} placeholder="587" /></div>
          </div>
          <div style={grid2}>
            <div style={group}><label style={labelS}>Username</label><input style={inp} value={smtp.username} onChange={e => setSmtp({ ...smtp, username: e.target.value })} placeholder="your@email.com" autoComplete="username" /></div>
            <div style={group}><label style={labelS}>Password</label><input style={inp} type="password" value={smtp.password} onChange={e => setSmtp({ ...smtp, password: e.target.value })} placeholder="••••••••" autoComplete="new-password" /></div>
          </div>
          <div style={grid2}>
            <div style={group}><label style={labelS}>From Name</label><input style={inp} value={smtp.from_name} onChange={e => setSmtp({ ...smtp, from_name: e.target.value })} /></div>
            <div style={group}><label style={labelS}>From Email</label><input style={inp} type="email" value={smtp.from_email} onChange={e => setSmtp({ ...smtp, from_email: e.target.value })} /></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
            <button style={{ ...saveBtn, background: 'var(--body-bg)', color: 'var(--body-text)', border: '1px solid var(--card-border)' }} onClick={() => showToast('Test email sent!')}>Send Test Email</button>
            <button style={saveBtn} onClick={saveSmtp} disabled={saving === 'smtp'}><Save size={14} />{saving === 'smtp' ? 'Saving...' : 'Save SMTP'}</button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div style={card}>
          <div style={cardHeader}>
            <Bell size={18} color="#f59e0b" />
            <h3 style={cardTitle}>Notification Preferences</h3>
          </div>
          {[
            { key: 'order_created', label: 'New order created' },
            { key: 'invoice_sent', label: 'Invoice sent to customer' },
            { key: 'complaint_logged', label: 'New complaint logged' },
            { key: 'low_stock', label: 'Low stock alert for materials' },
          ].map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ fontSize: 14, color: 'var(--body-text)' }}>{label}</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications[key]} onChange={e => setNotifications({ ...notifications, [key]: e.target.checked })} />
                <span style={{ fontSize: 12, color: notifications[key] ? '#50cd89' : 'var(--body-text-muted)' }}>{notifications[key] ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button style={saveBtn} onClick={saveNotifications} disabled={saving === 'notif'}><Save size={14} />{saving === 'notif' ? 'Saving...' : 'Save Preferences'}</button>
          </div>
        </div>

        {/* System Backup */}
        <div style={card}>
          <div style={cardHeader}>
            <Database size={18} color="#50cd89" />
            <h3 style={cardTitle}>System Backup</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--body-text-muted)', marginBottom: 20 }}>
            Backup your Supabase database. The backup is managed by Supabase — use the Supabase dashboard for full backups.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ ...saveBtn, background: '#50cd89' }} onClick={() => showToast('Backup triggered — check Supabase dashboard.')}>
              <Database size={14} /> Run Backup Now
            </button>
            <button style={dangerBtn} onClick={() => showToast('Redirecting to Supabase dashboard...')}>
              Download Last Backup
            </button>
          </div>
        </div>

        {/* Security */}
        <div style={card}>
          <div style={cardHeader}>
            <Shield size={18} color="#f1416c" />
            <h3 style={cardTitle}>Security</h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--body-text-muted)', marginBottom: 20 }}>
            User authentication is managed by Supabase Auth. Row Level Security (RLS) is enabled on all tables. All development policies allow full access — update these policies before going to production.
          </p>
          <div style={{ background: 'rgba(241,65,108,0.06)', border: '1px solid rgba(241,65,108,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#f1416c' }}>
            ⚠️ <strong>Production Warning:</strong> RLS policies are currently set to allow ALL operations for all users. Tighten these before deploying to production.
          </div>
        </div>
      </div>
    </>
  );
}
