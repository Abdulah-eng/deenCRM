"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { Shield, Plus, Search, Filter, Edit3, Trash2, Users, X } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

// ─── Role helpers ────────────────────────────────────────────────────────────
const ROLES = ['admin', 'manager', 'sales', 'crew', 'finance'];

const ROLE_META = {
  admin:   { color: '#7239ea', bg: 'rgba(114,57,234,0.12)',  label: 'Admin' },
  manager: { color: '#009ef7', bg: 'rgba(0,158,247,0.12)',   label: 'Manager' },
  sales:   { color: '#50cd89', bg: 'rgba(80,205,137,0.12)',  label: 'Vertrieb' },
  crew:    { color: '#ffc700', bg: 'rgba(255,199,0,0.12)',   label: 'Team' },
  finance: { color: '#f1416c', bg: 'rgba(241,65,108,0.12)', label: 'Finanzen' },
};

function getRoleMeta(role) {
  const r = role?.toLowerCase();
  return ROLE_META[r] ?? { color: '#a1a5b7', bg: 'rgba(161,165,183,0.12)', label: role ?? '—' };
}

// ─── Blank form state ─────────────────────────────────────────────────────────
const BLANK_FORM = { full_name: '', email: '', role: 'sales', company_id: '', status: 'ACTIVE' };

// ─── Overlay / Modal styles (inline, no CSS module needed) ────────────────────
const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999,
};
const modalStyle = {
  background: 'var(--card-bg, #fff)',
  borderRadius: '12px',
  width: '520px',
  maxWidth: '95vw',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  overflow: 'hidden',
};
const modalHeaderStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: '1px solid var(--card-border, #e9ecef)',
};
const modalTitleStyle = { fontSize: '16px', fontWeight: 700, color: 'var(--header-text, #181c32)' };
const modalCloseStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--body-text-muted, #a1a5b7)', display: 'flex', padding: '4px',
};
const modalBodyStyle = { padding: '24px' };
const formGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const formLabelStyle = { fontSize: '12px', fontWeight: 600, color: 'var(--body-text-muted, #a1a5b7)', textTransform: 'uppercase', letterSpacing: '0.5px' };
const formInputStyle = {
  height: '38px', border: '1px solid var(--card-border, #e9ecef)',
  borderRadius: '6px', padding: '0 12px', fontSize: '13px',
  background: 'var(--body-bg, #f5f8fa)', outline: 'none',
  color: 'var(--header-text, #181c32)', width: '100%', boxSizing: 'border-box',
};
const modalFooterStyle = {
  display: 'flex', gap: '12px', justifyContent: 'flex-end',
  padding: '16px 24px', borderTop: '1px solid var(--card-border, #e9ecef)',
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, width: '400px' }}>
        <div style={modalHeaderStyle}>
          <span style={modalTitleStyle}>Löschen bestätigen</span>
          <button style={modalCloseStyle} onClick={onCancel}><X size={18} /></button>
        </div>
        <div style={{ padding: '24px', fontSize: '14px', color: 'var(--header-text, #181c32)' }}>
          {message}
        </div>
        <div style={modalFooterStyle}>
          <button className="btn btn-secondary" onClick={onCancel}>Abbrechen</button>
          <button className="btn btn-danger" onClick={onConfirm}
            style={{ background: '#f1416c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({ title, form, onChange, onSubmit, onClose, saving, dbCompanies }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <span style={modalTitleStyle}>{title}</span>
          <button style={modalCloseStyle} onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit}>
          <div style={modalBodyStyle}>
            <div style={formGridStyle}>
              {/* Full Name */}
              <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                <label style={formLabelStyle}>Vollständiger Name</label>
                <input
                  style={formInputStyle}
                  type="text"
                  placeholder="Vollständigen Namen eingeben"
                  value={form.full_name}
                  onChange={e => onChange('full_name', e.target.value)}
                  required
                />
              </div>
              {/* Email */}
              <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                <label style={formLabelStyle}>E-Mail-Adresse</label>
                <input
                  style={formInputStyle}
                  type="email"
                  placeholder="E-Mail-Adresse eingeben"
                  value={form.email}
                  onChange={e => onChange('email', e.target.value)}
                  required
                />
              </div>
              {/* Role */}
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Rolle</label>
                <select
                  style={formInputStyle}
                  value={form.role}
                  onChange={e => onChange('role', e.target.value)}
                >
                  {ROLES.map(r => {
                    const labelMap = { admin: 'Admin', manager: 'Manager', sales: 'Vertrieb', crew: 'Team', finance: 'Finanzen' };
                    return (
                      <option key={r} value={r}>{labelMap[r] || r}</option>
                    );
                  })}
                </select>
              </div>
              {/* Status */}
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Status</label>
                <select
                  style={formInputStyle}
                  value={form.status}
                  onChange={e => onChange('status', e.target.value)}
                >
                  <option value="ACTIVE">Aktiv</option>
                  <option value="INACTIVE">Inaktiv</option>
                </select>
              </div>
              {/* Company */}
              <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                <label style={formLabelStyle}>Unternehmen</label>
                <select
                  style={formInputStyle}
                  value={form.company_id}
                  onChange={e => onChange('company_id', e.target.value)}
                >
                  <option value="">Alle Unternehmen</option>
                  {dbCompanies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div style={modalFooterStyle}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Abbrechen
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Speichern…' : 'Benutzer speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [dbCompanies, setDbCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = add mode
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    // Fetch users joined with companies
    const { data, error } = await supabase
      .from('profiles')
      .select('*, companies(id, name)')
      .order('created_at', { ascending: false });
    if (!error) setUsers(data ?? []);
    setLoading(false);
  }, []);

  const fetchCompanies = useCallback(async () => {
    const { data } = await supabase.from('companies').select('id, name');
    if (data) setDbCompanies(data);
  }, []);

  useEffect(() => { 
    fetchUsers(); 
    fetchCompanies();
  }, [fetchUsers, fetchCompanies]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || (u.role ?? '').toLowerCase() === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Stats ──────────────────────────────────────────────────────────────────
  const countRole = role => users.filter(u => (u.role ?? '').toLowerCase() === role).length;

  // ── Modal helpers ──────────────────────────────────────────────────────────
  function openAdd() {
    setEditingUser(null);
    setForm(BLANK_FORM);
    setModalOpen(true);
  }

  function openEdit(user) {
    setEditingUser(user);
    setForm({
      full_name: user.full_name ?? '',
      email: user.email ?? `${user.full_name?.toLowerCase().replace(/\s+/g, '.')}@procrm.de`,
      role: (user.role ?? 'sales').toLowerCase(),
      company_id: user.company_id ?? '',
      status: user.status ?? 'ACTIVE',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingUser(null);
    setForm(BLANK_FORM);
  }

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // ── Submit (add / edit) ────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const selectedComp = dbCompanies.find(c => c.id === form.company_id);
    const payload = {
      full_name: form.full_name.trim(),
      role: form.role,
      company_id: form.company_id || null,
      company: selectedComp ? selectedComp.name : 'Alle Unternehmen',
      status: form.status,
      email: form.email.trim(),
    };

    if (editingUser) {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingUser.id);
      if (!error) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...payload, companies: selectedComp ? { id: selectedComp.id, name: selectedComp.name } : null } : u));
      } else {
        alert("Fehler beim Aktualisieren: " + error.message);
      }
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .insert([payload])
        .select('*, companies(id, name)')
        .single();
      if (!error && data) {
        setUsers(prev => [data, ...prev]);
      } else {
        alert("Fehler beim Erstellen: " + error.message);
      }
    }

    setSaving(false);
    closeModal();
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  function promptDelete(user) { setDeleteTarget(user); }
  function cancelDelete()    { setDeleteTarget(null); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', deleteTarget.id);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    } else {
      alert("Fehler beim Löschen: " + error.message);
    }
    setDeleteTarget(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Header title="Benutzer & Rollen" subtitle="Benutzer & Rollen" />

      {/* Modals */}
      {modalOpen && (
        <UserModal
          title={editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer hinzufügen'}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          saving={saving}
          dbCompanies={dbCompanies}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          message={`Sind Sie sicher, dass Sie den Benutzer "${deleteTarget.full_name}" löschen möchten? Dies kann nicht rückgängig gemacht werden.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>
              Systembenutzer verwalten, Rollen zuweisen und Zugriffsberechtigungen steuern.
            </p>
          </div>
          <div className={styles.headerRight}>
            <select
              className={styles.filterBtn}
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">Alle Rollen</option>
              {ROLES.map(r => {
                const labelMap = { admin: 'Admin', manager: 'Manager', sales: 'Vertrieb', crew: 'Team', finance: 'Finanzen' };
                return (
                  <option key={r} value={r}>{labelMap[r] || r}</option>
                );
              })}
            </select>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} style={{ marginRight: '8px' }} /> Neuen Benutzer hinzufügen
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {[
            { role: 'admin',   icon: <Shield size={20} />,  label: 'Admin' },
            { role: 'manager', icon: <Users size={20} />,   label: 'Manager' },
            { role: 'sales',   icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              ), label: 'Vertrieb' },
            { role: 'crew',    icon: <Users size={20} />,   label: 'Team' },
            { role: 'finance', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              ), label: 'Finanzen' },
          ].map(({ role, icon, label }) => {
            const meta = getRoleMeta(role);
            return (
              <div className={styles.statCard} key={role}>
                <div className={styles.statIcon} style={{ color: meta.color, backgroundColor: meta.bg }}>
                  {icon}
                </div>
                <h3>{countRole(role)}</h3>
                <p>{label}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <Users size={16} />
              Alle Systembenutzer ({filtered.length})
            </div>
            <div className={styles.tableControls}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Benutzer suchen…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--body-text-muted)' }}>
                Benutzer werden geladen…
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>BENUTZER</th>
                    <th>E-MAIL</th>
                    <th>ROLLE</th>
                    <th>UNTERNEHMEN</th>
                    <th>STATUS</th>
                    <th>AKTIONEN</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--body-text-muted)' }}>
                        Keine Benutzer gefunden.
                      </td>
                    </tr>
                  ) : filtered.map((user, idx) => {
                    const meta = getRoleMeta(user.role);
                    const initial = (user.full_name ?? '?').charAt(0).toUpperCase();
                    // Fallback email generation if null
                    const displayEmail = user.email || `${user.full_name?.toLowerCase().replace(/\s+/g, '.')}@procrm.de`;
                    const companyDisplay = user.companies?.name || 'Alle Unternehmen';
                    return (
                      <tr key={user.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userAvatar} style={{ backgroundColor: meta.color }}>
                              {initial}
                            </div>
                            <div className={styles.userInfo}>
                              <span className={styles.userName}>{user.full_name}</span>
                              <span className={styles.userId}>ID: {user.id?.slice(0, 8)}…</span>
                            </div>
                          </div>
                        </td>
                        <td><span className={styles.emailText}>{displayEmail}</span></td>
                        <td>
                          <span
                            className={styles.roleBadge}
                            style={{ color: meta.color, backgroundColor: meta.bg }}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td><span className={styles.companyText}>{companyDisplay}</span></td>
                        <td>
                          <span className={`badge ${user.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                            {user.status === 'ACTIVE' ? 'AKTIV' : 'INAKTIV'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.actionBtn}
                              title="Benutzer bearbeiten"
                              onClick={() => openEdit(user)}
                            >
                              <Edit3 size={14} color="#009ef7" />
                            </button>
                            <button
                              className={styles.actionBtn}
                              title="Benutzer löschen"
                              onClick={() => promptDelete(user)}
                            >
                              <Trash2 size={14} color="#f1416c" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
