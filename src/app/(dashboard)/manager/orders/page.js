"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Search, Plus, Eye, Edit3, Trash2, MapPin, Download, X, ClipboardList, Wand2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const STATUS_COLORS = {
  'IN PROGRESS': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'SCHEDULED':   { bg: 'rgba(114,57,234,0.12)', color: '#7239ea' },
  'COMPLETED':   { bg: 'rgba(80,205,137,0.12)', color: '#50cd89' },
  'DELAYED':     { bg: 'rgba(241,65,108,0.12)',  color: '#f1416c' },
  'NEW':         { bg: 'rgba(255,199,0,0.12)',   color: '#ffc700' },
};

const TYPE_COLORS = {
  'SCREED':     { bg: 'rgba(255,199,0,0.12)',   color: '#d16b11' },
  'HEATING':    { bg: 'rgba(241,65,108,0.12)',  color: '#f1416c' },
  'ELECTRICAL': { bg: 'rgba(0,158,247,0.12)',   color: '#009ef7' },
};

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  
  // Modal State
  const [modalOrderType, setModalOrderType] = useState('Screed');
  const [subTasks, setSubTasks] = useState([]);
  
  // AI Parsing State
  const [isParsing, setIsParsing] = useState(false);
  const [formCustomer, setFormCustomer] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formValue, setFormValue] = useState('0.00');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(name), crews(name)')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const addSubTask = () => {
    setSubTasks([...subTasks, { id: Date.now(), name: '', assignee: 'Team A', status: 'Pending' }]);
  };

  const updateSubTask = (id, field, value) => {
    setSubTasks(subTasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeSubTask = (id) => {
    setSubTasks(subTasks.filter(t => t.id !== id));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/parse-order', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormCustomer(data.customerName || '');
        setFormAddress(data.customerAddress || '');
        setFormValue(data.total || '0.00');
        
        if (data.items && data.items.length > 0) {
          const notes = data.items.map(item => `- ${item.quantity}x ${item.description} (@ €${item.price})`).join('\\n');
          setFormNotes("Extracted Items:\\n" + notes);
        }
        
      } else {
        alert("Failed to parse PDF: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error parsing PDF.");
    }
    setIsParsing(false);
  };

  const filtered = orders.filter(o => {
    const custName = o.customers?.name || '';
    const matchSearch = custName.toLowerCase().includes(search.toLowerCase()) || o.display_id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || o.type === typeFilter;
    const matchStatus = statusFilter === 'All Status' || o.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const formatCurrency = (val) => val ? `€ ${Number(val).toLocaleString()}` : '—';
  const formatArea = (val) => val ? `${val} m²` : '—';

  return (
    <>
      <Header title="All Orders" subtitle="All Orders" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <p className={styles.desc}>Track all orders across companies with key financial figures.</p>
          <button className={`btn btn-primary ${styles.newBtn}`} onClick={() => setShowModal(true)}>
            <Plus size={15} style={{ marginRight: 6 }} /> New Order
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.searchBox}>
            <Search size={14} color="#a1a5b7" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>All Types</option>
            <option>SCREED</option>
            <option>HEATING</option>
            <option>ELECTRICAL</option>
          </select>
          <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>IN PROGRESS</option>
            <option>SCHEDULED</option>
            <option>COMPLETED</option>
            <option>DELAYED</option>
            <option>NEW</option>
          </select>
          <input type="date" className={styles.filterSelect} />
          <button className={styles.exportBtn}>
            <Download size={14} style={{ marginRight: 6 }} /> Export
          </button>
        </div>

        <div className="card">
          <div className={styles.tableTitle}>
            <span>All Orders ({filtered.length})</span>
          </div>
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Loading orders...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ORDER #</th>
                    <th>CUSTOMER</th>
                    <th>TYPE</th>
                    <th>CREW</th>
                    <th>LOCATION</th>
                    <th>AREA</th>
                    <th>REVENUE</th>
                    <th>PLAN DB</th>
                    <th>ACTUAL DB</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td></tr>
                  )}
                  {filtered.map((o) => {
                    const sc = STATUS_COLORS[o.status] || { bg: '#eee', color: '#666' };
                    const tc = TYPE_COLORS[o.type] || { bg: '#eee', color: '#666' };
                    return (
                      <tr key={o.id}>
                        <td>
                          <a className={styles.orderId}>{o.display_id}</a>
                        </td>
                        <td><strong className={styles.customer}>{o.customers?.name || 'Unknown'}</strong></td>
                        <td>
                          <span className={styles.typeBadge} style={{ backgroundColor: tc.bg, color: tc.color }}>
                            {o.type}
                          </span>
                        </td>
                        <td><span className={styles.crew}>{o.crews?.name || 'Unassigned'}</span></td>
                        <td>
                          <span className={styles.location}>
                            <MapPin size={12} /> {o.location}
                          </span>
                        </td>
                        <td>{formatArea(o.area)}</td>
                        <td><strong className={styles.revenue}>{formatCurrency(o.revenue)}</strong></td>
                        <td>{formatCurrency(o.plan_db)}</td>
                        <td>{formatCurrency(o.actual_db)}</td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {o.status}
                          </span>
                        </td>
                        <td><span className={styles.date}>{o.scheduled_date || '—'}</span></td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn}><Eye size={13} color="#009ef7" /></button>
                            <button className={styles.actionBtn}><Edit3 size={13} color="#50cd89" /></button>
                            <button className={styles.actionBtn}><Trash2 size={13} color="#f1416c" /></button>
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

      {/* Create New Order Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h3><ClipboardList size={16} style={{ marginRight: 8 }} />Create New Order</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* AI PDF Upload Feature */}
              <div style={{ backgroundColor: 'rgba(114,57,234,0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed #7239ea', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', color: '#7239ea' }}>
                  <Wand2 size={16} style={{ marginRight: 8 }} /> AI Auto-Fill from PDF
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#5e6278' }}>
                  Upload a customer purchase order PDF. Our Gemini AI will instantly extract the customer, address, and items to pre-fill the form!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="file" accept="application/pdf" onChange={handleFileUpload} className={styles.formInput} style={{ flex: 1, cursor: 'pointer' }} disabled={isParsing} />
                  {isParsing && <span style={{ color: '#7239ea', fontSize: '13px', fontWeight: 500 }}>✨ Extracting data...</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Customer Name *</label>
                  <input type="text" placeholder="Customer Name" className={styles.formInput} value={formCustomer} onChange={e => setFormCustomer(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Company *</label>
                  <select className={styles.formInput}><option>Screed Works</option><option>Heating Works</option><option>Electrical Works</option></select>
                </div>
                <div className={styles.formGroup}>
                  <label>Order Type</label>
                  <select className={styles.formInput} value={modalOrderType} onChange={e => setModalOrderType(e.target.value)}>
                    <option value="Screed">Screed</option>
                    <option value="Heating">Heating / Plumbing</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
              </div>
              
              {/* Dynamic Job Details based on Order Type */}
              <div className={styles.sectionTitle}>Job Specific Details</div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Location / Address</label>
                  <input type="text" placeholder="Job site address" className={styles.formInput} value={formAddress} onChange={e => setFormAddress(e.target.value)} />
                </div>
                {modalOrderType === 'Screed' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Area (m²)</label>
                      <input type="number" defaultValue="0" className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Assembly Height (mm)</label>
                      <input type="number" defaultValue="0" className={styles.formInput} />
                    </div>
                  </>
                )}
                {modalOrderType === 'Heating' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>System Type</label>
                      <select className={styles.formInput}><option>Underfloor Heating</option><option>Radiators</option><option>Heat Pump</option></select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Pipe Length (m)</label>
                      <input type="number" defaultValue="0" className={styles.formInput} />
                    </div>
                  </>
                )}
                {modalOrderType === 'Electrical' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Number of Circuits</label>
                      <input type="number" defaultValue="0" className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Connection Power (kW)</label>
                      <input type="number" defaultValue="0" className={styles.formInput} />
                    </div>
                  </>
                )}
              </div>

              <div className={styles.sectionTitle}>Planning & Finances</div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Assign Primary Crew</label>
                  <select className={styles.formInput}><option>Team A</option><option>Team B</option><option>Team C</option></select>
                </div>
                <div className={styles.formGroup}>
                  <label>Scheduled Date</label>
                  <input type="date" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Estimated Value (€)</label>
                  <input type="number" className={styles.formInput} value={formValue} onChange={e => setFormValue(e.target.value)} />
                </div>
              </div>

              {/* Sub-tasks Section */}
              <div className={styles.sectionTitle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Sub-tasks</span>
                <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addSubTask} style={{ padding: '4px 8px', fontSize: '11px' }}>
                  <Plus size={12} style={{ marginRight: 4 }} /> Add Task
                </button>
              </div>
              <div className={styles.subTasksList}>
                {subTasks.length === 0 && <p style={{ fontSize: '12px', color: 'var(--body-text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>No sub-tasks added. This order will be treated as a single task.</p>}
                {subTasks.map((task) => (
                  <div key={task.id} className={styles.subTaskRow} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Task description..." 
                      className={styles.formInput} 
                      value={task.name} 
                      onChange={(e) => updateSubTask(task.id, 'name', e.target.value)} 
                      style={{ flex: 2 }}
                    />
                    <select 
                      className={styles.formInput} 
                      value={task.assignee} 
                      onChange={(e) => updateSubTask(task.id, 'assignee', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option>Team A</option><option>Team B</option><option>Team C</option><option>Team D</option>
                    </select>
                    <select 
                      className={styles.formInput} 
                      value={task.status} 
                      onChange={(e) => updateSubTask(task.id, 'status', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option>Pending</option><option>In Progress</option><option>Done</option>
                    </select>
                    <button className={styles.actionBtn} onClick={() => removeSubTask(task.id)} style={{ padding: '6px' }}>
                      <Trash2 size={14} color="#f1416c" />
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label>Order Description / Notes</label>
                <textarea rows={4} className={styles.formTextarea} value={formNotes} onChange={e => setFormNotes(e.target.value)} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`btn ${styles.cancelBtn}`} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#7239ea' }}>
                ✓ Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
