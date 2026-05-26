"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { MapPin, Clock, CalendarDays, CheckCircle2, TrendingUp, Grid, Info, BarChart2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

export default function MyDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [crewInfo, setCrewInfo] = useState({ name: 'Loading...', spec: '...', size: 0 });
  const [stats, setStats] = useState({ todayOrders: 0, todayProgress: 0 });
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
          size: 4 // Mock size
        });

        // Fetch orders assigned to this crew
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, customers(name), customers(address)')
          .eq('crew_id', myCrew.id)
          .order('created_at', { ascending: false });

        if (ordersData) {
          let todayO = 0;
          let todayP = 0;

          setAssignments(ordersData.map(o => {
            const isTomorrow = o.status === 'SCHEDULED';
            if (!isTomorrow) {
              todayO++;
              if (o.status === 'IN PROGRESS') todayP++;
            }
            return {
              id: o.display_id,
              customer: o.customers?.name || 'Unknown',
              task: `${o.type} Works`,
              address: o.customers?.address || 'No address',
              area: 'n/a m²', // would come from order details
              time: isTomorrow ? 'Tomorrow 07:00' : 'Today 08:00',
              status: isTomorrow ? 'TOMORROW' : o.status,
              color: isTomorrow ? '#3b82f6' : (o.status === 'IN PROGRESS' ? '#f97316' : '#10b981')
            };
          }));

          setStats({ todayOrders: todayO, todayProgress: todayP });
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Header title="My Dashboard" subtitle="My Dashboard" />
      <div className={styles.container}>
        
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeText}>
            <h1>Good Morning, Klaus! 👷‍♂️</h1>
            <p>Here are your assignments for today — {new Date().toLocaleDateString()}</p>
          </div>
          <button className="btn btn-primary" style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}>
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
            <div><h2 className={styles.kpiVal}>1,280</h2><p className={styles.kpiLabel}>m² Today</p><p className={styles.kpiSub}>on {stats.todayOrders} sites</p></div>
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
                <div className={styles.infoRow}><span>My Team</span><strong>{crewInfo.name}</strong></div>
                <div className={styles.infoRow}><span>Specialty</span><strong>{crewInfo.spec}</strong></div>
                <div className={styles.infoRow}><span>Team Size</span><strong>{crewInfo.size} workers</strong></div>
                <div className={styles.infoRow}><span>Orders This Month</span><strong>{assignments.length}</strong></div>
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
