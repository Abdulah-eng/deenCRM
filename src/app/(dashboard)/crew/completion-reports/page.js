"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { FileText, Eye, Send, AlertCircle } from 'lucide-react';
import styles from './page.module.css';

const reports = [
  { id: 'CMP-RPT-018', orderId: 'ORD-2024-049', customer: 'Renovierung König', m2: '210 m²', date: '2024-05-08', status: 'SENT', by: 'Klaus Weber', notes: 'Auto-sent via email' },
  { id: 'CMP-RPT-017', orderId: 'ORD-2024-041', customer: 'Wohnbau AG', m2: '650 m²', date: '2024-05-03', status: 'SENT', by: 'Klaus Weber', notes: 'Auto-sent via email' },
  { id: 'CMP-RPT-016', orderId: 'ORD-2024-035', customer: 'Bauunternehmen GmbH', m2: '480 m²', date: '2024-04-25', status: 'APPROVED', by: 'Klaus Weber', notes: 'Confirmed by manager' },
  { id: 'CMP-RPT-015', orderId: 'ORD-2024-028', customer: 'Stadtbau GmbH', m2: '320 m²', date: '2024-04-18', status: 'APPROVED', by: 'Klaus Weber', notes: 'Confirmed by manager' },
];

const STATUS_COLORS = {
  'SENT': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'APPROVED': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
};

export default function CompletionReports() {
  return (
    <>
      <Header title="Completion Reports" subtitle="Completion Reports" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Completion Reports</h2>
            <p className={styles.desc}>Submit and track order completion notices. Auto-sent after approval.</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}>
            <FileText size={15} style={{ marginRight: 6 }} /> New Completion Report
          </button>
        </div>

        <div className={styles.alertBanner}>
          <AlertCircle size={20} color="#f97316" />
          <span><strong>ORD-2024-058</strong> is in progress. Submit completion report when finished to trigger auto-invoice generation.</span>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><FileText size={16} /> My Completion Reports</div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>REPORT #</th>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>M² DONE</th>
                  <th>SUBMITTED</th>
                  <th>STATUS</th>
                  <th>SUBMITTED BY</th>
                  <th>NOTES</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => {
                  const sc = STATUS_COLORS[r.status] || {};
                  return (
                    <tr key={i}>
                      <td style={{ color: '#a1a5b7' }}>{r.id}</td>
                      <td style={{ color: '#a1a5b7' }}>{r.orderId}</td>
                      <td><strong>{r.customer}</strong></td>
                      <td><strong style={{ color: '#f97316' }}>{r.m2}</strong></td>
                      <td style={{ color: '#a1a5b7' }}>{r.date}</td>
                      <td><span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>{r.status}</span></td>
                      <td>{r.by}</td>
                      <td style={{ color: '#a1a5b7' }}>{r.notes}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn} style={{ color: '#f97316' }}><Eye size={13} /></button>
                          <button className={styles.actionBtn} style={{ color: '#10b981' }}><Send size={13} /></button>
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
    </>
  );
}
