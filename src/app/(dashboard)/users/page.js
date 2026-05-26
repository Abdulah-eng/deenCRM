"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { Shield, Plus, Search, Filter, Edit3, Trash2, Users, X } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

// ─── Role helpers ────────────────────────────────────────────────────────────
const ROLES = ['admin', 'manager', 'sales', 'crew', 'finance'];
const COMPANIES = ['Screed Works', 'Heating Works', 'Electrical Works', 'All Companies'];

const ROLE_META = {
  admin:   { color: '#7239ea', bg: 'rgba(114,57,234,0.12)',  label: 'Admin' },
  manager: { color: '#009ef7', bg: 'rgba(0,158,247,0.12)',   label: 'Manager' },
  sales:   { color: '#50cd89', bg: 'rgba(80,205,137,0.12)',  label: 'Sales' },
  crew:    { color: '#ffc700', bg: 'rgba(255,199,0,0.12)',   label: 'Crew' },
  finance: { color: '#f1416c', bg: 'rgba(241,65,108,0.12)', label: 'Finance' },
};

function getRoleMeta(role) {
  return ROLE_META[role?.toLowerCase()] ?? { color: '#a1a5b7', bg: 'rgba(161,165,183,0.12)', label: role ?? '—' };
}

// ─── Blank form state ─────────────────────────────────────────────────────────
const BLANK_FORM = { full_name: '', email: '', role: 'sales', company: 'All Companies', status: 'ACTIVE' };

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
      <div style={{ ...modalStyle, width: '380px' }}>
        <div style={modalHeaderStyle}>
          <span style={modalTitleStyle}>Confirm Delete</span>
          <button style={modalCloseStyle} onClick={onCancel}><X size={18} /></button>
        </div>
        <div style={{ padding: '24px', fontSize: '14px', color: 'var(--header-text, #181c32)' }}>
          {message}
        </div>
        <div style={modalFooterStyle}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}
            style={{ background: '#f1416c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({ title, form, onChange, onSubmit, onClose, saving }) {
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
                <label style={formLabelStyle}>Full Name</label>
                <input
                  style={formInputStyle}
                  type="text"
                  placeholder="Enter full name"
                  value={form.full_name}
                  onChange={e => onChange('full_name', e.target.value)}
                  required
                />
              </div>
              {/* Email */}
              <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                <label style={formLabelStyle}>Email</label>
                <input
                  style={formInputStyle}
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={e => onChange('email', e.target.value)}
                  required
                />
              </div>
              {/* Role */}
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Role</label>
                <select
                  style={formInputStyle}
                  value={form.role}
                  onChange={e => onChange('role', e.target.value)}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
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
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              {/* Company */}
              <div style={{ ...formGroupStyle, gridColumn: '1 / -1' }}>
                <label style={formLabelStyle}>Company</label>
                <select
                  style={formInputStyle}
                  value={form.company}
                  onChange={e => onChange('company', e.target.value)}
                >
                  {COMPANIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div style={modalFooterStyle}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save User'}
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setUsers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

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
      email: user.email ?? '',
      role: (user.role ?? 'sales').toLowerCase(),
      company: user.company ?? 'All Companies',
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

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      role: form.role,
      company: form.company,
      status: form.status,
    };

    if (editingUser) {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingUser.id);
      if (!error) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...payload } : u));
      }
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        setUsers(prev => [data, ...prev]);
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
    }
    setDeleteTarget(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Header title="Users & Roles" subtitle="Users & Roles" />

      {/* Modals */}
      {modalOpen && (
        <UserModal
          title={editingUser ? 'Edit User' : 'Add New User'}
          form={form}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.full_name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>
              Manage system users, assign roles, and control access permissions.
            </p>
          </div>
          <div className={styles.headerRight}>
            <select
              className={styles.filterBtn}
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All Roles</option>
              {ROLES.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} style={{ marginRight: '8px' }} /> Add New User
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
              ), label: 'Sales' },
            { role: 'crew',    icon: <Users size={20} />,   label: 'Crew' },
            { role: 'finance', icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              ), label: 'Finance' },
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
              All System Users ({filtered.length})
            </div>
            <div className={styles.tableControls}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--body-text-muted)' }}>
                Loading users…
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>USER</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>COMPANY</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--body-text-muted)' }}>
                        No users found.
                      </td>
                    </tr>
                  ) : filtered.map((user, idx) => {
                    const meta = getRoleMeta(user.role);
                    const initial = (user.full_name ?? '?').charAt(0).toUpperCase();
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
                        <td><span className={styles.emailText}>{user.email}</span></td>
                        <td>
                          <span
                            className={styles.roleBadge}
                            style={{ color: meta.color, backgroundColor: meta.bg }}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td><span className={styles.companyText}>{user.company ?? '—'}</span></td>
                        <td>
                          <span className={`badge ${user.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.actionBtn}
                              title="Edit user"
                              onClick={() => openEdit(user)}
                            >
                              <Edit3 size={14} color="#009ef7" />
                            </button>
                            <button
                              className={styles.actionBtn}
                              title="Delete user"
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
