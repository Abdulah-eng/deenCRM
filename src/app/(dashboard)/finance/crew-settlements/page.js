"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { DollarSign, FileText, Users, Download, Eye, Calendar, Plus } from 'lucide-react';
import styles from './page.module.css';

const settlements = [
  { id: 'SET-2024-018', crew: 'Team Alpha', period: 'May 1-15', orders: 8, m2: '1,840 m²', material: '€ 14,720', crewCost: '€ 5,888', total: '€ 8,832', status: 'PAID' },
  { id: 'SET-2024-017', crew: 'Team Beta', period: 'May 1-15', orders: 6, m2: '1,200 m²', material: '€ 10,800', crewCost: '€ 3,360', total: '€ 7,440', status: 'PAID' },
  { id: 'SET-2024-016', crew: 'Team Gamma', period: 'May 1-15', orders: 5, m2: '980 m²', material: '€ 11,270', crewCost: '€ 4,200', total: '€ 7,070', status: 'PENDING' },
  { id: 'SET-2024-015', crew: 'Team Delta', period: 'April 16-30', orders: 4, m2: '320 m²', material: '€ 4,800', crewCost: '€ 2,800', total: '€ 2,000', status: 'PENDING' },
  { id: 'SET-2024-014', crew: 'Team Epsilon', period: 'April 16-30', orders: 3, m2: '210 m²', material: '€ 1,638', crewCost: '€ 784', total: '€ 854', status: 'DRAFT' },
];

const STATUS_COLORS = {
  'PAID': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  'PENDING': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  'DRAFT': { bg: 'rgba(161,165,183,0.12)', color: '#a1a5b7' },
};

export default function CrewSettlements() {
  return (
    <>
      <Header title="Crew Settlements" subtitle="Crew Settlements" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Crew Settlements</h2>
            <p className={styles.desc}>Generate crew payment settlements from scheduling and completed orders.</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#f1416c', borderColor: '#f1416c' }}>
            <Plus size={16} style={{ marginRight: 6 }} /> Generate Settlement
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><DollarSign size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 48,200</h2><p className={styles.kpiLabel}>Total Settled</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><FileText size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 12,400</h2><p className={styles.kpiLabel}>Pending</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><Calendar size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 18,800</h2><p className={styles.kpiLabel}>This Month</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Users size={20} /></div>
            <div><h2 className={styles.kpiVal}>8</h2><p className={styles.kpiLabel}>Crews Paid</p></div>
          </div></div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><FileText size={16} /> All Settlements</div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SETTLEMENT #</th>
                  <th>CREW</th>
                  <th>PERIOD</th>
                  <th>ORDERS</th>
                  <th>M² DONE</th>
                  <th>MATERIAL COST</th>
                  <th>CREW COST</th>
                  <th>TOTAL PAYOUT</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((s, i) => {
                  const sc = STATUS_COLORS[s.status] || {};
                  return (
                    <tr key={i}>
                      <td style={{ color: '#a1a5b7' }}>{s.id}</td>
                      <td><strong>{s.crew}</strong></td>
                      <td style={{ color: '#a1a5b7' }}>{s.period}</td>
                      <td><strong>{s.orders}</strong></td>
                      <td style={{ color: '#f1416c' }}>{s.m2}</td>
                      <td style={{ color: '#a1a5b7' }}>{s.material}</td>
                      <td style={{ color: '#a1a5b7' }}>{s.crewCost}</td>
                      <td><strong style={{ color: '#10b981' }}>{s.total}</strong></td>
                      <td><span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>{s.status}</span></td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn}><Eye size={13} color="#3b82f6" /></button>
                          <button className={styles.actionBtn}><Download size={13} color="#a1a5b7" /></button>
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
