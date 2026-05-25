"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { AlertCircle, Plus, Search, Eye, Wrench, Trash2, X } from 'lucide-react';
import styles from './page.module.css';

const complaints = [
  { id: 'CMP-2024-001', orderId: 'ORD-2024-042', customer: 'Bauunternehmen GmbH', type: 'SCREED', issue: 'Surface defect — screed cracking after 48h', assignedCrew: 'Team Alpha', reported: '2024-04-28', status: 'SCHEDULED', costImpact: '€ 1,200' },
  { id: 'CMP-2024-002', orderId: 'ORD-2024-038', customer: 'Wohnbau AG', type: 'HEATING', issue: 'Heating pipe leak under screed', assignedCrew: 'Team Gamma', reported: '2024-04-30', status: 'IN PROGRESS', costImpact: '€ 2,800' },
  { id: 'CMP-2024-003', orderId: 'ORD-2024-051', customer: 'Stadtbau GmbH', type: 'SCREED', issue: 'Level deviation > 5mm in corner area', assignedCrew: 'Team Alpha', reported: '2024-05-10', status: 'NEW', costImpact: '€ 650' },
];

const STATUS_COLORS = {
  'SCHEDULED':   { bg: 'rgba(114,57,234,0.12)', color: '#7239ea' },
  'IN PROGRESS': { bg: 'rgba(0,158,247,0.12)',  color: '#009ef7' },
  'NEW':         { bg: 'rgba(255,199,0,0.12)',   color: '#d16b11' },
  'RESOLVED':    { bg: 'rgba(80,205,137,0.12)',  color: '#50cd89' },
};

export default function Complaints() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [list, setList] = useState(complaints);

  const confirmDelete = () => {
    setList(prev => prev.filter(c => c.id !== deleteTarget));
    setDeleteTarget(null);
  };

  return (
    <>
      <Header title="Complaints" subtitle="Complaints" />
      <div className={styles.container}>

        {/* Warning banner */}
        <div className={styles.warningBanner}>
          <AlertCircle size={16} color="#d16b11" />
          <span>
            <strong>{list.length} open complaints</strong> — Total impact on margins:{' '}
            <strong>€ {list.reduce((sum, c) => sum + parseInt(c.costImpact.replace(/[^0-9]/g, '')), 0).toLocaleString()}</strong>.
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
              <button className={`btn btn-primary ${styles.newBtn}`}>
                <Plus size={14} style={{ marginRight: 6 }} /> New Complaint
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>COMPLAINT #</th>
                  <th>ORIGINAL ORDER</th>
                  <th>CUSTOMER</th>
                  <th>TYPE</th>
                  <th>ISSUE DESCRIPTION</th>
                  <th>ASSIGNED CREW</th>
                  <th>REPORTED</th>
                  <th>STATUS</th>
                  <th>COST IMPACT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c, idx) => {
                  const sc = STATUS_COLORS[c.status] || {};
                  return (
                    <tr key={idx}>
                      <td><span className={styles.cmpId}>{c.id}</span></td>
                      <td><span className={styles.ordRef}>{c.orderId}</span></td>
                      <td><strong className={styles.customer}>{c.customer}</strong></td>
                      <td>
                        <span className={styles.typeBadge} data-type={c.type}>{c.type}</span>
                      </td>
                      <td><span className={styles.issue}>{c.issue}</span></td>
                      <td><span className={styles.crew}>{c.assignedCrew}</span></td>
                      <td><span className={styles.date}>{c.reported}</span></td>
                      <td>
                        <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <strong className={styles.costImpact}>{c.costImpact}</strong>
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
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <Trash2 size={28} color="#f1416c" />
            </div>
            <h3 className={styles.modalTitle}>Delete Confirmation</h3>
            <p className={styles.modalDesc}>
              Are you sure you want to delete <strong>"{deleteTarget}"</strong>?
            </p>
            <p className={styles.modalWarn}>This action cannot be undone.</p>
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>
                <X size={14} style={{ marginRight: 4 }} /> Cancel
              </button>
              <button className={styles.deleteBtn} onClick={confirmDelete}>
                <Trash2 size={14} style={{ marginRight: 4 }} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
