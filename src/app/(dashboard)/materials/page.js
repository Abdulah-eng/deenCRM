"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import {
  Plus, Search, Edit3, Trash2, CheckCircle2, PackageSearch, X, AlertTriangle,
} from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Screed', 'Heating', 'Electrical', 'Insulation'];
const UNITS = ['m²', 'kg', 'm', 'pcs', 'L'];
const STOCK_OPTIONS = ['IN STOCK', 'LOW STOCK', 'OUT OF STOCK'];
const BEST_PRICE_OPTIONS = ['A', 'B', 'C'];

const EMPTY_FORM = {
  sku: '',
  name: '',
  supplier_name: '',
  category: 'Screed',
  unit: 'm²',
  price_a: '',
  price_b: '',
  price_c: '',
  best_price: 'A',
  stock: 'IN STOCK',
};

// ─── Inline Modal Styles ──────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, padding: '16px',
};

const modalStyle = {
  background: '#fff', borderRadius: '12px',
  width: '100%', maxWidth: '680px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
  display: 'flex', flexDirection: 'column', maxHeight: '90vh',
};

const modalHeaderStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '20px 24px', borderBottom: '1px solid #e4e6ef',
};

const modalBodyStyle = {
  padding: '24px', overflowY: 'auto', flex: 1,
};

const modalFooterStyle = {
  display: 'flex', justifyContent: 'flex-end', gap: '12px',
  padding: '16px 24px', borderTop: '1px solid #e4e6ef',
};

const formGridStyle = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
};

const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };

const labelStyle = {
  fontSize: '12px', fontWeight: '600', color: '#5e6278', textTransform: 'uppercase', letterSpacing: '0.4px',
};

const inputStyle = {
  height: '38px', padding: '0 12px', border: '1px solid #e4e6ef',
  borderRadius: '6px', fontSize: '13px', outline: 'none', width: '100%',
  boxSizing: 'border-box', color: 'var(--text-color)',
};

const saveBtnStyle = {
  background: '#7239ea', color: '#fff', border: 'none',
  padding: '9px 20px', borderRadius: '6px', fontSize: '14px',
  fontWeight: '600', cursor: 'pointer',
};

const cancelBtnStyle = {
  background: '#f5f8fa', color: '#5e6278', border: '1px solid #e4e6ef',
  padding: '9px 20px', borderRadius: '6px', fontSize: '14px',
  fontWeight: '600', cursor: 'pointer',
};

const deleteBtnStyle = {
  background: '#f1416c', color: '#fff', border: 'none',
  padding: '9px 20px', borderRadius: '6px', fontSize: '14px',
  fontWeight: '600', cursor: 'pointer',
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const fmt = (v) => (v != null && v !== '' ? `€ ${Number(v).toFixed(2)}` : '—');

// ─── Component ────────────────────────────────────────────────────────────────
export default function MaterialsPage() {
  const [materials, setMaterials]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Modal state
  const [showModal, setShowModal]   = useState(false);
  const [editId, setEditId]         = useState(null);   // null = add mode
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setMaterials(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMaterials(); }, [fetchMaterials]);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = materials.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      (m.name || '').toLowerCase().includes(q) ||
      (m.sku || '').toLowerCase().includes(q) ||
      (m.supplier_name || '').toLowerCase().includes(q);
    const matchCat   = catFilter   === 'All' || m.category === catFilter;
    const matchStock = stockFilter === 'All' || m.stock    === stockFilter;
    return matchSearch && matchCat && matchStock;
  });

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditId(m.id);
    setForm({
      sku:           m.sku           ?? '',
      name:          m.name          ?? '',
      supplier_name: m.supplier_name ?? '',
      category:      m.category      ?? 'Screed',
      unit:          m.unit          ?? 'm²',
      price_a:       m.price_a       ?? '',
      price_b:       m.price_b       ?? '',
      price_c:       m.price_c       ?? '',
      best_price:    m.best_price    ?? 'A',
      stock:         m.stock         ?? 'IN STOCK',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditId(null); };

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ── Save (insert / update) ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Material name is required.'); return; }
    if (!form.sku.trim())  { setFormError('SKU is required.'); return; }
    setFormError('');
    setSaving(true);

    const payload = {
      sku:           form.sku.trim(),
      name:          form.name.trim(),
      supplier_name: form.supplier_name.trim(),
      category:      form.category,
      unit:          form.unit,
      price_a:       form.price_a !== '' ? Number(form.price_a) : null,
      price_b:       form.price_b !== '' ? Number(form.price_b) : null,
      price_c:       form.price_c !== '' ? Number(form.price_c) : null,
      best_price:    form.best_price,
      stock:         form.stock,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from('materials').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('materials').insert(payload));
    }

    setSaving(false);
    if (error) { setFormError(error.message); return; }
    closeModal();
    fetchMaterials();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('materials').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (!error) fetchMaterials();
  };

  // ── Price cell render ──────────────────────────────────────────────────────
  const PriceCell = ({ value, isBest }) => (
    <span className={`${styles.priceCell} ${isBest ? styles.bestPrice : ''}`}>
      {fmt(value)}
      {isBest && <CheckCircle2 size={13} style={{ marginLeft: 4 }} />}
    </span>
  );

  // ── Stock badge ────────────────────────────────────────────────────────────
  const stockClass = (stock) => {
    if (stock === 'IN STOCK')  return `${styles.stockBadge} ${styles.stockIn}`;
    if (stock === 'LOW STOCK') return `${styles.stockBadge} ${styles.stockLow}`;
    return `${styles.stockBadge} ${styles.stockOut}`;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Header title="Materials" subtitle="Admin / Materials" />

      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Material Database</h2>
            <p className={styles.desc}>Track all materials with supplier-specific pricing and stock levels.</p>
          </div>
          <button className={styles.addBtn} onClick={openAdd}>
            <Plus size={16} /> Add Material
          </button>
        </div>

        {/* Table Card */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <PackageSearch size={16} color="#7239ea" />
              All Materials ({filtered.length})
            </div>
            <div className={styles.tableActions}>
              {/* Search */}
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name, SKU, supplier…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Category filter */}
              <select
                className={styles.filterSelect}
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {/* Stock filter */}
              <select
                className={styles.filterSelect}
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="All">All Stock</option>
                {STOCK_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.tableContainer}>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--body-text-muted)' }}>
                Loading materials…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--body-text-muted)' }}>
                No materials found.
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>MATERIAL / SUPPLIER</th>
                    <th>CATEGORY</th>
                    <th>UNIT</th>
                    <th>PRICE A</th>
                    <th>PRICE B</th>
                    <th>PRICE C</th>
                    <th>STOCK</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id}>
                      <td><span className={styles.skuText}>{m.sku}</span></td>
                      <td>
                        <span className={styles.cellPrimary}>{m.name}</span>
                        <span className={styles.cellSecondary}>{m.supplier_name}</span>
                      </td>
                      <td><span className={styles.cellPrimary}>{m.category}</span></td>
                      <td><span className={styles.cellPrimary}>{m.unit}</span></td>
                      <td><PriceCell value={m.price_a} isBest={m.best_price === 'A'} /></td>
                      <td><PriceCell value={m.price_b} isBest={m.best_price === 'B'} /></td>
                      <td><PriceCell value={m.price_c} isBest={m.best_price === 'C'} /></td>
                      <td><span className={stockClass(m.stock)}>{m.stock}</span></td>
                      <td>
                        <div className={styles.actionWrapper}>
                          <button
                            className={styles.actionBtn}
                            title="Edit"
                            onClick={() => openEdit(m)}
                          >
                            <Edit3 size={13} color="#7239ea" />
                          </button>
                          <button
                            className={styles.actionBtn}
                            title="Delete"
                            onClick={() => setDeleteTarget({ id: m.id, name: m.name })}
                          >
                            <Trash2 size={13} color="#f1416c" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            {/* Header */}
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-color)' }}>
                {editId ? 'Edit Material' : 'Add Material'}
              </h3>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a5b7', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={modalBodyStyle}>
              {formError && (
                <div style={{
                  background: 'rgba(241,65,108,0.08)', border: '1px solid rgba(241,65,108,0.3)',
                  color: '#f1416c', borderRadius: '6px', padding: '10px 14px',
                  fontSize: '13px', marginBottom: '16px',
                }}>
                  {formError}
                </div>
              )}

              <div style={formGridStyle}>
                {/* SKU */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>SKU *</label>
                  <input style={inputStyle} name="sku" value={form.sku} onChange={handleField} placeholder="e.g. MAT-001" />
                </div>

                {/* Name */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Material Name *</label>
                  <input style={inputStyle} name="name" value={form.name} onChange={handleField} placeholder="e.g. Anhydrite Screed" />
                </div>

                {/* Supplier */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Supplier Name</label>
                  <input style={inputStyle} name="supplier_name" value={form.supplier_name} onChange={handleField} placeholder="e.g. BauChemie GmbH" />
                </div>

                {/* Category */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} name="category" value={form.category} onChange={handleField}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Unit */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Unit</label>
                  <select style={inputStyle} name="unit" value={form.unit} onChange={handleField}>
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                {/* Stock */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Stock Status</label>
                  <select style={inputStyle} name="stock" value={form.stock} onChange={handleField}>
                    {STOCK_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Price A */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Price A (€)</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" name="price_a" value={form.price_a} onChange={handleField} placeholder="0.00" />
                </div>

                {/* Price B */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Price B (€)</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" name="price_b" value={form.price_b} onChange={handleField} placeholder="0.00" />
                </div>

                {/* Price C */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Price C (€)</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" name="price_c" value={form.price_c} onChange={handleField} placeholder="0.00" />
                </div>

                {/* Best Price */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Best Price</label>
                  <select style={inputStyle} name="best_price" value={form.best_price} onChange={handleField}>
                    {BEST_PRICE_OPTIONS.map((p) => <option key={p} value={p}>Price {p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={modalFooterStyle}>
              <button style={cancelBtnStyle} onClick={closeModal} disabled={saving}>Cancel</button>
              <button style={saveBtnStyle} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editId ? '✓ Save Changes' : '✓ Add Material'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      {deleteTarget && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, maxWidth: '420px' }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f1416c', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} /> Delete Material
              </h3>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a1a5b7', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ ...modalBodyStyle, padding: '24px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-color)', lineHeight: 1.6 }}>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div style={modalFooterStyle}>
              <button style={cancelBtnStyle} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button style={deleteBtnStyle} onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
