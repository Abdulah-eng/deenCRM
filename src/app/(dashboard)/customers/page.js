"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Plus, Users, Search, Edit3, Trash2, X } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const EMPTY_FORM = { name: '', email: '', contact: '', phone: '', city: '', vat13b: false, assigned_company: 'All', status: 'ACTIVE' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (data) setCustomers(data);
    if (error) console.error(error);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditTarget(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, email: c.email, contact: c.contact, phone: c.phone, city: c.city, vat13b: c.vat13b, assigned_company: c.assigned_company || 'All', status: c.status }); setEditTarget(c.id); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    if (editTarget) {
      await supabase.from('customers').update(form).eq('id', editTarget);
    } else {
      await supabase.from('customers').insert([form]);
    }
    setSaving(false);
    setShowModal(false);
    fetchCustomers();
  };

  const handleDelete = async () => {
    await supabase.from('customers').delete().eq('id', deleteTarget);
    setCustomers(prev => prev.filter(c => c.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const filtered = customers.filter(c => {
    const matchSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase());
    const matchCompany = companyFilter === 'All' || c.assigned_company === companyFilter;
    return matchSearch && matchCompany;
  });

  const active = customers.filter(c => c.status === 'ACTIVE').length;
  const exempt = customers.filter(c => c.vat13b).length;

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)', padding: 24 };
  const modalBox = { background: 'var(--card-bg)', borderRadius: 16, width: '100%', maxWidth: 560, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', overflow: 'hidden' };
  const modalHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--card-border)', background: 'linear-gradient(135deg, rgba(114,57,234,0.06), rgba(114,57,234,0.02))' };
  const modalBody = { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '60vh', overflowY: 'auto' };
  const modalFooter = { display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '14px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' };
  const row = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
  const group = { display: 'flex', flexDirection: 'column', gap: 5 };
  const label = { fontSize: 11, fontWeight: 700, color: 'var(--body-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' };
  const input = { width: '100%', padding: '9px 12px', border: '1.5px solid var(--card-border)', borderRadius: 8, background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
  const closeBtn = { width: 32, height: 32, borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--body-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
  const cancelBtnStyle = { padding: '9px 18px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--body-text)', fontSize: 13, cursor: 'pointer' };
  const saveBtnStyle = { padding: '9px 18px', borderRadius: 8, border: 'none', background: '#7239ea', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' };

  return (
    <>
      <Header title="Customers" subtitle="Admin / Customers" />
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Customer Database</h2>
            <p className={styles.desc}>Manage customers with VAT §13b status and company assignments.</p>
          </div>
          <button className={styles.addBtn} onClick={openAdd}><Plus size={16} /> Add Customer</button>
        </div>

        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}><div className={styles.kpiValue} style={{ color: '#7239ea' }}>{customers.length}</div><div className={styles.kpiLabel}>Total Customers</div></div>
          <div className={styles.kpiCard}><div className={styles.kpiValue} style={{ color: '#50cd89' }}>{active}</div><div className={styles.kpiLabel}>Active</div></div>
          <div className={styles.kpiCard}><div className={styles.kpiValue} style={{ color: '#f59e0b' }}>{exempt}</div><div className={styles.kpiLabel}>§13b Exempt</div></div>
          <div className={styles.kpiCard}><div className={styles.kpiValue} style={{ color: '#7239ea' }}>{customers.length}</div><div className={styles.kpiLabel}>Total Listed</div></div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><Users size={16} color="#7239ea" /> All Customers ({filtered.length})</div>
            <div className={styles.tableActions}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className={styles.companySelect} value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
                <option value="All">All Companies</option>
                <option value="Heating">Heating Works</option>
                <option value="Screed">Screed Works</option>
                <option value="Electrical">Electrical Works</option>
              </select>
            </div>
          </div>
          <div className={styles.tableContainer}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--body-text-muted)' }}>Loading customers...</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>COMPANY NAME</th>
                    <th>CONTACT</th>
                    <th>CITY</th>
                    <th>§13B VAT</th>
                    <th>ASSIGNED TO</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && <tr><td colSpan="8" style={{ textAlign: 'center', padding: 20, color: 'var(--body-text-muted)' }}>No customers found.</td></tr>}
                  {filtered.map((c, index) => (
                    <tr key={c.id}>
                      <td style={{ color: '#a1a5b7' }}>{index + 1}.</td>
                      <td><span className={styles.cellPrimary}>{c.name}</span><span className={styles.cellSecondary}>{c.email}</span></td>
                      <td><span className={styles.cellPrimary}>{c.contact}</span><span className={styles.cellSecondary}>{c.phone}</span></td>
                      <td><span className={styles.cellPrimary}>{c.city}</span></td>
                      <td>
                        <span className={`${styles.badge} ${c.vat13b ? styles.badgeYellow : styles.badgeGray}`}>
                          {c.vat13b ? '§13B EXEMPT' : 'STANDARD VAT'}
                        </span>
                      </td>
                      <td><span className={styles.cellPrimary}>{c.assigned_company || '—'}</span></td>
                      <td>
                        <span className={c.status === 'ACTIVE' ? styles.badgeGreen : styles.badgeRed}>{c.status}</span>
                      </td>
                      <td>
                        <div className={styles.actionWrapper}>
                          <button className={styles.actionBtn} onClick={() => openEdit(c)}><Edit3 size={13} color="#7239ea" /></button>
                          <button className={styles.actionBtn} onClick={() => setDeleteTarget(c.id)}><Trash2 size={13} color="#f1416c" /></button>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={overlay}>
          <div style={modalBox}>
            <div style={modalHeader}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={16} color="#7239ea" /> {editTarget ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button style={closeBtn} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div style={modalBody}>
              <div style={row}>
                <div style={group}><label style={label}>Company Name *</label><input style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Company name..." /></div>
                <div style={group}><label style={label}>Email</label><input style={input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@company.de" /></div>
              </div>
              <div style={row}>
                <div style={group}><label style={label}>Contact Person</label><input style={input} value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Full name..." /></div>
                <div style={group}><label style={label}>Phone</label><input style={input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+49 89 ..." /></div>
              </div>
              <div style={row}>
                <div style={group}><label style={label}>City</label><input style={input} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Munich..." /></div>
                <div style={group}><label style={label}>Assigned Company</label>
                  <select style={input} value={form.assigned_company} onChange={e => setForm({ ...form, assigned_company: e.target.value })}>
                    <option value="All">All Companies</option>
                    <option value="Heating">Heating Works</option>
                    <option value="Screed">Screed Works</option>
                    <option value="Electrical">Electrical Works</option>
                  </select>
                </div>
              </div>
              <div style={row}>
                <div style={group}><label style={label}>§13b VAT Exempt</label>
                  <select style={input} value={form.vat13b} onChange={e => setForm({ ...form, vat13b: e.target.value === 'true' })}>
                    <option value="false">No (Standard VAT 19%)</option>
                    <option value="true">Yes (§13b Exempt)</option>
                  </select>
                </div>
                <div style={group}><label style={label}>Status</label>
                  <select style={input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={modalFooter}>
              <button style={cancelBtnStyle} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={saveBtnStyle} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : (editTarget ? 'Save Changes' : 'Add Customer')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div style={overlay}>
          <div style={{ ...modalBox, maxWidth: 380, padding: 36, textAlign: 'center' }}>
            <Trash2 size={48} color="#f1416c" style={{ marginBottom: 16 }} />
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Delete Customer?</h3>
            <p style={{ color: 'var(--body-text-muted)', marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button style={cancelBtnStyle} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button style={{ ...saveBtnStyle, background: '#f1416c' }} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
