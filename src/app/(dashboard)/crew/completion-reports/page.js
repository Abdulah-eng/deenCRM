'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Header from '@/components/layout/Header';
import { Plus, Eye, X, Send, ClipboardCheck } from 'lucide-react';
import styles from './page.module.css';

export default function CompletionReportsPage() {
  const [reports, setReports] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal form state
  const [selectedOrder, setSelectedOrder] = useState('');
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().slice(0, 10));
  const [workCompleted, setWorkCompleted] = useState('');
  const [issuesEncountered, setIssuesEncountered] = useState('');
  const [photosNotes, setPhotosNotes] = useState('');

  useEffect(() => {
    fetchOrders();
    loadReports();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('id, display_id, customers(name)')
      .in('status', ['IN PROGRESS', 'SCHEDULED']);
    if (data) {
      setOrders(data);
    }
  }

  function loadReports() {
    const saved = localStorage.getItem('completion_reports');
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }

  function saveReport(e) {
    e.preventDefault();
    if (!selectedOrder) return alert('Please select an order');
    
    const orderData = orders.find(o => o.id === selectedOrder);
    
    const newReport = {
      id: Date.now().toString(),
      order_id: selectedOrder,
      display_id: orderData?.display_id || selectedOrder.slice(0,8),
      date: completionDate,
      work_completed: workCompleted,
      issues_encountered: issuesEncountered,
      photos_notes: photosNotes,
      status: 'Pending Review',
      created_at: new Date().toISOString()
    };
    
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('completion_reports', JSON.stringify(updatedReports));
    
    setIsModalOpen(false);
    resetForm();
  }

  function resetForm() {
    setSelectedOrder('');
    setCompletionDate(new Date().toISOString().slice(0, 10));
    setWorkCompleted('');
    setIssuesEncountered('');
    setPhotosNotes('');
  }

  const pendingCount = reports.filter(r => r.status === 'Pending Review').length;

  return (
    <div className={styles.container}>
      <Header title="Completion Reports" userName="Crew Member" />
      
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Completion Reports</h1>
          <p className={styles.desc}>Submit and track end-of-day or project completion reports.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#d95319', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          <Plus size={18} /> New Report
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '250px' }}>
          <div style={{ padding: '12px', background: '#e0e7ff', borderRadius: '50%', color: '#4f46e5' }}>
            <ClipboardCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--body-text-muted)', marginBottom: '4px' }}>PENDING REPORTS</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--header-text)' }}>{pendingCount}</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden' }}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>Recent Reports</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--body-text-muted)' }}>No reports submitted yet.</td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.id}>
                    <td style={{ fontWeight: '600' }}>REP-{report.id.slice(-6)}</td>
                    <td>{report.display_id}</td>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td>
                      <span className={styles.statusBadge} style={{ background: '#fef3c7', color: '#d97706' }}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="View Details">
                          <Eye size={14} color="var(--body-text-muted)" />
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--header-text)' }}>New Completion Report</h3>
              <X style={{ cursor: 'pointer', color: 'var(--body-text-muted)' }} onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={saveReport}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>Order</label>
                <select 
                  required
                  value={selectedOrder}
                  onChange={e => setSelectedOrder(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--header-text)', fontSize: '14px' }}
                >
                  <option value="">Select an active order...</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.display_id || o.id.slice(0,8)} - {o.customers?.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>Completion Date</label>
                <input 
                  type="date"
                  required
                  value={completionDate}
                  onChange={e => setCompletionDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--header-text)', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>Work Completed</label>
                <textarea 
                  required
                  rows={4}
                  value={workCompleted}
                  onChange={e => setWorkCompleted(e.target.value)}
                  placeholder="Describe the work completed today..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--header-text)', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>Issues Encountered</label>
                <textarea 
                  rows={3}
                  value={issuesEncountered}
                  onChange={e => setIssuesEncountered(e.target.value)}
                  placeholder="Any issues, delays, or additional materials needed?"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--header-text)', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>Photos/Notes (Link)</label>
                <input 
                  type="text"
                  value={photosNotes}
                  onChange={e => setPhotosNotes(e.target.value)}
                  placeholder="Link to photos or additional notes..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--header-text)', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--body-text)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '10px 16px', background: '#d95319', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Send size={16} /> Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
