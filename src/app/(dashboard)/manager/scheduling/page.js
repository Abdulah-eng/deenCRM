"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { ChevronLeft, ChevronRight, Users, Calendar, X, Info } from 'lucide-react';
import styles from './page.module.css';

const DAYS = ['MON 13', 'TUE 14', 'WED 15', 'THU 16', 'FRI 17'];
const TIMES = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

// Each order block: day index (0-4), startHour, spanHours, color
const orderBlocks = [
  { day: 0, startHour: 7, span: 1, id: 'ORD-058', title: 'Bauunternehmen', sub: 'Screed · Team A · Munich',   color: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
  { day: 1, startHour: 9, span: 1, id: 'ORD-059', title: 'Wohnbau AG',    sub: 'Heating · Team C · Stuttgart', color: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  { day: 2, startHour: 8, span: 1, id: 'ORD-060', title: 'Stadtbau GmbH', sub: 'Screed · Team B · Augsburg',   color: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
  { day: 3, startHour: 10,span: 1, id: 'ORD-061', title: 'Immobilien Keller', sub: 'Electrical · Team D',      color: '#dcfce7', border: '#22c55e', text: '#15803d' },
  { day: 4, startHour: 7, span: 1, id: 'ORD-062', title: 'Bau & Projekt GmbH', sub: 'Screed · Team A · Munich', color: '#fee2e2', border: '#ef4444', text: '#b91c1c' },
];

const crewRows = [
  { name: 'Team A (Main)',  mon: 'ORD-058 · Screed · Munich',     monColor: '#3b82f6', tue: '—', wed: '—', thu: '—', fri: 'ORD-062 · Screed · Munich', friColor: '#ef4444' },
  { name: 'Team B (Main)',  mon: '—', tue: '—', wed: 'ORD-060 · Screed · Augsburg', wedColor: '#3b82f6', thu: '—', fri: '—' },
  { name: 'Team C (Main)',  mon: '—', tue: 'ORD-059 · Heating · Stuttgart', tueColor: '#f59e0b', wed: '—', thu: '—', fri: '—' },
  { name: 'Team D (Sub)',   mon: '—', tue: '—', wed: '—', thu: 'ORD-061 · Electrical · Nürnberg', thuColor: '#22c55e', fri: '—' },
  { name: 'Team E (Sub)',   mon: '—', tue: '—', wed: '—', thu: '—', fri: '—' },
];

export default function ManagerScheduling() {
  const [view, setView] = useState('schedule');
  const [toast, setToast] = useState(true);

  const CELL_H = 60; // px per hour
  const START_HOUR = 7;

  return (
    <>
      <Header title="Scheduling" subtitle="Scheduling" />
      <div className={styles.container}>

        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Scheduling</h2>
            <p className={styles.pageDesc}>Manage order appointments, assign crews, and view weekly schedule.</p>
          </div>
        </div>

        {/* Controls bar */}
        <div className={styles.controlsBar}>
          <div className={styles.viewTabs}>
            <button
              className={`${styles.tabBtn} ${view === 'schedule' ? styles.tabActive : ''}`}
              onClick={() => setView('schedule')}
            >
              <Calendar size={14} /> Schedule View
            </button>
            <button
              className={`${styles.tabBtn} ${view === 'crew' ? styles.tabActive : ''}`}
              onClick={() => setView('crew')}
            >
              <Users size={14} /> Crew View
            </button>
          </div>

          <div className={styles.weekNav}>
            <button className={styles.navArrow}><ChevronLeft size={16} /></button>
            <span className={styles.weekLabel}>Week 20 — May 2024</span>
            <button className={styles.navArrow}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className={styles.toast}>
            <Info size={14} color="#009ef7" />
            <span>Order details opened</span>
            <button className={styles.toastClose} onClick={() => setToast(false)}><X size={13} /></button>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {view === 'schedule' && (
          <div className={`card ${styles.calendarCard}`}>
            <div className={styles.calGrid}>
              {/* Header row */}
              <div className={styles.timeCol}>
                <div className={styles.cornerCell}>TIME</div>
                {TIMES.map(t => (
                  <div key={t} className={styles.timeCell}>{t}</div>
                ))}
              </div>

              {DAYS.map((day, di) => (
                <div key={di} className={styles.dayCol}>
                  <div className={styles.dayHeader}>{day}</div>
                  <div className={styles.dayBody} style={{ '--cell-h': `${CELL_H}px`, '--num-hours': TIMES.length }}>
                    {/* Hour grid lines */}
                    {TIMES.map((_, hi) => (
                      <div key={hi} className={styles.hourLine} style={{ top: hi * CELL_H }} />
                    ))}
                    {/* Order blocks */}
                    {orderBlocks
                      .filter(b => b.day === di)
                      .map((b, bi) => (
                        <div
                          key={bi}
                          className={styles.orderBlock}
                          style={{
                            top: (b.startHour - START_HOUR) * CELL_H + 2,
                            height: b.span * CELL_H - 4,
                            backgroundColor: b.color,
                            borderLeft: `4px solid ${b.border}`,
                            color: b.text,
                          }}
                        >
                          <strong className={styles.blockId}>{b.id} · {b.title}</strong>
                          <span className={styles.blockSub}>{b.sub}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREW VIEW */}
        {view === 'crew' && (
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ minWidth: 160 }}>CREW</th>
                    {DAYS.map(d => <th key={d}>{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {crewRows.map((row, ri) => (
                    <tr key={ri}>
                      <td><strong className={styles.crewName}>{row.name}</strong></td>
                      <td><CrewCell text={row.mon} color={row.monColor} /></td>
                      <td><CrewCell text={row.tue} color={row.tueColor} /></td>
                      <td><CrewCell text={row.wed} color={row.wedColor} /></td>
                      <td><CrewCell text={row.thu} color={row.thuColor} /></td>
                      <td><CrewCell text={row.fri} color={row.friColor} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function CrewCell({ text, color }) {
  if (!text || text === '—') return <span style={{ color: '#d1d5db' }}>—</span>;
  return (
    <div style={{
      background: color ? `${color}18` : 'transparent',
      borderLeft: color ? `3px solid ${color}` : 'none',
      padding: '6px 10px',
      borderRadius: '4px',
      fontSize: '11px',
      color: color || '#5e6278',
      fontWeight: 500,
    }}>
      {text}
    </div>
  );
}
