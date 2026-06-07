"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { User, Lock, Check, AlertCircle, Eye, EyeOff, Shield, Save } from 'lucide-react';
import { supabase } from '@/utils/supabase';

/* ─── inline style tokens ────────────────────────────────────────────── */
const s = {
  page:       { flex: 1, padding: 30, overflowY: 'auto' },
  grid:       { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, maxWidth: 860, margin: '0 auto' },
  card:       { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 },
  label:      { fontSize: 12, fontWeight: 700, color: 'var(--body-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6, display: 'block' },
  inp:        { width: '100%', padding: '10px 14px', border: '1.5px solid var(--card-border)', borderRadius: 8, background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' },
  saveBtn:    { padding: '10px 24px', borderRadius: 8, border: 'none', background: '#7239ea', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s' },
  sectionHdr: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--card-border)' },
  sectionLbl: { fontSize: 15, fontWeight: 700, color: 'var(--header-text)', margin: 0 },
};

const ROLE_LABEL = {
  admin:   { label: 'Administrator',  color: '#7239ea', bg: 'rgba(114,57,234,0.1)' },
  manager: { label: 'Manager',         color: '#009ef7', bg: 'rgba(0,158,247,0.1)' },
  finance: { label: 'Buchhaltung',     color: '#c92a42', bg: 'rgba(201,42,66,0.1)' },
  sales:   { label: 'Vertrieb',        color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  crew:    { label: 'Montageteam',     color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
};

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail]     = useState('');

  /* password fields */
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* display name */
  const [displayName, setDisplayName] = useState('');

  const [saving, setSaving]   = useState('');
  const [toast, setToast]     = useState({ msg: '', type: 'success' });

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setEmail(session.user.email || '');

      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (p) {
        setProfile(p);
        setDisplayName(p.full_name || '');
      }
    }
    load();
  }, []);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3500);
  }

  /* Save display name */
  async function saveProfile(e) {
    e.preventDefault();
    if (!displayName.trim()) { showToast('Name darf nicht leer sein.', 'error'); return; }
    setSaving('profile');
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: displayName.trim() })
      .eq('id', session.user.id);
    setSaving('');
    if (error) { showToast('Fehler beim Speichern: ' + error.message, 'error'); }
    else { showToast('Profilinformationen gespeichert!'); }
  }

  /* Change password via Supabase */
  async function changePassword(e) {
    e.preventDefault();
    if (!newPw) { showToast('Neues Passwort eingeben.', 'error'); return; }
    if (newPw.length < 8) { showToast('Passwort muss mindestens 8 Zeichen haben.', 'error'); return; }
    if (newPw !== confirmPw) { showToast('Passwörter stimmen nicht überein.', 'error'); return; }

    setSaving('password');

    // Re-authenticate with current password to verify identity
    const { error: reAuthErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPw,
    });
    if (reAuthErr) {
      setSaving('');
      showToast('Aktuelles Passwort ist falsch.', 'error');
      return;
    }

    // Now update password
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPw });
    setSaving('');
    if (updateErr) {
      showToast('Fehler: ' + updateErr.message, 'error');
    } else {
      showToast('Passwort erfolgreich geändert! ✓');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    }
  }

  const roleInfo = ROLE_LABEL[profile?.role] || ROLE_LABEL.crew;
  const initials = (profile?.full_name || email || '?').charAt(0).toUpperCase();

  return (
    <>
      <Header title="Mein Konto" subtitle="Einstellungen" />
      <div style={s.page}>
        {/* Toast notification */}
        {toast.msg && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            background: toast.type === 'error' ? '#f1416c' : '#50cd89',
            color: '#fff', padding: '12px 20px', borderRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600,
            animation: 'fadeIn 0.2s ease',
          }}>
            {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            {toast.msg}
          </div>
        )}
        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>

        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* ── Profile Overview Card ──────────────────────────────────── */}
          <div style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: roleInfo.bg, color: roleInfo.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--header-text)', margin: '0 0 4px' }}>
                {profile?.full_name || 'Mein Profil'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--body-text-muted)', margin: '0 0 10px' }}>{email}</p>
              <span style={{
                background: roleInfo.bg, color: roleInfo.color,
                padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              }}>
                {roleInfo.label}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* ── Display Name ─────────────────────────────────────────── */}
            <div style={s.card}>
              <div style={s.sectionHdr}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(114,57,234,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="#7239ea" />
                </div>
                <h3 style={s.sectionLbl}>Profilinformationen</h3>
              </div>
              <form onSubmit={saveProfile}>
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Anzeigename</label>
                  <input style={s.inp} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Ihr vollständiger Name" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>E-Mail-Adresse</label>
                  <input style={{ ...s.inp, opacity: 0.7, cursor: 'not-allowed' }} value={email} readOnly />
                  <p style={{ fontSize: 11, color: 'var(--body-text-muted)', marginTop: 4 }}>E-Mail kann nur vom Administrator geändert werden.</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Rolle</label>
                  <input style={{ ...s.inp, opacity: 0.7, cursor: 'not-allowed' }} value={roleInfo.label} readOnly />
                </div>
                <button type="submit" style={s.saveBtn} disabled={saving === 'profile'}>
                  <Save size={14} />
                  {saving === 'profile' ? 'Wird gespeichert...' : 'Speichern'}
                </button>
              </form>
            </div>

            {/* ── Change Password ───────────────────────────────────────── */}
            <div style={s.card}>
              <div style={s.sectionHdr}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,158,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={18} color="#009ef7" />
                </div>
                <h3 style={s.sectionLbl}>Passwort ändern</h3>
              </div>
              <form onSubmit={changePassword}>
                {/* Current password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Aktuelles Passwort</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      style={{ ...s.inp, paddingRight: 40 }}
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-text-muted)', padding: 0 }}>
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Neues Passwort</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      style={{ ...s.inp, paddingRight: 40 }}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="Min. 8 Zeichen"
                      required
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-text-muted)', padding: 0 }}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {newPw && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ height: 4, borderRadius: 4, background: 'var(--card-border)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 4, transition: 'width 0.3s, background 0.3s',
                          width: newPw.length < 8 ? '33%' : newPw.length < 12 ? '66%' : '100%',
                          background: newPw.length < 8 ? '#f1416c' : newPw.length < 12 ? '#ffc700' : '#50cd89',
                        }} />
                      </div>
                      <p style={{ fontSize: 11, marginTop: 3, color: newPw.length < 8 ? '#f1416c' : newPw.length < 12 ? '#d16b11' : '#50cd89' }}>
                        {newPw.length < 8 ? 'Zu schwach' : newPw.length < 12 ? 'Mittel' : 'Stark'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={s.label}>Passwort bestätigen</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      style={{
                        ...s.inp, paddingRight: 40,
                        borderColor: confirmPw && confirmPw !== newPw ? '#f1416c' : confirmPw && confirmPw === newPw ? '#50cd89' : undefined,
                      }}
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      placeholder="Passwort wiederholen"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-text-muted)', padding: 0 }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPw && confirmPw !== newPw && (
                    <p style={{ fontSize: 11, color: '#f1416c', marginTop: 3 }}>Passwörter stimmen nicht überein.</p>
                  )}
                  {confirmPw && confirmPw === newPw && (
                    <p style={{ fontSize: 11, color: '#50cd89', marginTop: 3 }}>✓ Passwörter stimmen überein.</p>
                  )}
                </div>

                <button type="submit"
                  style={{ ...s.saveBtn, background: '#009ef7' }}
                  disabled={saving === 'password'}>
                  <Shield size={14} />
                  {saving === 'password' ? 'Wird geändert...' : 'Passwort ändern'}
                </button>
              </form>
            </div>
          </div>

          {/* ── Security notice ────────────────────────────────────────── */}
          <div style={{ ...s.card, background: 'rgba(255,199,0,0.06)', borderColor: 'rgba(255,199,0,0.3)', marginTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <AlertCircle size={18} color="#d16b11" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#d16b11', marginBottom: 4 }}>Sicherheitshinweis</p>
                <p style={{ fontSize: 12, color: 'var(--body-text-muted)', lineHeight: 1.6 }}>
                  Verwenden Sie ein starkes Passwort mit mindestens 8 Zeichen, Groß- und Kleinbuchstaben sowie Zahlen.
                  Teilen Sie Ihr Passwort niemals mit anderen Personen. Nach einer Passwortänderung bleiben Sie auf diesem Gerät angemeldet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
