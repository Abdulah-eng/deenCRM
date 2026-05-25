"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { FileText, TrendingUp, DollarSign, Percent } from 'lucide-react';
import styles from './page.module.css';

const offers = [
  { id: 'OFR-2024-021', customer: 'Bauunternehmen GmbH', value: '€ 48,200', status: 'SENT', date: '2024-05-10' },
  { id: 'OFR-2024-022', customer: 'Wohnbau AG', value: '€ 32,500', status: 'ACCEPTED', date: '2024-05-08' },
  { id: 'OFR-2024-023', customer: 'Stadtbau GmbH', value: '€ 71,800', status: 'DRAFT', date: '2024-05-14' },
  { id: 'OFR-2024-024', customer: 'Immobilien Keller', value: '€ 18,400', status: 'ACCEPTED', date: '2024-05-12' },
  { id: 'OFR-2024-025', customer: 'Bau & Projekt GmbH', value: '€ 113,100', status: 'PENDING', date: '2024-05-15' },
];

const STATUS_COLORS = {
  'SENT': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'ACCEPTED': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  'DRAFT': { bg: 'rgba(161,165,183,0.12)', color: '#a1a5b7' },
  'PENDING': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
};

const funnelData = [
  { label: 'Created', count: 28, color: '#a1a5b7' },
  { label: 'Sent', count: 20, color: '#3b82f6' },
  { label: 'Negotiation', count: 14, color: '#f59e0b' },
  { label: 'Accepted', count: 12, color: '#10b981' },
  { label: 'Rejected', count: 8, color: '#ef4444' },
];

export default function SalesDashboard() {
  const maxFunnel = Math.max(...funnelData.map(d => d.count));

  return (
    <>
      <Header title="Dashboard" subtitle="Dashboard" />
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h2>Sales Dashboard</h2>
          <p>Overview of offers, conversions, and pipeline.</p>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <FileText size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>8</h2>
                <p className={styles.kpiLabel}>Open Offers</p>
                <span className={styles.kpiSub}>3 pending response</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>12</h2>
                <p className={styles.kpiLabel}>Converted Orders</p>
                <span className={styles.kpiSub}>This month</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <DollarSign size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>€ 284K</h2>
                <p className={styles.kpiLabel}>Total Offer Value</p>
                <span className={styles.kpiSub}>Pipeline</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <Percent size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>62%</h2>
                <p className={styles.kpiLabel}>Conversion Rate</p>
                <span className={styles.kpiSub} style={{ color: '#10b981' }}>+5% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className="card">
            <div className={styles.cardHeader}>
              <h3>Recent Offers</h3>
              <span className={styles.viewAll}>View All</span>
            </div>
            <div className="table-container">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>OFFER #</th>
                    <th>CUSTOMER</th>
                    <th>VALUE</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o, i) => {
                    const sc = STATUS_COLORS[o.status] || {};
                    return (
                      <tr key={i}>
                        <td><span className={styles.offerId}>{o.id}</span></td>
                        <td><strong>{o.customer}</strong></td>
                        <td><strong style={{ color: '#10b981' }}>{o.value}</strong></td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {o.status}
                          </span>
                        </td>
                        <td><span className={styles.date}>{o.date}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className={styles.cardHeader}>
              <h3>Offer Conversion Funnel</h3>
            </div>
            <div className={styles.funnelContainer}>
              <div className={styles.funnelBars}>
                {funnelData.map((d, i) => {
                  const pct = (d.count / maxFunnel) * 100;
                  return (
                    <div key={i} className={styles.funnelRow}>
                      <span className={styles.funnelLabel}>{d.label}</span>
                      <div className={styles.funnelTrack}>
                        <div className={styles.funnelFill} style={{ width: `${pct}%`, backgroundColor: d.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.funnelLegend}>
                {funnelData.map((d, i) => (
                  <div key={i} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: d.color }}></span>
                    <span className={styles.legendLabel}>{d.label}</span>
                    <strong className={styles.legendCount}>{d.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
