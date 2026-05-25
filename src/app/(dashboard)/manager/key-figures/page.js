"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Download, Banknote, TrendingDown, Target, Calculator, PieChart, CheckSquare, LineChart as LineChartIcon } from 'lucide-react';
import styles from './page.module.css';

const tableData = [
  { date: 'May 13', orders: 8, rev: '€ 14,200', mat: '€ 8,240', crew: '€ 3,550', planDb: '€ 2,640', actualDb: '€ 2,410', margin: '17.0%', util: '91%' },
  { date: 'May 14', orders: 6, rev: '€ 10,800', mat: '€ 6,400', crew: '€ 2,400', planDb: '€ 2,200', actualDb: '€ 2,000', margin: '18.5%', util: '85%' },
  { date: 'May 15', orders: 5, rev: '€ 9,400', mat: '€ 5,500', crew: '€ 2,100', planDb: '€ 1,850', actualDb: '€ 1,800', margin: '19.1%', util: '82%' },
  { date: 'May 16', orders: 4, rev: '€ 7,600', mat: '€ 4,200', crew: '€ 1,800', planDb: '€ 1,500', actualDb: '€ 1,600', margin: '21.0%', util: '78%' },
  { date: 'May 17', orders: 9, rev: '€ 16,500', mat: '€ 9,500', crew: '€ 4,100', planDb: '€ 3,200', actualDb: '€ 2,900', margin: '17.5%', util: '95%' }
];

export default function KeyFigures() {
  return (
    <>
      <Header title="Key Figures" subtitle="Key Figures" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Key Figures</h2>
            <p className={styles.desc}>Daily revenue, costs, margins, and utilization across all operations.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className={styles.datePicker}>
              2024-05
            </div>
            <button className="btn btn-primary">
              <Download size={16} style={{ marginRight: 6 }} /> Export
            </button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Banknote size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 162,800</h2><p className={styles.kpiLabel}>Revenue (Month)</p><p className={styles.kpiSub} style={{ color: '#10b981' }}>+8.1% vs last month</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><TrendingDown size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 118,200</h2><p className={styles.kpiLabel}>Total Costs</p><p className={styles.kpiSub} style={{ color: '#10b981' }}>-3.2% vs last month</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Target size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 33,780</h2><p className={styles.kpiLabel}>Plan Margin (DB)</p><p className={styles.kpiSub}>20.8%</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Calculator size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 28,420</h2><p className={styles.kpiLabel}>Actual Margin (DB)</p><p className={styles.kpiSub}>17.5%</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><PieChart size={20} /></div>
            <div><h2 className={styles.kpiVal}>73%</h2><p className={styles.kpiLabel}>Utilization</p><p className={styles.kpiSub}>Target: 80%</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><CheckSquare size={20} /></div>
            <div><h2 className={styles.kpiVal}>28</h2><p className={styles.kpiLabel}>Completed Orders</p><p className={styles.kpiSub}>This month</p></div>
          </div></div>
        </div>

        <div className={styles.chartsGrid}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 className={styles.chartTitle}>Revenue vs Costs (Daily)</h3>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}><span style={{ background: '#3b82f6' }}></span> Revenue</div>
              <div className={styles.legendItem}><span style={{ background: '#f87171' }}></span> Costs</div>
            </div>
            <div className={styles.barChartContainer}>
              <div className={styles.yAxis}>
                <span>€16K</span><span>€14K</span><span>€12K</span><span>€10K</span><span>€8K</span><span>€6K</span><span>€4K</span><span>€2K</span><span>€0K</span>
              </div>
              <div className={styles.barGroups}>
                <div className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: '75%', backgroundColor: '#3b82f6' }}></div>
                  <div className={styles.bar} style={{ height: '50%', backgroundColor: '#f87171' }}></div>
                  <span className={styles.xLabel}>Mon</span>
                </div>
                <div className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: '65%', backgroundColor: '#3b82f6' }}></div>
                  <div className={styles.bar} style={{ height: '42%', backgroundColor: '#f87171' }}></div>
                  <span className={styles.xLabel}>Tue</span>
                </div>
                <div className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: '55%', backgroundColor: '#3b82f6' }}></div>
                  <div className={styles.bar} style={{ height: '35%', backgroundColor: '#f87171' }}></div>
                  <span className={styles.xLabel}>Wed</span>
                </div>
                <div className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: '45%', backgroundColor: '#3b82f6' }}></div>
                  <div className={styles.bar} style={{ height: '30%', backgroundColor: '#f87171' }}></div>
                  <span className={styles.xLabel}>Thu</span>
                </div>
                <div className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: '90%', backgroundColor: '#3b82f6' }}></div>
                  <div className={styles.bar} style={{ height: '55%', backgroundColor: '#f87171' }}></div>
                  <span className={styles.xLabel}>Fri</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className={styles.chartTitle}>Margin Trend (Plan vs Actual)</h3>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}><span style={{ background: '#10b981' }}></span> Plan DB</div>
              <div className={styles.legendItem}><span style={{ background: '#f59e0b' }}></span> Actual DB</div>
            </div>
            <div className={styles.lineChartContainer}>
              <div className={styles.yAxis}>
                <span>€3000</span><span>€2800</span><span>€2600</span><span>€2400</span><span>€2200</span><span>€2000</span><span>€1800</span><span>€1600</span><span>€1400</span>
              </div>
              <div className={styles.lineArea}>
                {/* Fake SVG lines for visualization purposes */}
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 10 20 Q 30 50 50 65 T 90 25" fill="none" stroke="#10b981" strokeWidth="1.5" />
                  <path d="M 10 40 Q 30 60 50 85 T 90 45" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="10" cy="20" r="1.5" fill="#10b981" />
                  <circle cx="50" cy="65" r="1.5" fill="#10b981" />
                  <circle cx="90" cy="25" r="1.5" fill="#10b981" />
                  
                  <circle cx="10" cy="40" r="1.5" fill="#f59e0b" />
                  <circle cx="50" cy="85" r="1.5" fill="#f59e0b" />
                  <circle cx="90" cy="45" r="1.5" fill="#f59e0b" />
                </svg>
                <div className={styles.xLabels}>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><LineChartIcon size={16} color="var(--primary)" /> Daily Key Figures — May 2024</div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>ORDERS</th>
                  <th>REVENUE</th>
                  <th>MATERIAL COST</th>
                  <th>CREW COST</th>
                  <th>PLAN DB</th>
                  <th>ACTUAL DB</th>
                  <th>MARGIN %</th>
                  <th>UTILIZATION</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.date}</td>
                    <td>{r.orders}</td>
                    <td style={{ color: '#3b82f6', fontWeight: 600 }}>{r.rev}</td>
                    <td style={{ color: '#a1a5b7' }}>{r.mat}</td>
                    <td style={{ color: '#a1a5b7' }}>{r.crew}</td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>{r.planDb}</td>
                    <td style={{ color: '#f59e0b', fontWeight: 600 }}>{r.actualDb}</td>
                    <td style={{ fontWeight: 700 }}>{r.margin}</td>
                    <td>
                      <div className={styles.utilBox}>
                        <div className={styles.utilTrack}>
                          <div className={styles.utilFill} style={{ width: r.util }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>{r.util}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
