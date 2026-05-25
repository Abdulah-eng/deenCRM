"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Download, Banknote, CalendarDays, PieChart, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

const teamData = [
  { name: 'Team Alpha', spec: 'Screed', val: 92, color: '#3b82f6' },
  { name: 'Team Beta', spec: 'Screed', val: 68, color: '#f59e0b' },
  { name: 'Team Gamma', spec: 'Heating', val: 85, color: '#3b82f6' },
  { name: 'Team Delta', spec: 'Electrical', val: 55, color: '#f1416c' },
  { name: 'Team Epsilon', spec: 'Screed', val: 44, color: '#f1416c' },
];

export default function CapacityPlanning() {
  return (
    <>
      <Header title="Capacity Planning" subtitle="Capacity Planning" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Capacity Planning</h2>
            <p className={styles.desc}>Weekly order volume, crew utilization, and capacity reporting.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className={styles.datePicker}>
              Week 20 (May 13-17)
            </div>
            <button className="btn btn-primary" style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}>
              <Download size={16} style={{ marginRight: 6 }} /> Generate Report
            </button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Banknote size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 57,750</h2><p className={styles.kpiLabel}>Total Volume</p><p className={styles.kpiSub}>This week</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><CalendarDays size={20} /></div>
            <div><h2 className={styles.kpiVal}>31</h2><p className={styles.kpiLabel}>Planned Orders</p><p className={styles.kpiSub}>5 crews active</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><PieChart size={20} /></div>
            <div><h2 className={styles.kpiVal}>73%</h2><p className={styles.kpiLabel}>Avg Utilization</p><p className={styles.kpiSub}>Target: 80%</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><BarChart2 size={20} /></div>
            <div><h2 className={styles.kpiVal}>27%</h2><p className={styles.kpiLabel}>Available Capacity</p><p className={styles.kpiSub}>13 crew-days free</p></div>
          </div></div>
        </div>

        <div className={styles.chartsGrid}>
          <div className="card" style={{ padding: '24px', flex: 2 }}>
            <h3 className={styles.chartTitle}>Weekly Order Volume (€) — Current vs. Planned</h3>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}><span style={{ background: '#3b82f6' }}></span> Actual Volume</div>
              <div className={styles.legendItem}><span style={{ border: '2px solid #93c5fd', background: 'transparent' }}></span> Planned Capacity</div>
            </div>
            
            <div className={styles.mixedChartContainer}>
              <div className={styles.yAxis}>
                <span>€18K</span><span>€16K</span><span>€14K</span><span>€12K</span><span>€10K</span><span>€8K</span><span>€6K</span><span>€4K</span><span>€2K</span><span>€0K</span>
              </div>
              <div className={styles.chartArea}>
                <svg className={styles.lineOverlay} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 10 20 Q 30 40 50 40 T 90 20" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                  <circle cx="10" cy="20" r="1.5" fill="#60a5fa" />
                  <circle cx="30" cy="30" r="1.5" fill="#60a5fa" />
                  <circle cx="50" cy="40" r="1.5" fill="#60a5fa" />
                  <circle cx="70" cy="40" r="1.5" fill="#60a5fa" />
                  <circle cx="90" cy="20" r="1.5" fill="#60a5fa" />
                </svg>
                <div className={styles.barGroups}>
                  <div className={styles.barGroup}>
                    <div className={styles.bar} style={{ height: '70%', backgroundColor: '#4f46e5' }}></div>
                    <span className={styles.xLabel}>Mon</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.bar} style={{ height: '55%', backgroundColor: '#4f46e5' }}></div>
                    <span className={styles.xLabel}>Tue</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.bar} style={{ height: '45%', backgroundColor: '#4f46e5' }}></div>
                    <span className={styles.xLabel}>Wed</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.bar} style={{ height: '35%', backgroundColor: '#4f46e5' }}></div>
                    <span className={styles.xLabel}>Thu</span>
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.bar} style={{ height: '65%', backgroundColor: '#4f46e5' }}></div>
                    <span className={styles.xLabel}>Fri</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', flex: 1 }}>
            <h3 className={styles.chartTitle}>Crew Utilization by Team</h3>
            <div className={styles.teamList}>
              {teamData.map((t, i) => (
                <div key={i} className={styles.teamRow}>
                  <div className={styles.teamInfo}>
                    <span className={styles.teamName}>{t.name} <span className={styles.teamSpec}>({t.spec})</span></span>
                    <span className={styles.teamVal} style={{ color: t.color }}>{t.val}%</span>
                  </div>
                  <div className={styles.utilTrack}>
                    <div className={styles.utilFill} style={{ width: `${t.val}%`, backgroundColor: t.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
