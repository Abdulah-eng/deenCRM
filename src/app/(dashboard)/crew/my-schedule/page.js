"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Calendar, ChevronDown, CalendarX2 } from 'lucide-react';
import styles from './page.module.css';

const weekSchedule = [
  {
    day: 'MONDAY', date: 'May 13', id: 'ORD-2024-058', customer: 'Bauunternehmen GmbH', 
    location: 'Munich', time: '07:00-16:00', area: '480 m²', status: 'IN PROGRESS', color: '#f97316'
  },
  {
    day: 'TUESDAY', date: 'May 14', id: 'ORD-2024-058', customer: 'Bauunternehmen GmbH', 
    location: 'Munich', time: '07:00-16:00', area: '480 m²', status: 'IN PROGRESS', color: '#f97316'
  },
  {
    day: 'WEDNESDAY', date: 'May 15', id: 'ORD-2024-060', customer: 'Stadtbau GmbH', 
    location: 'Augsburg', time: '07:00-16:00', area: '320 m²', status: 'SCHEDULED', color: '#f59e0b'
  },
  {
    day: 'THURSDAY', date: 'May 16', empty: true
  },
  {
    day: 'FRIDAY', date: 'May 17', id: 'ORD-2024-062', customer: 'Bau & Projekt GmbH', 
    location: 'Munich', time: '07:00-16:00', area: '480 m²', status: 'SCHEDULED', color: '#f59e0b'
  }
];

const monthlySchedule = [
  { date: 'May 13', id: 'ORD-2024-058', customer: 'Bauunternehmen GmbH', location: 'Munich', area: '480 m²', status: 'IN PROGRESS', color: '#f97316' },
  { date: 'May 14', id: 'ORD-2024-058', customer: 'Bauunternehmen GmbH', location: 'Munich', area: '480 m²', status: 'IN PROGRESS', color: '#f97316' },
  { date: 'May 15', id: 'ORD-2024-060', customer: 'Stadtbau GmbH', location: 'Augsburg', area: '320 m²', status: 'SCHEDULED', color: '#f59e0b' },
  { date: 'May 16', empty: true },
  { date: 'May 17', id: 'ORD-2024-062', customer: 'Bau & Projekt GmbH', location: 'Munich', area: '480 m²', status: 'SCHEDULED', color: '#f59e0b' },
  { date: 'May 08', id: 'ORD-2024-049', customer: 'Renovierung König', location: 'Freiburg', area: '210 m²', status: 'COMPLETED', color: '#10b981' },
  { date: 'May 07', id: 'ORD-2024-048', customer: 'Immobilien Keller', location: 'Nuremberg', area: '380 m²', status: 'COMPLETED', color: '#10b981' }
];

export default function MySchedule() {
  return (
    <>
      <Header title="My Schedule" subtitle="My Schedule" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>My Schedule</h2>
            <p className={styles.desc}>Team Alpha weekly schedule — May 2024</p>
          </div>
          <div className={styles.filterBox}>
            <span>Week 20</span>
            <ChevronDown size={16} />
          </div>
        </div>

        <div className={styles.weekGrid}>
          {weekSchedule.map((day, idx) => (
            <div key={idx} className={styles.dayCard}>
              <div className={styles.dayHeader}>
                <span className={styles.dayName}>{day.day}</span>
                <span className={styles.dayDate}>{day.date}</span>
              </div>
              
              {day.empty ? (
                <div className={styles.emptyDay}>
                  <CalendarX2 size={24} color="#a1a5b7" />
                  <span>No assignment</span>
                </div>
              ) : (
                <div className={styles.dayContent}>
                  <span className={styles.orderId} style={{ color: day.color }}>{day.id}</span>
                  <h4 className={styles.customer}>{day.customer}</h4>
                  <div className={styles.details}>
                    <span>📍 {day.location}</span>
                    <span>🕒 {day.time}</span>
                    <span>📏 {day.area}</span>
                  </div>
                  <div className={styles.badge} style={{ backgroundColor: `${day.color}1A`, color: day.color }}>
                    {day.status}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '24px' }}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><Calendar size={16} /> Monthly Schedule — May 2024</div>
          </div>
          <div className="table-container">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>LOCATION</th>
                  <th>AREA</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {monthlySchedule.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{row.date}</td>
                    {row.empty ? (
                      <>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#a1a5b7' }}>—</td>
                        <td><span className={styles.badge} style={{ backgroundColor: 'rgba(161,165,183,0.1)', color: '#a1a5b7' }}>FREE</span></td>
                      </>
                    ) : (
                      <>
                        <td style={{ color: row.color, fontSize: '11px', fontWeight: 600 }}>{row.id}</td>
                        <td><strong>{row.customer}</strong></td>
                        <td style={{ color: '#a1a5b7' }}>{row.location}</td>
                        <td style={{ color: '#f97316', fontWeight: 600 }}>{row.area}</td>
                        <td><span className={styles.badge} style={{ backgroundColor: `${row.color}1A`, color: row.color }}>{row.status}</span></td>
                      </>
                    )}
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
