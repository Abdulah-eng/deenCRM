"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Flame, Droplet, Zap, Image as ImageIcon, Settings, Edit3, X, Save, Building2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const COMPANY_META = {
  'Heiz Werke Süddeutschland':   { color: '#ea580c', Icon: Flame,   prefix: 'INV-HW' },
  'Estrich Werke Süddeutschland':    { color: '#3b82f6', Icon: Droplet, prefix: 'INV-SW' },
  'Elektro Werke Süddeutschland':{ color: '#10b981', Icon: Zap,     prefix: 'INV-EW' },
};

const EMPTY_FORM = { name: '', vat_number: '', invoice_prefix: '', address: '', phone: '', email: '' };

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCompanies = async () => {
    const { data } = await supabase.from('companies').select('*');
    if (data) setCompanies(data);
    setLoading(false);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const openEdit = (c) => {
    setForm({ name: c.name || '', vat_number: c.vat_number || '', invoice_prefix: c.invoice_prefix || '', address: c.address || '', phone: c.phone || '', email: c.email || '' });
    setEditTarget(c.id);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('companies').update(form).eq('id', editTarget);
    setSaving(false);
    setEditTarget(null);
    fetchCompanies();
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)', padding: 24 };
  const modalBox = { background: 'var(--card-bg)', borderRadius: 16, width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', overflow: 'hidden' };
  const modalHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--card-border)' };
  const modalBody = { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 };
  const modalFooter = { display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '14px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' };
  const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
  const group = { display: 'flex', flexDirection: 'column', gap: 5 };
  const label = { fontSize: 11, fontWeight: 700, color: 'var(--body-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' };
  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid var(--card-border)', borderRadius: 8, background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
  const closeBtn = { width: 32, height: 32, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--body-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
  const cancelBtnS = { padding: '9px 18px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--body-text)', fontSize: 13, cursor: 'pointer' };
  const saveBtnS = { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#7239ea', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 };

  return (
    <>
      <Header title="Unternehmen" subtitle="Admin / Unternehmen" />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Unternehmensverwaltung</h2>
            <p className={styles.desc}>Verwalten Sie 3 unabhängige Unternehmen — Logos, Rechnungsnummern, USt-Einstellungen.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--body-text-muted)' }}>Unternehmen werden geladen...</div>
        ) : (
          <div className={styles.companyGrid}>
            {companies.map(company => {
              const meta = COMPANY_META[company.name] || { color: '#7239ea', Icon: Building2, prefix: 'INV' };
              const Icon = meta.Icon;
              return (
                <div key={company.id} className={styles.companyCard}>
                  <div className={styles.cardHeader} style={{ backgroundColor: meta.color }}>
                    <div className={styles.companyIcon}><Icon size={24} color="white" /></div>
                    <div className={styles.companyName}>{company.name}</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.invoiceBlockRow}>
                      <div className={styles.invoiceBlock}>
                        <h4 style={{ color: meta.color }}>{company.invoice_prefix || meta.prefix}</h4>
                        <span>Rechnungskürzel</span>
                      </div>
                      <div className={styles.invoiceBlock}>
                        <h4 style={{ color: meta.color }}>{company.next_invoice_number || '1'}</h4>
                        <span>Nächste Rechnung #</span>
                      </div>
                    </div>
                    <div className={styles.statRow}><span className={styles.statLabel}>USt-IdNr.</span><span className={styles.statValue}>{company.vat_number || '—'}</span></div>
                    <div className={styles.statRow}><span className={styles.statLabel}>E-Mail</span><span className={styles.statValue}>{company.email || '—'}</span></div>
                    <div className={styles.statRow}><span className={styles.statLabel}>Telefon</span><span className={styles.statValue}>{company.phone || '—'}</span></div>
                    <div className={styles.statRow}><span className={styles.statLabel}>Adresse</span><span className={styles.statValue}>{company.address || '—'}</span></div>
                  </div>
                  <div className={styles.cardFooter}>
                    <button className={`${styles.footerBtn} ${styles.editBtn}`} onClick={() => openEdit(company)}>
                      <Edit3 size={14} /> Bearbeiten
                    </button>
                    <button className={`${styles.footerBtn} ${styles.settingsBtn}`} onClick={() => openEdit(company)}>
                      <Settings size={14} /> Einstellungen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.logoSettingsCard}>
          <div className={styles.logoSettingsHeader}><ImageIcon size={18} color="#7239ea" /> Gemeinsame Logo-Einstellungen</div>
          <div className={styles.logoSettingsBody}>
            <div className={styles.logoPreview} style={{ background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="ProCRM Logo" style={{ maxHeight: '36px', objectFit: 'contain' }} />
            </div>
            <div className={styles.logoUpload}>
              <h4>Neues gemeinsames Logo hochladen</h4>
              <div className={styles.uploadRow}>
                <input type="file" accept="image/png,image/jpeg" id="logoUpload" style={{ display: 'none' }} />
                <button className={styles.browseBtn} onClick={() => document.getElementById('logoUpload').click()}>Durchsuchen...</button>
                <span className={styles.fileName}>Keine Datei ausgewählt.</span>
              </div>
              <span className={styles.uploadHint}>PNG, max. 2MB, 240x80px empfohlen.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      {editTarget && (
        <div style={overlay}>
          <div style={modalBox}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={16} color="#7239ea" /> Unternehmen bearbeiten
              </h3>
              <button style={closeBtn} onClick={() => setEditTarget(null)}><X size={16} /></button>
            </div>
            <div style={modalBody}>
              <div style={group}><label style={label}>Unternehmensname</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div style={row2}>
                <div style={group}><label style={label}>USt-IdNr.</label><input style={inp} value={form.vat_number} onChange={e => setForm({ ...form, vat_number: e.target.value })} placeholder="DE 123456789" /></div>
                <div style={group}><label style={label}>Rechnungskürzel</label><input style={inp} value={form.invoice_prefix} onChange={e => setForm({ ...form, invoice_prefix: e.target.value })} placeholder="INV-HW" /></div>
              </div>
              <div style={row2}>
                <div style={group}><label style={label}>E-Mail</label><input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div style={group}><label style={label}>Telefon</label><input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div style={group}><label style={label}>Adresse</label><input style={inp} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Straße, Ort, PLZ..." /></div>
            </div>
            <div style={modalFooter}>
              <button style={cancelBtnS} onClick={() => setEditTarget(null)}>Abbrechen</button>
              <button style={saveBtnS} onClick={handleSave} disabled={saving}><Save size={14} />{saving ? 'Speichern...' : 'Änderungen speichern'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
