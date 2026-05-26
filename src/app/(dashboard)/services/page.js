'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import { supabase } from '@/utils/supabase';
import { Plus, Search, Edit3, Trash2, X, Settings } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Screed', 'Heating', 'Electrical', 'Insulation'];

const CATEGORY_COLORS = {
  Screed: '#d16b11',
  Heating: '#f1416c',
  Electrical: '#009ef7',
  Insulation: '#50cd89',
};

const EMPTY_FORM = { name: '', category: CATEGORIES[0], base_price: '' };

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#e2e8f0',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  titleIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #e2e8f0, #a0aec0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  filtersRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative',
    flex: '1',
    minWidth: '220px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '160px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '22px',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    borderRadius: '16px 16px 0 0',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#e2e8f0',
    margin: 0,
    lineHeight: 1.3,
    maxWidth: '200px',
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    border: '1px solid',
    whiteSpace: 'nowrap',
  },
  price: {
    fontSize: '24px',
    fontWeight: '800',
    marginTop: '8px',
    background: 'linear-gradient(135deg, #667eea, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  priceLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '18px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '14px',
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'opacity 0.15s, transform 0.15s',
  },
  editBtn: {
    background: 'rgba(102,126,234,0.15)',
    color: '#818cf8',
    border: '1px solid rgba(102,126,234,0.25)',
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.12)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 24px',
    color: '#475569',
  },
  emptyIcon: {
    marginBottom: '16px',
    opacity: 0.4,
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '6px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#475569',
  },
  // ─── Modal ────────────────────────────────────────────────────────────────
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(6px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    animation: 'fadeIn 0.15s ease',
  },
  modal: {
    background: 'linear-gradient(145deg, #1e1e35, #16213e)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    position: 'relative',
    animation: 'slideUp 0.2s ease',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '28px',
  },
  cancelBtn: {
    flex: 1,
    padding: '11px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  submitBtn: {
    flex: 2,
    padding: '11px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102,126,234,0.35)',
    transition: 'opacity 0.15s',
  },
  // ─── Delete dialog ────────────────────────────────────────────────────────
  deleteModal: {
    background: 'linear-gradient(145deg, #1e1e35, #16213e)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    textAlign: 'center',
    animation: 'slideUp 0.2s ease',
  },
  deleteTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f87171',
    marginBottom: '10px',
  },
  deleteText: {
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  deleteActions: {
    display: 'flex',
    gap: '10px',
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: '11px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(239,68,68,0.3)',
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '20px',
  },
  loadingWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px',
    color: '#64748b',
    fontSize: '15px',
    gap: '10px',
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatPrice(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return '—';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
}

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#94a3b8';
  return (
    <span
      style={{
        ...styles.badge,
        color,
        borderColor: `${color}55`,
        background: `${color}18`,
      }}
    >
      {category}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ServiceModal({ isOpen, onClose, onSave, initialData, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || EMPTY_FORM);
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isEdit = !!initialData?.id;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function validate() {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.category) return 'Category is required.';
    const price = parseFloat(form.base_price);
    if (isNaN(price) || price < 0) return 'Base price must be a valid positive number.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    await onSave({ ...form, base_price: parseFloat(form.base_price) });
  }

  const inputFocus = {
    borderColor: 'rgba(102,126,234,0.6)',
    boxShadow: '0 0 0 3px rgba(102,126,234,0.15)',
  };

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <div style={styles.modalTitle}>
          {isEdit ? <Edit3 size={20} color="#818cf8" /> : <Plus size={20} color="#818cf8" />}
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="svc-name">Service Name</label>
            <input
              id="svc-name"
              name="name"
              style={styles.input}
              placeholder="e.g. Floor Screed Installation"
              value={form.name}
              onChange={handleChange}
              onFocus={e => Object.assign(e.target.style, inputFocus)}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              autoComplete="off"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="svc-category">Category</label>
            <select
              id="svc-category"
              name="category"
              style={{ ...styles.input, cursor: 'pointer' }}
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} style={{ background: '#1e1e35' }}>{c}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="svc-price">Base Price (€)</label>
            <input
              id="svc-price"
              name="base_price"
              type="number"
              min="0"
              step="0.01"
              style={styles.input}
              placeholder="0.00"
              value={form.base_price}
              onChange={handleChange}
              onFocus={e => Object.assign(e.target.style, inputFocus)}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={styles.formActions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteDialog({ service, onClose, onConfirm, loading }) {
  if (!service) return null;
  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.deleteModal}>
        <Trash2 size={36} color="#f87171" style={{ marginBottom: '16px' }} />
        <div style={styles.deleteTitle}>Delete Service?</div>
        <div style={styles.deleteText}>
          You are about to permanently delete <strong style={{ color: '#e2e8f0' }}>{service.name}</strong>.
          This action cannot be undone.
        </div>
        <div style={styles.deleteActions}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...styles.confirmDeleteBtn, opacity: loading ? 0.7 : 1 }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setFetchError(error.message);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filtered = services.filter(s => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.name?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ── CRUD ───────────────────────────────────────────────────────────────────

  async function handleSave(form) {
    setModalLoading(true);
    if (form.id) {
      // Update
      const { error } = await supabase
        .from('services')
        .update({ name: form.name, category: form.category, base_price: form.base_price })
        .eq('id', form.id);
      if (!error) {
        setServices(prev =>
          prev.map(s => (s.id === form.id ? { ...s, ...form } : s))
        );
        setModalOpen(false);
        setEditService(null);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('services')
        .insert([{ name: form.name, category: form.category, base_price: form.base_price }])
        .select()
        .single();
      if (!error && data) {
        setServices(prev => [data, ...prev]);
        setModalOpen(false);
      }
    }
    setModalLoading(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const { error } = await supabase.from('services').delete().eq('id', deleteTarget.id);
    if (!error) {
      setServices(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
    setDeleteLoading(false);
  }

  function openAdd() {
    setEditService(null);
    setModalOpen(true);
  }

  function openEdit(service) {
    setEditService(service);
    setModalOpen(true);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={styles.page}>
        <Header />

        <div style={styles.content}>
          {/* Top bar */}
          <div style={styles.topBar}>
            <div style={styles.titleGroup}>
              <div style={styles.titleIcon}>
                <Settings size={22} color="#fff" />
              </div>
              <div>
                <h1 style={styles.title}>Services</h1>
                <p style={styles.subtitle}>{services.length} service{services.length !== 1 ? 's' : ''} registered</p>
              </div>
            </div>

            <button
              style={styles.addBtn}
              onClick={openAdd}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(102,126,234,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)'; }}
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>

          {/* Filters */}
          <div style={styles.filtersRow}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}><Search size={16} /></span>
              <input
                style={styles.searchInput}
                placeholder="Search by name or category…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={e => { e.target.style.borderColor = 'rgba(102,126,234,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <select
              style={styles.select}
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="" style={{ background: '#1e1e35' }}>All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c} style={{ background: '#1e1e35' }}>{c}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {fetchError && (
            <div style={styles.errorBanner}>
              Failed to load services: {fetchError}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={styles.loadingWrap}>
              <Settings size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Loading services…
            </div>
          )}

          {/* Grid */}
          {!loading && (
            filtered.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}><Settings size={56} /></div>
                <div style={styles.emptyText}>
                  {search || categoryFilter ? 'No services match your filters' : 'No services yet'}
                </div>
                <div style={styles.emptySubtext}>
                  {search || categoryFilter
                    ? 'Try adjusting your search or filter.'
                    : 'Click "Add Service" to create your first service.'}
                </div>
              </div>
            ) : (
              <div style={styles.grid}>
                {filtered.map(service => {
                  const accentColor = CATEGORY_COLORS[service.category] || '#667eea';
                  return (
                    <div
                      key={service.id}
                      style={styles.card}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3)`;
                        e.currentTarget.style.borderColor = `${accentColor}44`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      }}
                    >
                      {/* Top accent bar */}
                      <div style={{ ...styles.cardAccent, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />

                      <div style={styles.cardHeader}>
                        <h3 style={styles.cardName}>{service.name}</h3>
                        <CategoryBadge category={service.category} />
                      </div>

                      <div style={styles.price}>{formatPrice(service.base_price)}</div>
                      <div style={styles.priceLabel}>Base Price</div>

                      <div style={styles.cardActions}>
                        <button
                          style={{ ...styles.iconBtn, ...styles.editBtn }}
                          onClick={() => openEdit(service)}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(0.97)'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; }}
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          style={{ ...styles.iconBtn, ...styles.deleteBtn }}
                          onClick={() => setDeleteTarget(service)}
                          onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.transform = 'scale(0.97)'; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditService(null); }}
        onSave={handleSave}
        initialData={editService}
        loading={modalLoading}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        service={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </>
  );
}
