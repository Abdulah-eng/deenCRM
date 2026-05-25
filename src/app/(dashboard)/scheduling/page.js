"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import styles from './page.module.css';

export default function SchedulingPage() {
  const [view, setView] = useState('schedule'); // schedule | crew

  const days = [
    { name: 'MON 13', date: '2024-05-13' },
    { name: 'TUE 14', date: '2024-05-14' },
    { name: 'WED 15', date: '2024-05-15' },
    { name: 'THU 16', date: '2024-05-16' },
    { name: 'FRI 17', date: '2024-05-17' },
  ];

  const times = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const jobs = [
    {
      id: 'ORD-058',
      company: 'Bauunternehmen',
      crew: 'Screed · Team A · Munich',
      day: 0, // Monday
      startIdx: 0, // 07:00
      span: 2, // 2 hours
      color: '#e1f0ff',
      textColor: '#0055ff'
    },
    {
      id: 'ORD-060',
      company: 'Stadtbau GmbH',
      crew: 'Screed · Team B · Augsburg',
      day: 2, // Wednesday
      startIdx: 1, // 08:00
      span: 1.5,
      color: '#e1f0ff',
      textColor: '#0055ff'
    },
    {
      id: 'ORD-059',
      company: 'Wohnbau AG',
      crew: 'Heating · Team C · Stuttgart',
      day: 1, // Tuesday
      startIdx: 2, // 09:00
      span: 1.5,
      color: '#fff3cd',
      textColor: '#856404'
    },
    {
      id: 'ORD-061',
      company: 'Immobilien Keller',
      crew: 'Electrical · Team D',
      day: 3, // Thursday
      startIdx: 3, // 10:00
      span: 1.5,
      color: '#d4edda',
      textColor: '#155724'
    },
    {
      id: 'ORD-062',
      company: 'Bau & Projekt',
      crew: 'Screed · Team A · Munich',
      day: 4, // Friday
      startIdx: 0, // 07:00
      span: 2,
      color: '#f8d7da',
      textColor: '#721c24',
      borderLeft: '#dc3545'
    }
  ];

  return (
    <>
      <Header title="Scheduling" subtitle="Scheduling" />
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.description}>Manage order appointments, assign crews, and view weekly schedule.</p>
          
          <div className={styles.controls}>
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.toggleBtn} ${view === 'schedule' ? styles.active : ''}`}
                onClick={() => setView('schedule')}
              >
                <Calendar size={16} /> Schedule View
              </button>
              <button 
                className={`${styles.toggleBtn} ${view === 'crew' ? styles.active : ''}`}
                onClick={() => setView('crew')}
              >
                <Users size={16} /> Crew View
              </button>
            </div>
            
            <div className={styles.weekSelector}>
              <button className={styles.navBtn}><ChevronLeft size={16} /></button>
              <span className={styles.weekText}>Week 20 — May 2024</span>
              <button className={styles.navBtn}><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className={styles.calendarCard}>
          <div className={styles.grid}>
            {/* Header Row */}
            <div className={styles.timeColumn}>TIME</div>
            {days.map((day, idx) => (
              <div key={idx} className={styles.dayHeader}>{day.name}</div>
            ))}
            
            {/* Grid Body */}
            <div className={styles.gridBody}>
              {/* Background Lines */}
              {times.map((time, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  <div className={styles.timeCell}>{time}</div>
                  {days.map((_, colIdx) => (
                    <div key={`${rowIdx}-${colIdx}`} className={styles.gridCell}></div>
                  ))}
                </React.Fragment>
              ))}

              {/* Job Blocks */}
              {jobs.map((job, idx) => {
                const top = `${job.startIdx * 60 + 40}px`; // 60px per hour row + 40px header offset
                const left = `calc(60px + ${job.day} * ((100% - 60px) / 5) + 10px)`;
                const width = `calc((100% - 60px) / 5 - 20px)`;
                const height = `${job.span * 60 - 10}px`;

                return (
                  <div 
                    key={idx} 
                    className={styles.jobBlock}
                    style={{
                      top, left, width, height,
                      backgroundColor: job.color,
                      color: job.textColor,
                      borderLeft: job.borderLeft ? `3px solid ${job.borderLeft}` : `3px solid ${job.textColor}`
                    }}
                  >
                    <div className={styles.jobTitle}><strong>{job.id}</strong> · {job.company}</div>
                    <div className={styles.jobCrew}>{job.crew}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
