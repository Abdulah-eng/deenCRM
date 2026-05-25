"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { MapPin, Clock, CalendarDays, CheckCircle2, TrendingUp, Grid, Info, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

const assignments = [
  {
    id: 'ORD-2024-058',
    customer: 'Bauunternehmen GmbH',
    task: 'Screed — Anhydrite CA-F5',
    address: 'Musterstraße 15, 80331 Munich',
    area: '480 m²',
    time: '07:00 - 16:00',
    status: 'IN PROGRESS',
    color: '#f97316'
  },
  {
    id: 'ORD-2024-060',
    customer: 'Stadtbau GmbH',
    task: 'Screed — Cement CT-C20',
    address: 'Hauptstraße 22, 86150 Augsburg',
    area: '320 m²',
    time: '11:00 - 18:00',
    status: 'SCHEDULED',
    color: '#f59e0b'
  },
  {
    id: 'ORD-2024-062',
    customer: 'Bau & Projekt GmbH',
    task: 'Screed — Anhydrite CA-F5',
    address: 'Bahnhofstr. 5, 80335 Munich',
    area: '480 m²',
    time: 'Tomorrow 07:00',
    status: 'TOMORROW',
    color: '#3b82f6'
  }
];

export default function MyDashboard() {
  return (
    <>
      <Header title="My Dashboard" subtitle="My Dashboard" />
      <div className={styles.container}>
        
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>Good Morning, Klaus! 👷‍♂️</h1>
            <p>Here are your assignments for today — Monday, 18 May 2026</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}>
            <CheckCircle2 size={16} style={{ marginRight: 6 }} /> Update Status
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}><CalendarDays size={20} /></div>
            <div><h2 className={styles.kpiVal}>3</h2><p className={styles.kpiLabel}>Orders Today</p><p className={styles.kpiSub}>2 in progress</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Grid size={20} /></div>
            <div><h2 className={styles.kpiVal}>1,280</h2><p className={styles.kpiLabel}>m² Today</p><p className={styles.kpiSub}>on 3 sites</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><TrendingUp size={20} /></div>
            <div><h2 className={styles.kpiVal}>4,820</h2><p className={styles.kpiLabel}>This Week (m²)</p><p className={styles.kpiSub}>Target: 5,500</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><CheckCircle2 size={20} /></div>
            <div><h2 className={styles.kpiVal}>87%</h2><p className={styles.kpiLabel}>Completion Rate</p><p className={styles.kpiSub}>This month</p></div>
          </div></div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftCol}>
            <div className="card" style={{ padding: '24px' }}>
              <div className={styles.sectionTitle}>
                <CalendarDays size={18} /> Today's Assignments
              </div>
              <div className={styles.assignmentList}>
                {assignments.map(a => (
                  <div key={a.id} className={styles.assignmentCard} style={{ borderLeftColor: a.color }}>
                    <div className={styles.assignmentHeader}>
                      <div>
                        <span className={styles.orderId}>{a.id}</span>
                        <h3>{a.customer}</h3>
                      </div>
                      <div className={styles.statusCol}>
                        <span className={styles.badge} style={{ borderColor: a.color, color: a.color }}>{a.status}</span>
                        {a.status !== 'TOMORROW' && (
                          <button className={styles.updateBtn} style={{ backgroundColor: a.color }}>Update Status</button>
                        )}
                      </div>
                    </div>
                    <div className={styles.assignmentDetails}>
                      <div className={styles.detailRow}><span>🛠</span> {a.task}</div>
                      <div className={styles.detailRow}><MapPin size={14} /> {a.address}</div>
                      <div className={styles.detailRow}><Grid size={14} /> {a.area} <span style={{ margin: '0 8px', color: 'var(--card-border)' }}>|</span> <Clock size={14} /> {a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div className={styles.sectionTitle}>
                <Info size={18} /> Quick Info
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoRow}><span>My Team</span><strong>Team Alpha</strong></div>
                <div className={styles.infoRow}><span>Specialty</span><strong>Screed Works</strong></div>
                <div className={styles.infoRow}><span>Team Size</span><strong>4 workers</strong></div>
                <div className={styles.infoRow}><span>Orders This Month</span><strong>18</strong></div>
                <div className={styles.infoRow}><span>m² This Month</span><strong>8,640</strong></div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div className={styles.sectionTitle}>
                <BarChart2 size={18} /> My m² This Week
              </div>
              <div className={styles.chartArea}>
                <div className={styles.yAxis}>
                  <span>1,400</span><span>1,200</span><span>1,000</span><span>800</span><span>600</span><span>400</span><span>200</span>
                </div>
                <div className={styles.chartBars}>
                  <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '60%' }}></div></div>
                  <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '80%' }}></div></div>
                  <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '40%' }}></div></div>
                  <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '100%' }}></div></div>
                  <div className={styles.barWrapper}><div className={styles.bar} style={{ height: '30%' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
