"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Search, Plus, Eye, Edit3, Trash2, MapPin, Download, X, ClipboardList } from 'lucide-react';
import styles from './page.module.css';

const orders = [
  { id: 'ORD-2024-058', customer: 'Bauunternehmen GmbH', type: 'SCREED', crew: 'Team A', location: 'Munich', area: '480 m²', revenue: '€ 9,600', planDb: '€ 2,400', actualDb: '€ 2,100', status: 'IN PROGRESS', date: '2024-05-15' },
  { id: 'ORD-2024-059', customer: 'Wohnbau AG', type: 'HEATING', crew: 'Team C', location: 'Stuttgart', area: '320 m²', revenue: '€ 8,200', planDb: '€ 2,050', actualDb: '€ 1,980', status: 'SCHEDULED', date: '2024-05-17' },
  { id: 'ORD-2024-060', customer: 'Stadtbau GmbH', type: 'SCREED', crew: 'Team B', location: 'Augsburg', area: '650 m²', revenue: '€ 12,350', planDb: '€ 3,088', actualDb: '€ 2,870', status: 'IN PROGRESS', date: '2024-05-16' },
  { id: 'ORD-2024-061', customer: 'Immobilien Keller', type: 'ELECTRICAL', crew: 'Team D', location: 'Nuremberg', area: '—', revenue: '€ 5,800', planDb: '€ 1,450', actualDb: '€ 1,450', status: 'COMPLETED', date: '2024-05-14' },
  { id: 'ORD-2024-062', customer: 'Bau & Projekt GmbH', type: 'SCREED', crew: 'Team A', location: 'Munich', area: '890 m²', revenue: '€ 17,800', planDb: '€ 4,450', actualDb: '—', status: 'DELAYED', date: '2024-05-13' },
  { id: 'ORD-2024-063', customer: 'Renovierung König', type: 'HEATING', crew: 'Team C', location: 'Freiburg', area: '210 m²', revenue: '€ 4,200', planDb: '€ 1,050', actualDb: '—', status: 'NEW', date: '2024-05-18' },
];

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
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showModal, setShowModal] = useState(false);

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || o.type === typeFilter;
    const matchStatus = statusFilter === 'All Status' || o.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

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
                {filtered.map((o, idx) => {
                  const sc = STATUS_COLORS[o.status] || {};
                  const tc = TYPE_COLORS[o.type] || {};
                  return (
                    <tr key={idx}>
                      <td>
                        <a className={styles.orderId}>{o.id}</a>
                      </td>
                      <td><strong className={styles.customer}>{o.customer}</strong></td>
                      <td>
                        <span className={styles.typeBadge} style={{ backgroundColor: tc.bg, color: tc.color }}>
                          {o.type}
                        </span>
                      </td>
                      <td><span className={styles.crew}>{o.crew}</span></td>
                      <td>
                        <span className={styles.location}>
                          <MapPin size={12} /> {o.location}
                        </span>
                      </td>
                      <td>{o.area}</td>
                      <td><strong className={styles.revenue}>{o.revenue}</strong></td>
                      <td>{o.planDb}</td>
                      <td>{o.actualDb}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {o.status}
                        </span>
                      </td>
                      <td><span className={styles.date}>{o.date}</span></td>
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
          </div>
        </div>
      </div>

      {/* Create New Order Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3><ClipboardList size={16} style={{ marginRight: 8 }} />Create New Order</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Customer *</label>
                  <select className={styles.formInput}><option>Select customer...</option></select>
                </div>
                <div className={styles.formGroup}>
                  <label>Company *</label>
                  <select className={styles.formInput}><option>Screed Works</option><option>Heating Works</option><option>Electrical Works</option></select>
                </div>
                <div className={styles.formGroup}>
                  <label>Order Type</label>
                  <select className={styles.formInput}><option>Screed</option><option>Heating</option><option>Electrical</option></select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Location / Address</label>
                  <input type="text" placeholder="Job site address" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Area (m²)</label>
                  <input type="number" defaultValue="0" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Assembly Height (mm)</label>
                  <input type="number" defaultValue="0" className={styles.formInput} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Assign Crew</label>
                  <select className={styles.formInput}><option>Team A</option><option>Team B</option><option>Team C</option></select>
                </div>
                <div className={styles.formGroup}>
                  <label>Scheduled Date</label>
                  <input type="date" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Estimated Value (€)</label>
                  <input type="number" defaultValue="0.00" className={styles.formInput} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Order Description / Notes</label>
                <textarea rows={4} className={styles.formTextarea} />
              </div>
              <div className={styles.formGroup}>
                <label>Attach Files (PDF, Images)</label>
                <input type="file" className={styles.formInput} />
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
