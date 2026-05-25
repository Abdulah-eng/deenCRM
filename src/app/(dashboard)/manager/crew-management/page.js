"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Users, User, MapPin, Search, Edit3, Trash2, MessageCircle, Plus, X } from 'lucide-react';
import styles from './page.module.css';

const crews = [
  { id: 1, name: 'Team Alpha', type: 'MAIN', lead: 'Josef Meier', size: '4 workers', specialty: 'SCREED', costM2: '€ 8.50', costHr: '€ 320', area: 'Munich / Augsburg', orders: 18, status: 'ACTIVE' },
  { id: 2, name: 'Team Beta', type: 'MAIN', lead: 'Rolf Schneider', size: '3 workers', specialty: 'SCREED', costM2: '€ 9.00', costHr: '€ 280', area: 'Stuttgart / Freiburg', orders: 12, status: 'ACTIVE' },
  { id: 3, name: 'Team Gamma', type: 'MAIN', lead: 'Werner Baum', size: '5 workers', specialty: 'HEATING', costM2: '€ 11.50', costHr: '€ 350', area: 'All Bavaria', orders: 9, status: 'ACTIVE' },
  { id: 4, name: 'Team Delta', type: 'SUB', lead: 'Ali Hassan', size: '2 workers', specialty: 'ELECTRICAL', costM2: '€ 15.00', costHr: '€ 240', area: 'Nuremberg', orders: 6, status: 'ACTIVE' },
  { id: 5, name: 'Team Epsilon', type: 'SUB', lead: 'Osman Kurt', size: '3 workers', specialty: 'SCREED', costM2: '€ 7.80', costHr: '€ 260', area: 'Munich', orders: 4, status: 'AVAILABLE' },
];

const TYPE_BADGE = { 'MAIN': '#3b82f6', 'SUB': '#f59e0b' };
const SPEC_BADGE = { 'SCREED': '#eab308', 'HEATING': '#ef4444', 'ELECTRICAL': '#3b82f6' };
const STAT_BADGE = { 'ACTIVE': '#10b981', 'AVAILABLE': '#8b5cf6' };

export default function CrewManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header title="Crew Management" subtitle="Crew Management" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Crew Management</h2>
            <p className={styles.desc}>Main crews and sub-crews with costs, areas, and specializations.</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }} onClick={() => setShowModal(true)}>
            <Plus size={16} style={{ marginRight: 6 }} /> Add Crew
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Users size={22} /></div>
              <h2 className={styles.kpiVal}>5</h2>
              <p className={styles.kpiLabel}>Total Crews</p>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><User size={22} /></div>
              <h2 className={styles.kpiVal}>3</h2>
              <p className={styles.kpiLabel}>Main Crews</p>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Users size={22} /></div>
              <h2 className={styles.kpiVal}>2</h2>
              <p className={styles.kpiLabel}>Sub Crews</p>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><MapPin size={22} /></div>
              <h2 className={styles.kpiVal}>4</h2>
              <p className={styles.kpiLabel}>On Field</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><Users size={16} /> All Crews</div>
            <div className={styles.searchBox}>
              <Search size={14} color="#a1a5b7" />
              <input type="text" placeholder="Search crews..." />
            </div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>CREW NAME</th>
                  <th>TYPE</th>
                  <th>LEAD</th>
                  <th>SIZE</th>
                  <th>SPECIALTY</th>
                  <th>COST / M²</th>
                  <th>COST / HR</th>
                  <th>AREA</th>
                  <th>ORDERS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {crews.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: '#a1a5b7' }}>{c.id}</td>
                    <td><strong>{c.name}</strong></td>
                    <td><span className={styles.badge} style={{ backgroundColor: `${TYPE_BADGE[c.type]}1A`, color: TYPE_BADGE[c.type] }}>{c.type}</span></td>
                    <td>{c.lead}</td>
                    <td style={{ color: '#a1a5b7' }}>{c.size}</td>
                    <td><span className={styles.badge} style={{ backgroundColor: `${SPEC_BADGE[c.specialty]}1A`, color: SPEC_BADGE[c.specialty] }}>{c.specialty}</span></td>
                    <td><strong>{c.costM2}</strong></td>
                    <td><strong>{c.costHr}</strong></td>
                    <td style={{ color: '#a1a5b7' }}>{c.area}</td>
                    <td><strong>{c.orders}</strong></td>
                    <td><span className={styles.badge} style={{ backgroundColor: `${STAT_BADGE[c.status]}1A`, color: STAT_BADGE[c.status] }}>{c.status}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn}><Edit3 size={13} color="#3b82f6" /></button>
                        <button className={styles.actionBtn}><MessageCircle size={13} color="#10b981" /></button>
                        <button className={styles.actionBtn}><Trash2 size={13} color="#ef4444" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add New Crew</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Crew Name</label>
                  <input type="text" className={styles.formInput} placeholder="e.g. Team Zeta" />
                </div>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select className={styles.formInput}><option>MAIN</option><option>SUB</option></select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Lead Name</label>
                  <input type="text" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Size (workers)</label>
                  <input type="number" className={styles.formInput} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Specialty</label>
                  <select className={styles.formInput}><option>SCREED</option><option>HEATING</option><option>ELECTRICAL</option></select>
                </div>
                <div className={styles.formGroup}>
                  <label>Area / Region</label>
                  <input type="text" className={styles.formInput} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Cost / m² (€)</label>
                  <input type="number" step="0.1" className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Cost / hr (€)</label>
                  <input type="number" className={styles.formInput} />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`btn ${styles.cancelBtn}`} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}>Add Crew</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
