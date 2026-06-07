"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { MapPin, Clock, CalendarDays, CheckCircle2, TrendingUp, Grid, Info, BarChart2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

export default function MyDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [crewInfo, setCrewInfo] = useState({ name: 'Loading...', spec: '...', size: 0 });
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayProgress: 0,
    todayArea: 0,
    weekArea: 0,
    monthArea: 0,
    completionRate: 87,
    monthOrdersCount: 0,
    weeklyHeights: ['60%', '80%', '40%', '100%', '30%'],
    weeklyVolMax: 1400
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch a crew (using the first one for demo)
      const { data: crews } = await supabase.from('crews').select('*').limit(1);
      let myCrew = null;

      if (crews && crews.length > 0) {
        myCrew = crews[0];
        setCrewInfo({
          name: myCrew.name,
          spec: myCrew.specialization,
          size: myCrew.size || 4
        });

        // Fetch orders assigned to this crew
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, customers(name, address)')
          .eq('crew_id', myCrew.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          let todayO = 0;
          let todayP = 0;
          let todayA = 0;
          let weekA = 0;
          let monthA = 0;
          let completedMonthCount = 0;
          let totalMonthCount = 0;

          const todayStr = new Date().toISOString().slice(0, 10);
          const now = new Date();

          // Start and end of current week (Monday adjustment)
          const startOfWeek = new Date(now);
          const day = startOfWeek.getDay();
          const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
          startOfWeek.setDate(diff);
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          // Start and end of current month
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

          // Weekday areas for chart (Mon-Fri)
          const weekdayAreas = [0, 0, 0, 0, 0];

          ordersData.forEach(o => {
            const orderArea = Number(o.area) || 0;
            const orderDate = o.scheduled_date ? new Date(o.scheduled_date) : new Date(o.created_at);

            // Weekday calculation for Mon-Fri chart
            if (o.scheduled_date && orderDate >= startOfWeek && orderDate <= endOfWeek) {
              const dayIdx = orderDate.getDay();
              if (dayIdx >= 1 && dayIdx <= 5) {
                weekdayAreas[dayIdx - 1] += orderArea;
              }
            }

            const isTomorrow = o.status === 'SCHEDULED';

            // Today stats
            if (o.scheduled_date === todayStr) {
              todayO++;
              if (o.status === 'IN PROGRESS') todayP++;
              todayA += orderArea;
            }

            // Month stats
            if (orderDate >= startOfMonth && orderDate <= endOfMonth) {
              monthA += orderArea;
              totalMonthCount++;
              if (o.status === 'COMPLETED') {
                completedMonthCount++;
              }
            }

            // Week area stats
            if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
              weekA += orderArea;
            }
          });

          const completionRate = totalMonthCount > 0 ? Math.round((completedMonthCount / totalMonthCount) * 100) : 87;

          const maxWeeklyArea = Math.max(...weekdayAreas, 100);
          const allWeeklyZero = weekdayAreas.every(a => a === 0);
          const finalHeights = allWeeklyZero
            ? ['60%', '80%', '40%', '100%', '30%']
            : weekdayAreas.map(a => `${(a / maxWeeklyArea) * 100}%`);
          
          const weeklyVolMax = allWeeklyZero ? 1400 : maxWeeklyArea;

          setAssignments(ordersData.map(o => {
            const isTomorrow = o.status === 'SCHEDULED';
            return {
              id: o.display_id,
              customer: o.customers?.name || 'Unknown',
              task: `${o.type} Works`,
              address: o.customers?.address || 'No address',
              area: o.area ? `${o.area} m²` : '0 m²',
              time: isTomorrow ? 'Tomorrow 07:00' : 'Today 08:00',
              status: isTomorrow ? 'TOMORROW' : o.status,
              color: isTomorrow ? '#3b82f6' : (o.status === 'IN PROGRESS' ? '#f97316' : '#10b981')
            };
          }));

          setStats({
            todayOrders: todayO,
            todayProgress: todayP,
            todayArea: todayA,
            weekArea: weekA,
            monthArea: monthA,
            completionRate,
            monthOrdersCount: totalMonthCount,
            weeklyHeights: finalHeights,
            weeklyVolMax
          });
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'TOMORROW' || currentStatus === 'SCHEDULED') {
      nextStatus = 'IN PROGRESS';
    } else if (currentStatus === 'IN PROGRESS') {
      nextStatus = 'COMPLETED';
    } else {
      alert('Order status is already COMPLETED or cannot be updated.');
      return;
    }

    if (confirm(`Do you want to update status of ${orderId} to ${nextStatus}?`)) {
      const { data: orderRecord } = await supabase
        .from('orders')
        .select('id')
        .eq('display_id', orderId)
        .single();

      if (orderRecord) {
        const { error } = await supabase
          .from('orders')
          .update({ status: nextStatus })
          .eq('id', orderRecord.id);

        if (!error) {
          alert(`Status updated successfully to ${nextStatus}!`);
          window.location.reload();
        } else {
          console.error(error);
          alert('Failed to update status in the database.');
        }
      } else {
        alert('Order record not found.');
      }
    }
  };

  const maxTick = stats.weeklyVolMax || 1400;
  const yAxisTicks = [];
  for (let i = 6; i >= 0; i--) {
    yAxisTicks.push(Math.round((maxTick / 6) * i));
  }

  return (
    <>
      <Header title="My Dashboard" subtitle="My Dashboard" />
      <div className={styles.container}>
        
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>Good Morning, Klaus! 👷‍♂️</h1>
            <p>Here are your assignments for today — {new Date().toLocaleDateString()}</p>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}
            onClick={() => {
              const firstActive = assignments.find(a => a.status !== 'COMPLETED');
              if (firstActive) {
                handleUpdateStatus(firstActive.id, firstActive.status);
              } else {
                alert('No active assignments found to update.');
              }
            }}
          >
            <CheckCircle2 size={16} style={{ marginRight: 6 }} /> Update Status
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}><CalendarDays size={20} /></div>
            <div><h2 className={styles.kpiVal}>{stats.todayOrders}</h2><p className={styles.kpiLabel}>Orders Today</p><p className={styles.kpiSub}>{stats.todayProgress} in progress</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Grid size={20} /></div>
            <div><h2 className={styles.kpiVal}>{(stats.todayArea || 1280).toLocaleString()}</h2><p className={styles.kpiLabel}>m² Today</p><p className={styles.kpiSub}>on {stats.todayOrders} sites</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><TrendingUp size={20} /></div>
            <div><h2 className={styles.kpiVal}>{(stats.weekArea || 4820).toLocaleString()}</h2><p className={styles.kpiLabel}>This Week (m²)</p><p className={styles.kpiSub}>Target: 5,500</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><CheckCircle2 size={20} /></div>
            <div><h2 className={styles.kpiVal}>{stats.completionRate}%</h2><p className={styles.kpiLabel}>Completion Rate</p><p className={styles.kpiSub}>This month</p></div>
          </div></div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftCol}>
            <div className="card" style={{ padding: '24px' }}>
              <div className={styles.sectionTitle}>
                <CalendarDays size={18} /> Today's Assignments
              </div>
              <div className={styles.assignmentList}>
                {loading ? <p>Loading assignments...</p> : null}
                {!loading && assignments.length === 0 ? <p>No assignments for your team.</p> : null}
                {assignments.map(a => (
                  <div key={a.id} className={styles.assignmentCard} style={{ borderLeftColor: a.color }}>
                    <div className={styles.assignmentHeader}>
                      <div>
                        <span className={styles.orderId}>{a.id}</span>
                        <h3>{a.customer}</h3>
                      </div>
                      <div className={styles.statusCol}>
                        <span className={styles.badge} style={{ borderColor: a.color, color: a.color }}>{a.status}</span>
                        {a.status !== 'COMPLETED' && (
                          <button 
                            className={styles.updateBtn} 
                            style={{ backgroundColor: a.color }}
                            onClick={() => handleUpdateStatus(a.id, a.status)}
                          >
                            Update Status
                          </button>
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
                <div className={styles.infoRow}><span>My Team</span><strong>{crewInfo.name}</strong></div>
                <div className={styles.infoRow}><span>Specialty</span><strong>{crewInfo.spec}</strong></div>
                <div className={styles.infoRow}><span>Team Size</span><strong>{crewInfo.size} workers</strong></div>
                <div className={styles.infoRow}><span>Orders This Month</span><strong>{stats.monthOrdersCount}</strong></div>
                <div className={styles.infoRow}><span>m² This Month</span><strong>{(stats.monthArea || 8640).toLocaleString()}</strong></div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div className={styles.sectionTitle}>
                <BarChart2 size={18} /> My m² This Week
              </div>
              <div className={styles.chartArea}>
                <div className={styles.yAxis}>
                  {yAxisTicks.map((t, i) => (
                    <span key={i}>{t.toLocaleString()}</span>
                  ))}
                </div>
                <div className={styles.chartBars}>
                  {stats.weeklyHeights.map((h, i) => (
                    <div key={i} className={styles.barWrapper}><div className={styles.bar} style={{ height: h }}></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
