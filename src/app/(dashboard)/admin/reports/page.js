"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Building2, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

const companyData = [
  { name: 'Heiz Werke Süddeutschland', iconColor: '#f97316', orders: 24, rev: '€ 198.400', plan: '€ 41.600', actual: '€ 38.200', margin: '19.3%', util: '78%' },
  { name: 'Estrich Werke Süddeutschland', iconColor: '#3b82f6', orders: 31, rev: '€ 162.800', plan: '€ 33.780', actual: '€ 28.420', margin: '17.5%', util: '65%' },
  { name: 'Elektro Werke Süddeutschland', iconColor: '#ef4444', orders: 8, rev: '€ 22.000', plan: '€ 4.500', actual: '€ 4.100', margin: '17.6%', util: '91%' },
];

export default function AdminReports() {
  return (
    <>
      <Header title="Berichte" subtitle="Berichte" />
      <div className={styles.container}>
        
        <div className={styles.chartsGrid}>
          <div className="card" style={{ padding: '24px', flex: 2 }}>
            <div className={styles.barChartHeader}>
              <div className={styles.legend}>
                <div className={styles.legendItem}><span style={{ background: '#a855f7' }}></span> Heizung</div>
                <div className={styles.legendItem}><span style={{ background: '#c084fc' }}></span> Estrich</div>
                <div className={styles.legendItem}><span style={{ background: '#d8b4fe' }}></span> Elektro</div>
              </div>
            </div>
            
            <div className={styles.barChartContainer}>
              <div className={styles.yAxis}>
                <span>€250K</span><span>€200K</span><span>€150K</span><span>€100K</span><span>€50K</span><span>€0K</span>
              </div>
              <div className={styles.barGroups}>
                {[
                  { m: 'Dez', v1: '60%', v2: '45%', v3: '30%' },
                  { m: 'Jan', v1: '70%', v2: '55%', v3: '40%' },
                  { m: 'Feb', v1: '75%', v2: '60%', v3: '45%' },
                  { m: 'Mär', v1: '65%', v2: '50%', v3: '35%' },
                  { m: 'Apr', v1: '80%', v2: '60%', v3: '45%' },
                  { m: 'Mai', v1: '78%', v2: '58%', v3: '42%' }
                ].map((d, i) => (
                  <div key={i} className={styles.barGroup}>
                    <div className={styles.barStack}>
                      <div className={styles.bar} style={{ height: d.v1, backgroundColor: '#a855f7' }}></div>
                      <div className={styles.bar} style={{ height: d.v2, backgroundColor: '#c084fc' }}></div>
                      <div className={styles.bar} style={{ height: d.v3, backgroundColor: '#d8b4fe' }}></div>
                    </div>
                    <span className={styles.xLabel}>{d.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className={styles.donutContainer}>
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="25 100" strokeDashoffset="0"></circle>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="10 100" strokeDashoffset="-25"></circle>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="35 100" strokeDashoffset="-35"></circle>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="30 100" strokeDashoffset="-70"></circle>
              </svg>
            </div>
            <div className={styles.donutLegend}>
              <div className={styles.dlItem}>
                <div><span style={{ backgroundColor: '#10b981' }}></span> Abgeschlossen</div>
                <strong>28</strong>
              </div>
              <div className={styles.dlItem}>
                <div><span style={{ backgroundColor: '#3b82f6' }}></span> In Arbeit</div>
                <strong>21</strong>
              </div>
              <div className={styles.dlItem}>
                <div><span style={{ backgroundColor: '#f59e0b' }}></span> Geplant</div>
                <strong>10</strong>
              </div>
              <div className={styles.dlItem}>
                <div><span style={{ backgroundColor: '#ef4444' }}></span> Reklamation</div>
                <strong>4</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><Building2 size={16} color="var(--primary)" /> Umsatzaufschlüsselung nach Unternehmen</div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>UNTERNEHMEN</th>
                  <th>AUFTRÄGE</th>
                  <th>UMSATZ</th>
                  <th>PLAN-DECKUNGSBEITRAG</th>
                  <th>IST-DECKUNGSBEITRAG</th>
                  <th>MARGE %</th>
                  <th>AUSLASTUNG</th>
                </tr>
              </thead>
              <tbody>
                {companyData.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: c.iconColor }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.iconColor }}></div>
                        {c.name}
                      </div>
                    </td>
                    <td>{c.orders}</td>
                    <td style={{ fontWeight: 600 }}>{c.rev}</td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>{c.plan}</td>
                    <td style={{ color: '#f59e0b', fontWeight: 600 }}>{c.actual}</td>
                    <td style={{ fontWeight: 700 }}>{c.margin}</td>
                    <td>
                      <div className={styles.utilBox}>
                        <div className={styles.utilTrack}>
                          <div className={styles.utilFill} style={{ width: c.util, backgroundColor: '#7239ea' }}></div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#a1a5b7' }}>{c.util}</span>
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
