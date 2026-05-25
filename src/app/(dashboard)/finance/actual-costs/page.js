"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Search, Plus, Eye, DollarSign, Package, Users, FileText } from 'lucide-react';
import styles from './page.module.css';

const orders = [
  { id: 'ORD-2024-049', customer: 'Renovierung König', type: 'HEATING', revenue: '€ 4,200', material: '€ 950', crew: '€ 1,890', other: '€ 120', totalCost: '€ 2,960', profit: '€ 1,240', margin: 29.5 },
  { id: 'ORD-2024-041', customer: 'Wohnbau AG', type: 'SCREED', revenue: '€ 32,500', material: '€ 8,200', crew: '€ 5,525', other: '€ 475', totalCost: '€ 14,200', profit: '€ 18,300', margin: 56.3 },
  { id: 'ORD-2024-035', customer: 'Bauunternehmen GmbH', type: 'SCREED', revenue: '€ 9,600', material: '€ 2,800', crew: '€ 4,320', other: '€ 260', totalCost: '€ 7,380', profit: '€ 2,220', margin: 23.1 },
  { id: 'ORD-2024-028', customer: 'Stadtbau GmbH', type: 'SCREED', revenue: '€ 12,350', material: '€ 3,100', crew: '€ 5,557', other: '€ 343', totalCost: '€ 9,000', profit: '€ 3,350', margin: 27.1 },
  { id: 'ORD-2024-021', customer: 'Immobilien Keller', type: 'ELECTRICAL', revenue: '€ 5,800', material: '€ 1,800', crew: '€ 2,610', other: '€ 110', totalCost: '€ 4,520', profit: '€ 1,280', margin: 22.1 },
];

const TYPE_COLORS = {
  'SCREED':     { bg: 'rgba(255,199,0,0.12)',   color: '#d16b11' },
  'HEATING':    { bg: 'rgba(241,65,108,0.12)',  color: '#f1416c' },
  'ELECTRICAL': { bg: 'rgba(0,158,247,0.12)',   color: '#009ef7' },
};

export default function ActualCosts() {
  return (
    <>
      <Header title="Actual Costs" subtitle="Actual Costs" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Actual Costs</h2>
            <p className={styles.desc}>Record real costs per order — material, crew, other expenses.</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#f1416c', borderColor: '#f1416c' }}>
            <Plus size={16} style={{ marginRight: 6 }} /> Add Cost Entry
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><DollarSign size={20} /></div>
            <h2 className={styles.kpiVal}>€ 64,450</h2><p className={styles.kpiLabel}>Total Revenue</p>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(255,199,0,0.1)', color: '#ffc700' }}><Package size={20} /></div>
            <h2 className={styles.kpiVal}>€ 16,850</h2><p className={styles.kpiLabel}>Material Costs</p>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(114,57,234,0.1)', color: '#7239ea' }}><Users size={20} /></div>
            <h2 className={styles.kpiVal}>€ 19,902</h2><p className={styles.kpiLabel}>Crew Costs</p>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(161,165,183,0.1)', color: '#a1a5b7' }}><FileText size={20} /></div>
            <h2 className={styles.kpiVal}>€ 1,308</h2><p className={styles.kpiLabel}>Other Costs</p>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><DollarSign size={20} /></div>
            <h2 className={styles.kpiVal}>€ 38,060</h2><p className={styles.kpiLabel}>Total Actual Cost</p>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(80,205,137,0.1)', color: '#50cd89' }}><TrendingUp size={20} /></div>
            <h2 className={styles.kpiVal}>€ 26,390</h2><p className={styles.kpiLabel}>Gross Profit</p>
          </div></div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><DollarSign size={16} /> Cost Breakdown per Order</div>
            <div className={styles.searchBox}>
              <Search size={14} color="#a1a5b7" />
              <input type="text" placeholder="Search orders..." />
            </div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>TYPE</th>
                  <th>REVENUE</th>
                  <th>MATERIAL</th>
                  <th>CREW</th>
                  <th>OTHER</th>
                  <th>TOTAL COST</th>
                  <th>PROFIT</th>
                  <th>MARGIN %</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => {
                  const tc = TYPE_COLORS[o.type] || {};
                  return (
                    <tr key={i}>
                      <td style={{ color: '#a1a5b7', fontSize: '12px' }}>{o.id}</td>
                      <td><strong>{o.customer}</strong></td>
                      <td><span className={styles.badge} style={{ backgroundColor: tc.bg, color: tc.color }}>{o.type}</span></td>
                      <td><strong>{o.revenue}</strong></td>
                      <td style={{ color: '#a1a5b7' }}>{o.material}</td>
                      <td style={{ color: '#a1a5b7' }}>{o.crew}</td>
                      <td style={{ color: '#a1a5b7' }}>{o.other}</td>
                      <td style={{ color: '#f1416c', fontWeight: 600 }}>{o.totalCost}</td>
                      <td style={{ color: '#50cd89', fontWeight: 600 }}>{o.profit}</td>
                      <td>
                        <div className={styles.marginCol}>
                          <div className={styles.marginBar} style={{ width: '24px', height: '4px', borderRadius: '2px', background: o.margin > 25 ? '#50cd89' : '#ffc700' }}></div>
                          <span style={{ color: o.margin > 25 ? '#50cd89' : '#ffc700', fontSize: '12px', fontWeight: 600 }}>{o.margin}%</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionBtn} style={{ color: '#f1416c', background: 'rgba(241,65,108,0.1)' }}><Plus size={13} /></button>
                          <button className={styles.actionBtn} style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}><Eye size={13} /></button>
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

const TrendingUp = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
