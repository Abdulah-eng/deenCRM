"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ChevronLeft, ChevronRight, Users, Calendar, X, Info } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const DAYS = ['MON 13', 'TUE 14', 'WED 15', 'THU 16', 'FRI 17'];
const TIMES = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const crewRows = [
  { name: 'Team Alpha', mon: 'ORD-2024-058 · Screed', monColor: '#3b82f6', tue: '—', wed: '—', thu: '—', fri: '—' },
  { name: 'Team Beta',  mon: '—', tue: '—', wed: 'ORD-2024-060 · Screed', wedColor: '#3b82f6', thu: '—', fri: '—' },
  { name: 'Team Gamma', mon: '—', tue: 'ORD-2024-059 · Heating', tueColor: '#10b981', wed: '—', thu: '—', fri: '—' },
  { name: 'Team Delta', mon: '—', tue: '—', wed: '—', thu: 'ORD-2024-061 · Electrical', thuColor: '#f1416c', fri: '—' },
];

export default function ManagerScheduling() {
  const [view, setView] = useState('schedule');
  const [toast, setToast] = useState(true);
  const [orderBlocks, setOrderBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const CELL_H = 60; // px per hour
  const START_HOUR = 7;

  useEffect(() => {
    async function fetchSchedule() {
      const { data, error } = await supabase
        .from('orders')
        .select('id, display_id, type, location, start_hour, span_hours, scheduled_date, customers(name), crews(name, color)')
        .not('scheduled_date', 'is', null);

      if (!error && data) {
        const blocks = data.map(o => {
          // Calculate day index (0-4) based on scheduled_date
          const date = new Date(o.scheduled_date);
          const dayIndex = date.getDay() - 1; // Mon = 0
          
          return {
            id: o.id,
            display_id: o.display_id,
            day: dayIndex >= 0 && dayIndex <= 4 ? dayIndex : 0,
            startHour: o.start_hour || 7,
            span: o.span_hours || 1,
            title: o.customers?.name || 'Unknown',
            sub: `${o.type === 'SCREED' ? 'Screed' : o.type === 'HEATING' ? 'Heating' : 'Electrical'} · ${o.crews?.name || 'Unassigned'} · ${o.location || ''}`,
            color: o.crews?.color ? `${o.crews.color}22` : '#fef3c7',
            border: o.crews?.color || '#f59e0b',
            text: o.crews?.color || '#92400e',
          };
        });
        setOrderBlocks(blocks);
      }
      setLoading(false);
    }
    fetchSchedule();
  }, []);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDrop = async (e, targetDayIndex) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let newStartHour = Math.floor(y / CELL_H) + START_HOUR;
    
    if (newStartHour < START_HOUR) newStartHour = START_HOUR;
    if (newStartHour > START_HOUR + TIMES.length - 1) newStartHour = START_HOUR + TIMES.length - 1;

    // Optimistic UI update
    setOrderBlocks(prev => prev.map(block => 
      block.id === orderId ? { ...block, day: targetDayIndex, startHour: newStartHour } : block
    ));

    // Calculate new date based on base week (May 13, 2024 is Mon)
    const baseDate = new Date('2024-05-13');
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + targetDayIndex);
    const newDateStr = targetDate.toISOString().split('T')[0];

    // Persist to Supabase
    await supabase.from('orders')
      .update({ start_hour: newStartHour, scheduled_date: newDateStr })
      .eq('id', orderId);
  };

  return (
    <>
      <Header title="Scheduling" subtitle="Scheduling" />
      <div className={styles.container}>

        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Scheduling</h2>
            <p className={styles.pageDesc}>Manage order appointments, assign crews, and view weekly schedule. Drag and drop appointments to reschedule.</p>
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
            <span>Drag and drop blocks to reschedule them directly in the database.</span>
            <button className={styles.toastClose} onClick={() => setToast(false)}><X size={13} /></button>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {view === 'schedule' && (
          <div className={`card ${styles.calendarCard}`}>
            {loading ? (
               <div style={{ padding: '60px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Loading schedule...</div>
            ) : (
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
                    <div 
                      className={styles.dayBody} 
                      style={{ '--cell-h': `${CELL_H}px`, '--num-hours': TIMES.length }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, di)}
                    >
                      {/* Hour grid lines */}
                      {TIMES.map((_, hi) => (
                        <div key={hi} className={styles.hourLine} style={{ top: hi * CELL_H }} />
                      ))}
                      {/* Order blocks */}
                      {orderBlocks
                        .filter(b => b.day === di)
                        .map((b, bi) => (
                          <div
                            key={b.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, b.id)}
                            onDragEnd={handleDragEnd}
                            className={styles.orderBlock}
                            style={{
                              top: (b.startHour - START_HOUR) * CELL_H + 2,
                              height: b.span * CELL_H - 4,
                              backgroundColor: b.color,
                              borderLeft: `4px solid ${b.border}`,
                              color: b.text,
                              cursor: 'grab'
                            }}
                          >
                            <strong className={styles.blockId}>{b.display_id} · {b.title}</strong>
                            <span className={styles.blockSub}>{b.sub}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
