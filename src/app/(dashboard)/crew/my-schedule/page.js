'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Header from '@/components/layout/Header';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import styles from './page.module.css';

export default function MySchedulePage() {
  const [orders, setOrders] = useState([]);
  const [crews, setCrews] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(today.setDate(diff));
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('id, display_id, type, scheduled_date, start_hour, span_hours, location, customers(name), crews(name, id)')
      .not('scheduled_date', 'is', null);
      
    if (data) {
      setOrders(data);
      
      const uniqueCrews = Array.from(
        new Set(data.map(o => o.crews?.name).filter(Boolean))
      ).map(name => {
        const crewData = data.find(o => o.crews?.name === name);
        return { name, id: crewData.crews.id };
      });
      setCrews(uniqueCrews);
    }
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  const getDayDates = () => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getDayDates();
  const weekStartStr = weekDates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const weekEndStr = weekDates[4].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  const getFilteredOrdersForDate = (dateObj) => {
    return orders.filter(o => {
      const oDate = new Date(o.scheduled_date);
      const isSameDate = oDate.toDateString() === dateObj.toDateString();
      const matchesCrew = selectedCrew ? o.crews?.id === selectedCrew : true;
      return isSameDate && matchesCrew;
    }).sort((a, b) => {
      const timeA = a.start_hour ? parseInt(a.start_hour.split(':')[0]) : 0;
      const timeB = b.start_hour ? parseInt(b.start_hour.split(':')[0]) : 0;
      return timeA - timeB;
    });
  };

  return (
    <div className={styles.container}>
      <Header title="My Schedule" userName="Crew Member" />
      
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Weekly Schedule</h1>
          <p className={styles.desc}>Manage your upcoming appointments and tasks.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
            <button onClick={() => navigateWeek(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><ChevronLeft size={18} /></button>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--header-text)', minWidth: '130px', textAlign: 'center' }}>
              {weekStartStr} - {weekEndStr}
            </span>
            <button onClick={() => navigateWeek(1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}><ChevronRight size={18} /></button>
          </div>

          <select 
            className={styles.filterBox} 
            value={selectedCrew} 
            onChange={e => setSelectedCrew(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--card-border)', borderRadius: '6px', background: 'var(--card-bg)' }}
          >
            <option value="">All Crews</option>
            {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.weekGrid}>
        {weekDates.map((date, index) => {
          const dayOrders = getFilteredOrdersForDate(date);
          const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
          const dayDateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div key={index} className={styles.dayCard} style={{ borderColor: isToday ? '#d95319' : undefined }}>
              <div className={styles.dayHeader}>
                <span className={styles.dayName}>{dayName.toUpperCase()}</span>
                <span className={styles.dayDate} style={{ color: isToday ? '#d95319' : undefined }}>{dayDateStr}</span>
              </div>
              
              <div className={styles.dayContent}>
                {dayOrders.length === 0 ? (
                  <div className={styles.emptyDay}>
                    <CalendarIcon size={24} style={{ opacity: 0.5 }} />
                    No scheduled orders
                  </div>
                ) : (
                  dayOrders.map(order => (
                    <div key={order.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--card-border)', borderRadius: '6px', marginBottom: '12px' }}>
                      <div className={styles.orderId}>{order.display_id || order.id.slice(0,8)}</div>
                      <div className={styles.customer}>{order.customers?.name || 'Unknown Customer'}</div>
                      <div className={styles.details}>
                        <span><Clock size={12} /> {order.start_hour || 'TBD'} {order.span_hours ? `(${order.span_hours}h)` : ''}</span>
                      </div>
                      <span className={styles.badge} style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none' }}>
                        {order.type || 'Standard'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
