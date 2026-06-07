"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { AlertCircle, Plus, Search, Eye, Wrench, Trash2, X, ClipboardList } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const STATUS_COLORS = {
  'SCHEDULED':   { bg: 'rgba(114,57,234,0.12)', color: '#7239ea' },
  'IN PROGRESS': { bg: 'rgba(0,158,247,0.12)',  color: '#009ef7' },
  'NEW':         { bg: 'rgba(255,199,0,0.12)',   color: '#d16b11' },
  'RESOLVED':    { bg: 'rgba(80,205,137,0.12)',  color: '#50cd89' },
};

export default function Complaints() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form States & Order Lookup Data
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('');
  const [formCause, setFormCause] = useState('');
  const [formReportedDate, setFormReportedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCostImpact, setFormCostImpact] = useState('0.00');
  const [formIssue, setFormIssue] = useState('');
  const [formSolution, setFormSolution] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      // 1. Fetch complaints
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          orders (
            display_id,
            type,
            customers (name),
            crews (name)
          )
        `)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setList(data);
      }

      // 2. Fetch orders
      const { data: ords } = await supabase
        .from('orders')
        .select('id, display_id, type, customers(name)');
      if (ords) {
        setOrders(ords);
      }

      setLoading(false);
    }
    fetchInitialData();
  }, []);

  const handleOrderChange = (orderId) => {
    setSelectedOrderId(orderId);
    if (!orderId) {
      setCustomerName('');
      setOrderType('');
      return;
    }
    const o = orders.find(ord => ord.id === orderId);
    if (o) {
      setCustomerName(o.customers?.name || 'Unbekannt');
      setOrderType(o.type || '—');
    } else {
      setCustomerName('');
      setOrderType('');
    }
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase.from('complaints').delete().eq('id', deleteTarget);
      if (error) throw error;
      setList(prev => prev.filter(c => c.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
      alert("Fehler beim Löschen der Reklamation: " + e.message);
    }
  };

  const handleSaveComplaint = async () => {
    if (!selectedOrderId || !formCause || !formIssue) {
      alert("Bitte Originalauftrag, Grund und Beschreibung angeben.");
      return;
    }
    setSaving(true);
    try {
      const randomDigits = Math.floor(100 + Math.random() * 900);
      const displayId = `CMP-2026-${randomDigits}`;

      const complaintData = {
        display_id: displayId,
        order_id: selectedOrderId,
        cause: formCause,
        issue_description: formIssue,
        proposed_solution: formSolution || null,
        status: 'NEW',
        reported_date: formReportedDate || new Date().toISOString().split('T')[0],
        cost_impact: Number(formCostImpact) || 0
      };

      const { error } = await supabase
        .from('complaints')
        .insert([complaintData]);

      if (error) throw error;

      alert('Reklamation erfolgreich erfasst!');
      setShowModal(false);
      
      // Refresh list
      const { data: refComplaints } = await supabase
        .from('complaints')
        .select(`
          *,
          orders (
            display_id,
            type,
            customers (name),
            crews (name)
          )
        `)
        .order('created_at', { ascending: false });
      if (refComplaints) setList(refComplaints);
      
      // Reset form
      setSelectedOrderId('');
      setCustomerName('');
      setOrderType('');
      setFormCause('');
      setFormReportedDate(new Date().toISOString().split('T')[0]);
      setFormCostImpact('0.00');
      setFormIssue('');
      setFormSolution('');
    } catch (err) {
      console.error(err);
      alert("Fehler beim Erfassen der Reklamation: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalImpact = list.reduce((sum, c) => sum + (Number(c.cost_impact) || 0), 0);

  return (
    <>
      <Header title="Complaints" subtitle="Complaints" />
      <div className={styles.container}>

        {/* Warning banner */}
        <div className={styles.warningBanner}>
          <AlertCircle size={16} color="#d16b11" />
          <span>
            <strong>{list.length} open complaints</strong> — Total impact on margins:{' '}
            <strong>€ {totalImpact.toLocaleString()}</strong>.
            Complaint orders reduce profit of the original orders.
          </span>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <AlertCircle size={16} color="#f1416c" /> All Complaints
            </div>
            <div className={styles.tableActions}>
              <div className={styles.searchBox}>
                <Search size={13} color="#a1a5b7" />
                <input type="text" placeholder="Search complaints..." />
              </div>
              <button className={`btn btn-primary ${styles.newBtn}`} onClick={() => setShowModal(true)}>
                <Plus size={14} style={{ marginRight: 6 }} /> New Complaint
              </button>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Loading complaints...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>COMPLAINT #</th>
                    <th>ORIGINAL ORDER</th>
                    <th>CUSTOMER</th>
                    <th>TYPE</th>
                    <th>CAUSE</th>
                    <th>ISSUE DESCRIPTION</th>
                    <th>ASSIGNED CREW</th>
                    <th>REPORTED</th>
                    <th>STATUS</th>
                    <th>COST IMPACT</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr><td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>No complaints found.</td></tr>
                  )}
                  {list.map((c) => {
                    const sc = STATUS_COLORS[c.status] || { bg: '#eee', color: '#666' };
                    const orderType = c.orders?.type || '—';
                    const customerName = c.orders?.customers?.name || '—';
                    const crewName = c.orders?.crews?.name || '—';
                    
                    return (
                      <tr key={c.id}>
                        <td><span className={styles.cmpId}>{c.display_id}</span></td>
                        <td><span className={styles.ordRef}>{c.orders?.display_id}</span></td>
                        <td><strong className={styles.customer}>{customerName}</strong></td>
                        <td>
                          <span className={styles.typeBadge} data-type={orderType}>{orderType}</span>
                        </td>
                        <td><span className={styles.cause}>{c.cause}</span></td>
                        <td><span className={styles.issue}>{c.issue_description}</span></td>
                        <td><span className={styles.crew}>{crewName}</span></td>
                        <td><span className={styles.date}>{c.reported_date}</span></td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <strong className={styles.costImpact}>€ {Number(c.cost_impact).toLocaleString()}</strong>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} title="View" onClick={() => setSelectedComplaint(c)}><Eye size={13} color="#009ef7" /></button>
                            <button
                              className={styles.actionBtn}
                              title="Delete"
                              onClick={() => setDeleteTarget(c.id)}
                            >
                              <Trash2 size={13} color="#f1416c" />
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

      {/* New Complaint Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3><AlertCircle size={18} color="#f1416c" /> Log New Complaint</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            <div className={styles.modalBody}>
              {/* Row 1: Order lookup */}
              <div className={styles.formRow3}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Original Order Number <span className={styles.required}>*</span></label>
                  <select 
                    className={styles.formInput} 
                    value={selectedOrderId} 
                    onChange={e => handleOrderChange(e.target.value)}
                  >
                    <option value="">Wählen Sie einen Auftrag...</option>
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>{o.display_id} - {o.customers?.name || 'Unbekannt'}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Customer</label>
                  <input type="text" placeholder="Auto-filled from order..." className={styles.formInput} value={customerName} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Order Type</label>
                  <input type="text" placeholder="Auto-filled from order..." className={styles.formInput} value={orderType} readOnly />
                </div>
              </div>

              <div className={styles.sectionDivider}><span>Complaint Details</span></div>

              {/* Row 2: Cause + Date + Cost */}
              <div className={styles.formRow3}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Root Cause <span className={styles.required}>*</span></label>
                  <select className={styles.formInput} value={formCause} onChange={e => setFormCause(e.target.value)}>
                    <option value="">Select cause...</option>
                    <option value="Material Failure">Material Failure</option>
                    <option value="Installation Error">Installation Error</option>
                    <option value="Planning Error">Planning Error</option>
                    <option value="Third-Party Damage">Third-Party Damage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reported Date</label>
                  <input type="date" className={styles.formInput} value={formReportedDate} onChange={e => setFormReportedDate(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cost Impact (€)</label>
                  <input type="number" className={styles.formInput} value={formCostImpact} onChange={e => setFormCostImpact(e.target.value)} />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className={styles.formRow} style={{ marginBottom: 16 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Issue Description <span className={styles.required}>*</span></label>
                  <textarea rows={4} placeholder="Describe the defect or problem in detail..." className={styles.formTextarea} value={formIssue} onChange={e => setFormIssue(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Proposed Solution / Next Steps</label>
                  <textarea rows={4} placeholder="How will this be fixed?" className={styles.formTextarea} value={formSolution} onChange={e => setFormSolution(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={handleSaveComplaint} disabled={saving}>
                <AlertCircle size={14} /> {saving ? 'Logging...' : 'Log Complaint'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <div className={styles.modalIcon}>
              <Trash2 size={32} color="#f1416c" />
            </div>
            <h3 className={styles.modalTitle}>Delete Complaint?</h3>
            <p className={styles.modalDesc}>Are you sure you want to delete this complaint?</p>
            <p className={styles.modalWarn}>This action cannot be undone.</p>
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--card-border)', background: 'linear-gradient(135deg, rgba(241,65,108,0.06), rgba(241,65,108,0.02))' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--header-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color="#f1416c" /> Complaint Details - {selectedComplaint.display_id || selectedComplaint.id}
              </h3>
              <button onClick={() => setSelectedComplaint(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Original Order</label>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--header-text)', marginTop: '4px' }}>{selectedComplaint.orders?.display_id || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Customer</label>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--header-text)', marginTop: '4px' }}>{selectedComplaint.orders?.customers?.name || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Order Type</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedComplaint.orders?.type || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Root Cause</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedComplaint.cause}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Reported Date</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedComplaint.reported_date}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Cost Impact</label>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1416c', marginTop: '4px' }}>€ {Number(selectedComplaint.cost_impact).toLocaleString()}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Status</label>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: STATUS_COLORS[selectedComplaint.status]?.bg || '#eee', color: STATUS_COLORS[selectedComplaint.status]?.color || '#333' }}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Issue Description</label>
                <div style={{ fontSize: '13px', color: 'var(--body-text)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{selectedComplaint.issue_description}</div>
              </div>
              {selectedComplaint.proposed_solution && (
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Proposed Solution</label>
                  <div style={{ fontSize: '13px', color: 'var(--body-text)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{selectedComplaint.proposed_solution}</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
              <button onClick={() => setSelectedComplaint(null)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--body-text)', fontSize: '13px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
