"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ChevronLeft, ChevronRight, Users, Calendar, X, Info } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const DAYS = ['MO 13', 'DI 14', 'MI 15', 'DO 16', 'FR 17'];
const TIMES = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

const crewRows = [
  { name: 'Team Alpha', mon: 'ORD-2024-058 · Estrich', monColor: '#3b82f6', tue: '—', wed: '—', thu: '—', fri: '—' },
  { name: 'Team Beta',  mon: '—', tue: '—', wed: 'ORD-2024-060 · Estrich', wedColor: '#3b82f6', thu: '—', fri: '—' },
  { name: 'Team Gamma', mon: '—', tue: 'ORD-2024-059 · Heizung', tueColor: '#10b981', wed: '—', thu: '—', fri: '—' },
  { name: 'Team Delta', mon: '—', tue: '—', wed: '—', thu: 'ORD-2024-061 · Elektro', thuColor: '#f1416c', fri: '—' },
];

export default function ManagerScheduling() {
  const [view, setView] = useState('schedule');
  const [toast, setToast] = useState(true);
  const [orderBlocks, setOrderBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderPositions, setOrderPositions] = useState([]);
  const [orderActivities, setOrderActivities] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [newActivity, setNewActivity] = useState('');

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
            title: o.customers?.name || 'Unbekannt',
            sub: `${o.type === 'SCREED' ? 'Estrich' : o.type === 'HEATING' ? 'Heizung' : 'Elektro'} · ${o.crews?.name || 'Nicht zugewiesen'} · ${o.location || ''}`,
            color: o.status === 'COMPLETED' ? 'rgba(80,205,137,0.12)' : o.status === 'IN PROGRESS' ? 'rgba(0,158,247,0.12)' : o.status === 'DELAYED' ? 'rgba(241,65,108,0.12)' : 'rgba(114,57,234,0.12)',
            border: o.status === 'COMPLETED' ? '#50cd89' : o.status === 'IN PROGRESS' ? '#009ef7' : o.status === 'DELAYED' ? '#f1416c' : '#7239ea',
            text: o.status === 'COMPLETED' ? '#186234' : o.status === 'IN PROGRESS' ? '#005b8f' : o.status === 'DELAYED' ? '#8a1835' : '#411599',
            fullData: o
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

  const openOrderDetails = async (block) => {
    setSelectedOrder(block);
    setDetailsLoading(true);
    // Fetch positions
    const { data: pos } = await supabase.from('order_positions').select('*').eq('order_id', block.id);
    if (pos) setOrderPositions(pos);
    // Fetch activities
    const { data: acts } = await supabase.from('order_activities').select('*, profiles(full_name)').eq('order_id', block.id).order('created_at', { ascending: false });
    if (acts) setOrderActivities(acts);
    setDetailsLoading(false);
  };

  const handleAddActivity = async () => {
    if (!newActivity.trim() || !selectedOrder) return;
    const { data, error } = await supabase.from('order_activities').insert([{
      order_id: selectedOrder.id,
      activity_type: 'NOTE_ADDED',
      description: newActivity.trim()
    }]).select('*, profiles(full_name)').single();
    if (!error && data) {
      setOrderActivities([data, ...orderActivities]);
      setNewActivity('');
    }
  };

  return (
    <>
      <Header title="Terminplanung" subtitle="Terminplanung" />
      <div className={styles.container}>

        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Terminplanung</h2>
            <p className={styles.pageDesc}>Auftragstermine verwalten, Teams zuweisen und Wochenplan anzeigen. Ziehen Sie Termine per Drag & Drop, um sie zu verschieben.</p>
          </div>
        </div>

        {/* Controls bar */}
        <div className={styles.controlsBar}>
          <div className={styles.viewTabs}>
            <button
              className={`${styles.tabBtn} ${view === 'schedule' ? styles.tabActive : ''}`}
              onClick={() => setView('schedule')}
            >
              <Calendar size={14} /> Kalenderansicht
            </button>
            <button
              className={`${styles.tabBtn} ${view === 'crew' ? styles.tabActive : ''}`}
              onClick={() => setView('crew')}
            >
              <Users size={14} /> Teamansicht
            </button>
          </div>

          <div className={styles.weekNav}>
            <button className={styles.navArrow}><ChevronLeft size={16} /></button>
            <span className={styles.weekLabel}>Woche 20 — Mai 2024</span>
            <button className={styles.navArrow}><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className={styles.toast}>
            <Info size={14} color="#009ef7" />
            <span>Ziehen Sie die Termine per Drag & Drop, um sie direkt in der Datenbank zu verschieben.</span>
            <button className={styles.toastClose} onClick={() => setToast(false)}><X size={13} /></button>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {view === 'schedule' && (
          <div className={`card ${styles.calendarCard}`}>
            {loading ? (
               <div style={{ padding: '60px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Terminkalender wird geladen...</div>
            ) : (
              <div className={styles.calGrid}>
                {/* Header row */}
                <div className={styles.timeCol}>
                  <div className={styles.cornerCell}>ZEIT</div>
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
                            onClick={() => openOrderDetails(b)}
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
                    <th style={{ minWidth: 160 }}>TEAM</th>
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

      {/* Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e1e2d', width: '90%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedOrder.color, borderLeft: `5px solid ${selectedOrder.border}` }}>
              <div>
                <h2 style={{ margin: 0, color: selectedOrder.text, fontSize: '20px' }}>{selectedOrder.display_id} · {selectedOrder.title}</h2>
                <div style={{ fontSize: '14px', color: selectedOrder.text, opacity: 0.8, marginTop: '4px' }}>{selectedOrder.sub}</div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: selectedOrder.text, cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Column: Details & Positions */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>Leistungen & Material</h3>
                {detailsLoading ? <p style={{color: '#888'}}>Lade Details...</p> : (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
                    {orderPositions.length === 0 ? <p style={{color: '#888', margin: 0}}>Keine Positionen gefunden.</p> : (
                      orderPositions.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ color: '#e2e8f0' }}>{p.description}</span>
                          <strong style={{ color: '#50cd89' }}>{p.quantity} {p.unit}</strong>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Activities (Timeline) */}
              <div style={{ width: '350px', padding: '20px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>Aktivitäten & Notizen</h3>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="Notiz hinzufügen..." 
                    value={newActivity}
                    onChange={e => setNewActivity(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                  />
                  <button onClick={handleAddActivity} style={{ background: '#7239ea', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', cursor: 'pointer' }}>Add</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orderActivities.length === 0 && !detailsLoading && <p style={{color: '#888'}}>Keine Aktivitäten gefunden.</p>}
                  {orderActivities.map(act => (
                    <div key={act.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #7239ea' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{act.profiles?.full_name || 'System'}</span>
                        <span>{new Date(act.created_at).toLocaleDateString('de-DE')} {new Date(act.created_at).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <div style={{ color: '#e2e8f0', fontSize: '14px' }}>{act.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
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
