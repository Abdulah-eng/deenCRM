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

  useEffect(() => {
    async function fetchComplaints() {
      // Join with orders to get order details, customer, and crew
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
      setLoading(false);
    }
    fetchComplaints();
  }, []);

  const confirmDelete = () => {
    // Note: For a real app, delete from Supabase here
    setList(prev => prev.filter(c => c.id !== deleteTarget));
    setDeleteTarget(null);
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
                            <button className={styles.actionBtn} title="View"><Eye size={13} color="#009ef7" /></button>
                            <button className={styles.actionBtn} title="Schedule"><Wrench size={13} color="#50cd89" /></button>
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
              <h3><AlertCircle size={16} color="#f1416c" style={{ marginRight: 8 }} />Log New Complaint</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Original Order Number *</label>
                  <input type="text" placeholder="e.g. ORD-2024-042" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Customer</label>
                  <input type="text" placeholder="Auto-filled from order..." className={styles.formInput} readOnly style={{ backgroundColor: 'rgba(0,0,0,0.02)' }} />
                </div>
                <div className={styles.formGroup}>
                  <label>Order Type</label>
                  <input type="text" placeholder="Auto-filled from order..." className={styles.formInput} readOnly style={{ backgroundColor: 'rgba(0,0,0,0.02)' }} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Root Cause *</label>
                  <select className={styles.formInput}>
                    <option>Select cause...</option>
                    <option>Material Failure</option>
                    <option>Installation Error</option>
                    <option>Planning Error</option>
                    <option>Third-Party Damage</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Reported Date</label>
                  <input type="date" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Estimated Cost Impact (€)</label>
                  <input type="number" defaultValue="0.00" className={styles.formInput} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Issue Description *</label>
                <textarea rows={4} placeholder="Describe the defect or problem in detail..." className={styles.formTextarea} />
              </div>
              <div className={styles.formGroup}>
                <label>Proposed Solution / Next Steps</label>
                <textarea rows={3} placeholder="How will this be fixed?" className={styles.formTextarea} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`btn ${styles.cancelBtn}`} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#f1416c' }}>
                ✓ Log Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: '400px' }}>
            <div className={styles.modalIcon} style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Trash2 size={48} color="#f1416c" />
            </div>
            <h3 className={styles.modalTitle} style={{ textAlign: 'center' }}>Delete Confirmation</h3>
            <p className={styles.modalDesc} style={{ textAlign: 'center', marginBottom: '16px' }}>
              Are you sure you want to delete this complaint?
            </p>
            <p className={styles.modalWarn} style={{ textAlign: 'center', color: '#f1416c', marginBottom: '24px' }}>This action cannot be undone.</p>
            <div className={styles.modalBtns} style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className={styles.deleteBtn} onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
