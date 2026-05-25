"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Download, Calculator, FileText, TrendingUp, TrendingDown, Eye, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';

const records = [
  { id: 'ORD-2024-049', customer: 'Renovierung König', type: 'HEATING', revenue: '€ 4,200', planDb: '€ 2,100', matCost: '€ 1,890', crewCost: '€ 210', actualDb: '€ 1,710', variance: '+€ 180', result: 'PROFIT' },
  { id: 'ORD-2024-041', customer: 'Wohnbau AG', type: 'SCREED', revenue: '€ 32,500', planDb: '€ 8,125', matCost: '€ 6,500', crewCost: '€ 2,000', actualDb: '€ 5,800', variance: '+€ 700', result: 'PROFIT' },
  { id: 'ORD-2024-035', customer: 'Bauunternehmen', type: 'SCREED', revenue: '€ 9,600', planDb: '€ 2,400', matCost: '€ 2,580', crewCost: '€ 800', actualDb: '€ 1,980', variance: '-€ 180', result: 'LOSS' },
  { id: 'ORD-2024-028', customer: 'Stadtbau GmbH', type: 'SCREED', revenue: '€ 12,350', planDb: '€ 3,088', matCost: '€ 2,900', crewCost: '€ 1,100', actualDb: '€ 2,650', variance: '+€ 188', result: 'PROFIT' },
  { id: 'ORD-2024-021', customer: 'Immobilien Keller', type: 'ELECTRICAL', revenue: '€ 5,800', planDb: '€ 1,450', matCost: '€ 1,380', crewCost: '€ 400', actualDb: '€ 1,300', variance: '+€ 70', result: 'PROFIT' },
];

export default function PostCalculation() {
  return (
    <>
      <Header title="Post-Calculation" subtitle="Post-Calculation" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Post-Calculation</h2>
            <p className={styles.desc}>Plan DB vs Actual DB — cost analysis per completed order.</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#a61a2f', borderColor: '#a61a2f' }}>
            <Download size={16} style={{ marginRight: 6 }} /> Export Report
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><FileText size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 64,450</h2><p className={styles.kpiLabel}>Total Revenue</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><TrendingUp size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 17,163</h2><p className={styles.kpiLabel}>Total Plan DB</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Calculator size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 15,140</h2><p className={styles.kpiLabel}>Total Actual DB</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><TrendingUp size={20} /></div>
            <div><h2 className={styles.kpiVal} style={{ color: '#10b981' }}>+€ 1,340</h2><p className={styles.kpiLabel}>DB Variance</p></div>
          </div></div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><Calculator size={16} color="#a61a2f" /> Order Post-Calculation</div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>TYPE</th>
                  <th>REVENUE</th>
                  <th>PLAN DB</th>
                  <th>MAT. COST</th>
                  <th>CREW COST</th>
                  <th>ACTUAL DB</th>
                  <th>VARIANCE</th>
                  <th>RESULT</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => {
                  const isProfit = r.result === 'PROFIT';
                  return (
                    <tr key={i}>
                      <td style={{ color: '#a61a2f', fontWeight: 600, fontSize: '12px' }}>{r.id}</td>
                      <td><strong>{r.customer}</strong></td>
                      <td>
                        <span className={styles.badge} style={{ backgroundColor: 'rgba(241,65,108,0.1)', color: '#f1416c' }}>
                          {r.type}
                        </span>
                      </td>
                      <td><strong>{r.revenue}</strong></td>
                      <td style={{ color: '#3b82f6', fontWeight: 600 }}>{r.planDb}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 600 }}>{r.matCost}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 600 }}>{r.crewCost}</td>
                      <td style={{ color: '#10b981', fontWeight: 600 }}>{r.actualDb}</td>
                      <td style={{ color: isProfit ? '#10b981' : '#f1416c', fontWeight: 700 }}>{r.variance}</td>
                      <td style={{ color: isProfit ? '#10b981' : '#f1416c', fontWeight: 700, fontSize: '11px' }}>{r.result}</td>
                      <td>
                        <button className={styles.actionBtn}>
                          <Eye size={14} color="#a61a2f" />
                        </button>
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
