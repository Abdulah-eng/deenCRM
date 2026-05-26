"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { Plus, Search, Edit3, Trash2, Boxes, X } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const CATEGORIES = ['Screed Materials', 'Heating Components', 'Electrical Parts', 'General'];

const EMPTY_FORM = {
  name: '',
  email: '',
  contact: '',
  phone: '',
  city: '',
  category: 'General',
  rating: 3,
  status: 'ACTIVE',
};

// ─── Modal Styles ────────────────────────────────────────────────────────────
const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modal = {
  background: '#fff',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '560px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

const modalHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  borderBottom: '1px solid #e4e6ef',
};

const modalTitle = {
  fontSize: '17px',
  fontWeight: 700,
  color: '#1e1e2d',
  margin: 0,
};

const closeBtn = {
  background: '#f1f3fa',
  border: 'none',
  borderRadius: '6px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const modalBody = {
  padding: '24px',
};

const formGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const formGroupFull = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  gridColumn: '1 / -1',
};

const label = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#7e8299',
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
};

const input = {
  height: '38px',
  padding: '0 12px',
  border: '1px solid #e4e6ef',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#1e1e2d',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const select = {
  height: '38px',
  padding: '0 12px',
  border: '1px solid #e4e6ef',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#1e1e2d',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fff',
};

const modalFooter = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  padding: '16px 24px',
  borderTop: '1px solid #e4e6ef',
};

const cancelBtnStyle = {
  padding: '8px 20px',
  borderRadius: '6px',
  border: '1px solid #e4e6ef',
  background: '#fff',
  fontSize: '13px',
  fontWeight: 600,
  color: '#7e8299',
  cursor: 'pointer',
};

const saveBtnStyle = {
  padding: '8px 20px',
  borderRadius: '6px',
  border: 'none',
  background: '#7239ea',
  fontSize: '13px',
  fontWeight: 600,
  color: '#fff',
  cursor: 'pointer',
};

// ─── Confirm Dialog Styles ────────────────────────────────────────────────────
const confirmModal = {
  background: '#fff',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '380px',
  padding: '28px 24px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  textAlign: 'center',
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Confirm dialog state
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setSuppliers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name ?? '',
      email: supplier.email ?? '',
      contact: supplier.contact ?? '',
      phone: supplier.phone ?? '',
      city: supplier.city ?? '',
      category: supplier.category ?? 'General',
      rating: supplier.rating ?? 3,
      status: supplier.status ?? 'ACTIVE',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  // ── Save (Add / Edit) ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editingId) {
      await supabase.from('suppliers').update(form).eq('id', editingId);
    } else {
      await supabase.from('suppliers').insert([form]);
    }
    await fetchSuppliers();
    setSaving(false);
    closeModal();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await supabase.from('suppliers').delete().eq('id', confirmId);
    setSuppliers((prev) => prev.filter((s) => s.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
  };

  // ── Stars ──────────────────────────────────────────────────────────────────
  const renderStars = (rating) => (
    <span className={styles.starRating}>
      {'★'.repeat(rating)}
      <span className={styles.starEmpty}>{'★'.repeat(5 - rating)}</span>
    </span>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Header title="Suppliers" subtitle="Admin / Suppliers" />

      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Supplier Database</h2>
            <p className={styles.desc}>Manage all suppliers, their categories, and contact information.</p>
          </div>
          <button className={styles.addBtn} onClick={openAddModal}>
            <Plus size={16} /> Add Supplier
          </button>
        </div>

        {/* Table Card */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <Boxes size={16} color="#7239ea" /> All Suppliers ({filtered.length})
            </div>
            <div className={styles.tableActions}>
              {/* Search */}
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ ...select, width: '180px' }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>SUPPLIER</th>
                  <th>CONTACT</th>
                  <th>CITY</th>
                  <th>CATEGORY</th>
                  <th>RATING</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#a1a5b7', padding: '40px' }}>
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#a1a5b7', padding: '40px' }}>
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, index) => (
                    <tr key={s.id}>
                      <td style={{ color: '#a1a5b7' }}>{index + 1}</td>
                      <td>
                        <span className={styles.cellPrimary}>{s.name}</span>
                        <span className={styles.cellSecondary}>{s.email}</span>
                      </td>
                      <td>
                        <span className={styles.cellPrimary}>{s.contact}</span>
                        <span className={styles.cellSecondary}>{s.phone}</span>
                      </td>
                      <td><span className={styles.cellPrimary}>{s.city}</span></td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeCategory}`}>
                          {s.category}
                        </span>
                      </td>
                      <td>{renderStars(s.rating ?? 0)}</td>
                      <td>
                        <span className={`${styles.badge} ${s.status === 'ACTIVE' ? styles.badgeGreen : styles.badgeRed}`}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionWrapper}>
                          <button
                            className={styles.actionBtn}
                            title="Edit"
                            onClick={() => openEditModal(s)}
                          >
                            <Edit3 size={13} color="#7239ea" />
                          </button>
                          <button
                            className={styles.actionBtn}
                            title="Delete"
                            onClick={() => setConfirmId(s.id)}
                          >
                            <Trash2 size={13} color="#f1416c" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={modal}>
            {/* Header */}
            <div style={modalHeader}>
              <h3 style={modalTitle}>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button style={closeBtn} onClick={closeModal} aria-label="Close">
                <X size={16} color="#7e8299" />
              </button>
            </div>

            {/* Body */}
            <div style={modalBody}>
              <div style={formGrid}>
                <div style={formGroup}>
                  <label style={label}>Name *</label>
                  <input
                    style={input}
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Supplier name"
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Email</label>
                  <input
                    style={input}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Contact Person</label>
                  <input
                    style={input}
                    name="contact"
                    value={form.contact}
                    onChange={handleFormChange}
                    placeholder="Contact person name"
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Phone</label>
                  <input
                    style={input}
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>City</label>
                  <input
                    style={input}
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    placeholder="City"
                  />
                </div>
                <div style={formGroup}>
                  <label style={label}>Category</label>
                  <select style={select} name="category" value={form.category} onChange={handleFormChange}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={label}>Rating (1–5)</label>
                  <select style={select} name="rating" value={form.rating} onChange={handleFormChange}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
                    ))}
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={label}>Status</label>
                  <select style={select} name="status" value={form.status} onChange={handleFormChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={modalFooter}>
              <button style={cancelBtnStyle} onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button style={saveBtnStyle} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────────── */}
      {confirmId && (
        <div style={overlay} onClick={(e) => e.target === e.currentTarget && setConfirmId(null)}>
          <div style={confirmModal}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(241,65,108,0.1)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <Trash2 size={22} color="#f1416c" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#1e1e2d' }}>
                Delete Supplier?
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#7e8299' }}>
                This action cannot be undone. The supplier will be permanently removed from the database.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={cancelBtnStyle} onClick={() => setConfirmId(null)} disabled={deleting}>
                Cancel
              </button>
              <button
                style={{ ...saveBtnStyle, background: '#f1416c' }}
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
