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
              <h3><AlertCircle size={18} color="#f1416c" /> Log New Complaint</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>

            <div className={styles.modalBody}>
              {/* Row 1: Order lookup */}
              <div className={styles.formRow3}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Original Order Number <span className={styles.required}>*</span></label>
                  <input type="text" placeholder="e.g. ORD-2024-042" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Customer</label>
                  <input type="text" placeholder="Auto-filled from order..." className={styles.formInput} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Order Type</label>
                  <input type="text" placeholder="Auto-filled from order..." className={styles.formInput} readOnly />
                </div>
              </div>

              <div className={styles.sectionDivider}><span>Complaint Details</span></div>

              {/* Row 2: Cause + Date + Cost */}
              <div className={styles.formRow3}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Root Cause <span className={styles.required}>*</span></label>
                  <select className={styles.formInput}>
                    <option value="">Select cause...</option>
                    <option>Material Failure</option>
                    <option>Installation Error</option>
                    <option>Planning Error</option>
                    <option>Third-Party Damage</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reported Date</label>
                  <input type="date" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cost Impact (€)</label>
                  <input type="number" defaultValue="0.00" className={styles.formInput} />
                </div>
              </div>

              {/* Row 3: Description */}
              <div className={styles.formRow} style={{ marginBottom: 16 }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Issue Description <span className={styles.required}>*</span></label>
                  <textarea rows={4} placeholder="Describe the defect or problem in detail..." className={styles.formTextarea} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Proposed Solution / Next Steps</label>
                  <textarea rows={4} placeholder="How will this be fixed?" className={styles.formTextarea} />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => { alert('Complaint logged successfully!'); setShowModal(false); }}>
                <AlertCircle size={14} /> Log Complaint
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
    </>
  );
}
