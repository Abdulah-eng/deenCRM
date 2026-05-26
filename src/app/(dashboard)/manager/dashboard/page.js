"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ClipboardList, Users, Calendar, AlertCircle, Eye, BarChart2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const STATUS_COLORS = {
  'IN PROGRESS': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'SCHEDULED':   { bg: 'rgba(114,57,234,0.12)', color: '#7239ea' },
  'COMPLETED':   { bg: 'rgba(80,205,137,0.12)', color: '#50cd89' },
  'DELAYED':     { bg: 'rgba(241,65,108,0.12)', color: '#f1416c' },
  'DRAFT':       { bg: 'rgba(241,241,244,1)',   color: '#7e8299' },
};

const TYPE_COLORS = {
  'SCREED':     { bg: 'rgba(255,199,0,0.15)',  color: '#d16b11' },
  'HEATING':    { bg: 'rgba(241,65,108,0.12)', color: '#f1416c' },
  'ELECTRICAL': { bg: 'rgba(0,158,247,0.12)',  color: '#009ef7' },
};

// Weekly order volume bar chart (Mon-Fri) - kept static for now as generating real history requires deep query
const weekVol = [14, 9, 16, 11, 8];
const weekMax = Math.max(...weekVol);

export default function ManagerDashboard() {
  const [todaysOrders, setTodaysOrders] = useState([]);
  const [crewStatus, setCrewStatus] = useState([]);
  const [stats, setStats] = useState({ active: 0, scheduled: 0, openComplaints: 0 });

  useEffect(() => {
    async function fetchData() {
      // Fetch active orders (join customers and crews)
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*, customers(name), crews(name)')
        .in('status', ['IN PROGRESS', 'SCHEDULED', 'DELAYED', 'COMPLETED'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersData) {
        setTodaysOrders(ordersData.map(o => ({
          id: o.display_id,
          customer: o.customers?.name || 'Unknown',
          type: o.type,
          crew: o.crews?.name || 'Unassigned',
          status: o.status
        })));
      }

      // Fetch all crews
      const { data: crewsData } = await supabase.from('crews').select('*');
      if (crewsData) {
        setCrewStatus(crewsData.map(c => ({
          name: c.name,
          role: 'Main Crew', // simplified
          order: c.specialization,
          status: 'Available',
          color: c.color || '#009ef7'
        })));
      }

      // Fetch stats
      const { count: activeCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['IN PROGRESS', 'SCHEDULED']);
      const { count: complaintCount } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).in('status', ['OPEN', 'IN PROGRESS']);
      
      setStats({
        active: activeCount || 0,
        scheduled: 5, // mock for now
        openComplaints: complaintCount || 0
      });
    }
    fetchData();
  }, []);

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
              <h2 className={styles.kpiVal}>{stats.active}</h2>
              <p className={styles.kpiLabel}>Active Orders</p>
              <span className={styles.kpiSub} style={{ color: '#50cd89' }}>Live from DB</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(80,205,137,0.1)', color: '#50cd89' }}>
              <Users size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>{crewStatus.length}</h2>
              <p className={styles.kpiLabel}>Crews on Field</p>
              <span className={styles.kpiSub} style={{ color: '#ffc700' }}>Live from DB</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(255,199,0,0.1)', color: '#ffc700' }}>
              <Calendar size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>{stats.scheduled}</h2>
              <p className={styles.kpiLabel}>Scheduled Today</p>
              <span className={styles.kpiSub} style={{ color: '#a1a5b7' }}>Next: 09:00</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(241,65,108,0.1)', color: '#f1416c' }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <h2 className={styles.kpiVal}>{stats.openComplaints}</h2>
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
                <div className={styles.cardTitle}><ClipboardList size={16} /> Recent Orders</div>
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
                    const sc = STATUS_COLORS[o.status] || STATUS_COLORS['IN PROGRESS'];
                    const tc = TYPE_COLORS[o.type] || TYPE_COLORS['SCREED'];
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
                  {todaysOrders.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No active orders</td></tr>
                  )}
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
                <div className={styles.cardTitle}><Users size={16} /> Crew Status</div>
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
