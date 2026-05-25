"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { ClipboardList, Users, Calendar, AlertCircle, Eye, BarChart2 } from 'lucide-react';
import styles from './page.module.css';

const todaysOrders = [
  { id: 'ORD-2024-058', customer: 'Bauunternehmen GmbH', type: 'SCREED', crew: 'Team A', status: 'IN PROGRESS' },
  { id: 'ORD-2024-059', customer: 'Wohnbau AG',          type: 'HEATING', crew: 'Team C', status: 'SCHEDULED' },
  { id: 'ORD-2024-060', customer: 'Stadtbau GmbH',       type: 'SCREED', crew: 'Team B', status: 'IN PROGRESS' },
  { id: 'ORD-2024-061', customer: 'Immobilien Keller',   type: 'ELECTRICAL', crew: 'Team D', status: 'COMPLETED' },
  { id: 'ORD-2024-062', customer: 'Bau & Projekt GmbH',  type: 'SCREED', crew: 'Team A', status: 'DELAYED' },
];

const crewStatus = [
  { name: 'Team A', role: 'Main Crew', order: 'Screed · ORD-2024-058', status: 'On Site',   color: '#50cd89' },
  { name: 'Team B', role: 'Main Crew', order: 'Screed · ORD-2024-060', status: 'On Site',   color: '#50cd89' },
  { name: 'Team C', role: 'Main Crew', order: 'Heating · ORD-2024-059',status: 'Transit',   color: '#ffc700' },
  { name: 'Team D', role: 'Sub Crew',  order: 'Electrical · ORD-2024-061', status: 'Done',  color: '#a1a5b7' },
  { name: 'Team E', role: 'Sub Crew',  order: 'Screed · —',            status: 'Available', color: '#009ef7' },
];

const STATUS_COLORS = {
  'IN PROGRESS': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'SCHEDULED':   { bg: 'rgba(114,57,234,0.12)', color: '#7239ea' },
  'COMPLETED':   { bg: 'rgba(80,205,137,0.12)', color: '#50cd89' },
  'DELAYED':     { bg: 'rgba(241,65,108,0.12)', color: '#f1416c' },
};

const TYPE_COLORS = {
  'SCREED':     { bg: 'rgba(255,199,0,0.15)',  color: '#d16b11' },
  'HEATING':    { bg: 'rgba(241,65,108,0.12)', color: '#f1416c' },
  'ELECTRICAL': { bg: 'rgba(0,158,247,0.12)',  color: '#009ef7' },
};

// Weekly order volume bar chart (Mon-Fri)
const weekVol = [14, 9, 16, 11, 8];
const weekMax = Math.max(...weekVol);

export default function ManagerDashboard() {
  return (
    <>
      <Header title="Dashboard" subtitle="Dashboard" />
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h2>Manager Dashboard 👋</h2>
          <p>Operations overview — orders, crews, and today's schedule.</p>
          <span className={styles.dateChip}>📅 Monday, 18 May 2026</span>
        </div>

        {/* KPI Cards */}
        <div className={styles.kpiGrid}>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(0,158,247,0.1)', color: '#009ef7' }}>
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>31</h2>
              <p className={styles.kpiLabel}>Active Orders</p>
              <span className={styles.kpiSub} style={{ color: '#50cd89' }}>+3 today</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(80,205,137,0.1)', color: '#50cd89' }}>
              <Users size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>8</h2>
              <p className={styles.kpiLabel}>Crews on Field</p>
              <span className={styles.kpiSub} style={{ color: '#ffc700' }}>2 on break</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(255,199,0,0.1)', color: '#ffc700' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>5</h2>
              <p className={styles.kpiLabel}>Scheduled Today</p>
              <span className={styles.kpiSub} style={{ color: '#a1a5b7' }}>Next: 09:00</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(241,65,108,0.1)', color: '#f1416c' }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>3</h2>
              <p className={styles.kpiLabel}>Open Complaints</p>
              <span className={styles.kpiSub} style={{ color: '#f1416c' }}>Needs action</span>
            </div>
          </div>
        </div>

        {/* Main two-col layout */}
        <div className={styles.mainGrid}>
          {/* Left: Today's Orders */}
          <div className={styles.leftCol}>
            <div className="card">
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}><ClipboardList size={16} /> Today's Active Orders</div>
                <a className={styles.viewAll}>View All</a>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ORDER #</th>
                    <th>CUSTOMER</th>
                    <th>TYPE</th>
                    <th>CREW</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysOrders.map((o, i) => {
                    const sc = STATUS_COLORS[o.status] || {};
                    const tc = TYPE_COLORS[o.type] || {};
                    return (
                      <tr key={i}>
                        <td><span className={styles.ordId}>{o.id}</span></td>
                        <td><span className={styles.customer}>{o.customer}</span></td>
                        <td><span className={styles.typeBadge} style={{ backgroundColor: tc.bg, color: tc.color }}>{o.type}</span></td>
                        <td><span className={styles.crew}>{o.crew}</span></td>
                        <td><span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>{o.status}</span></td>
                        <td><button className={styles.eyeBtn}><Eye size={14} color="#009ef7" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Weekly volume bar chart */}
            <div className="card" style={{ marginTop: 20 }}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}><BarChart2 size={16} /> Weekly Order Volume</div>
              </div>
              <div className={styles.barChart}>
                {weekVol.map((v, i) => (
                  <div key={i} className={styles.barCol}>
                    <span className={styles.barVal}>{v}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ height: `${(v / weekMax) * 100}%` }}></div>
                    </div>
                    <span className={styles.barLabel}>{['Mon','Tue','Wed','Thu','Fri'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Crew Status + Capacity */}
          <div className={styles.rightCol}>
            <div className="card">
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}><Users size={16} /> Crew Status Today</div>
                <a className={styles.viewAll}>Manage</a>
              </div>
              <div className={styles.crewList}>
                {crewStatus.map((c, i) => (
                  <div key={i} className={styles.crewRow}>
                    <div className={styles.crewAvatar}>{c.name.replace('Team ', '')[0]}</div>
                    <div className={styles.crewInfo}>
                      <span className={styles.crewName}>{c.name} <small className={styles.crewRole}>({c.role})</small></span>
                      <span className={styles.crewOrder}>{c.order}</span>
                    </div>
                    <span className={styles.crewStatus} style={{ color: c.color }}>
                      <span className={styles.crewDot} style={{ backgroundColor: c.color }}></span>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity donut */}
            <div className="card" style={{ marginTop: 20, padding: 24 }}>
              <div className={styles.cardTitle} style={{ marginBottom: 20 }}><BarChart2 size={16} /> Capacity Utilization</div>
              <div className={styles.capacityRow}>
                <svg viewBox="0 0 100 100" className={styles.capDonut}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f1f4" strokeWidth="14" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#7239ea" strokeWidth="14"
                    strokeDasharray={`${0.73 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                    strokeDashoffset={`${0.25 * 2 * Math.PI * 38}`}
                    strokeLinecap="round" />
                  <text x="50" y="50" textAnchor="middle" dy="5" fontSize="16" fontWeight="700" fill="#1e1e2d">73%</text>
                </svg>
                <div className={styles.capInfo}>
                  <div className={styles.capItem}><span className={styles.capDot} style={{ background: '#7239ea' }}></span>Used: 73%</div>
                  <div className={styles.capItem}><span className={styles.capDot} style={{ background: '#f1f1f4' }}></span>Free: 27%</div>
                  <p className={styles.capNote}>Target: 80%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
