"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Users, TrendingUp, ClipboardList, UserCog } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const lineChartData = {
  weeks: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    { label: 'Heating Works', color: '#7239ea', values: [8200, 9100, 9800, 13100, 11200, 10400, 9800] },
    { label: 'Screed Works', color: '#a855f7', values: [6200, 6800, 7100, 8900, 7800, 8200, 7400] },
    { label: 'Electrical Works', color: '#c4a4fb', values: [4200, 4900, 5800, 5500, 6100, 5200, 4800] },
  ],
};

function MultiLineChart() {
  const w = 680, h = 240, padL = 50, padB = 30, padT = 20, padR = 20;
  const allVals = lineChartData.series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals);
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const cols = lineChartData.weeks.length;
  const xPos = i => padL + (i / (cols - 1)) * innerW;
  const yPos = v => padT + innerH - (v / maxVal) * innerH;
  const yTicks = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      {yTicks.map(t => (
        <line key={t} x1={padL} y1={yPos(t)} x2={w - padR} y2={yPos(t)} stroke="#f1f1f4" strokeWidth="1" />
      ))}
      {yTicks.map(t => (
        <text key={t} x={padL - 8} y={yPos(t) + 4} textAnchor="end" fontSize="10" fill="#a1a5b7">€{t / 1000}K</text>
      ))}
      {lineChartData.weeks.map((d, i) => (
        <text key={i} x={xPos(i)} y={h - 6} textAnchor="middle" fontSize="10" fill="#a1a5b7">{d}</text>
      ))}
      {lineChartData.series.map(series => {
        const points = series.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ');
        const areaPoints = [`${xPos(0)},${yPos(0)}`, ...series.values.map((v, i) => `${xPos(i)},${yPos(v)}`), `${xPos(series.values.length - 1)},${yPos(0)}`].join(' ');
        return (
          <g key={series.label}>
            <polygon points={areaPoints} fill={series.color} opacity="0.07" />
            <polyline points={points} fill="none" stroke={series.color} strokeWidth="2.5" strokeLinejoin="round" />
            {series.values.map((v, i) => (<circle key={i} cx={xPos(i)} cy={yPos(v)} r="4" fill={series.color} />))}
          </g>
        );
      })}
    </svg>
  );
}

export default function AdminDashboard() {
  const [kpi, setKpi] = useState({ customers: 0, revenue: 0, activeOrders: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('weekly');

  useEffect(() => {
    async function fetchKpis() {
      const [customersRes, ordersRes, usersRes] = await Promise.all([
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, revenue, status'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      const totalCustomers = customersRes.count || 0;
      const allOrders = ordersRes.data || [];
      const totalRevenue = allOrders.reduce((sum, o) => sum + (Number(o.revenue) || 0), 0);
      const activeOrders = allOrders.filter(o => o.status === 'IN PROGRESS' || o.status === 'SCHEDULED').length;
      const totalUsers = usersRes.count || 0;

      setKpi({ customers: totalCustomers, revenue: totalRevenue, activeOrders, users: totalUsers });
      setLoading(false);
    }
    fetchKpis();
  }, []);

  const fmt = (n) => n >= 1000 ? `€ ${(n / 1000).toFixed(0)}K` : `€ ${n}`;

  return (
    <>
      <Header title="Dashboard" subtitle="Dashboard" />
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h2>Welcome back, Admin 👋</h2>
          <p>Here's what's happening across all companies today.</p>
        </div>

        {/* KPI Cards */}
        <div className={styles.kpiGrid}>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}><Users size={22} /></div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>{loading ? '—' : kpi.customers}</h2>
              <p className={styles.kpiLabel}>Total Customers</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>Live from DB</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}><TrendingUp size={22} /></div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>{loading ? '—' : fmt(kpi.revenue)}</h2>
              <p className={styles.kpiLabel}>Total Revenue</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>Live from DB</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}><ClipboardList size={22} /></div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>{loading ? '—' : kpi.activeOrders}</h2>
              <p className={styles.kpiLabel}>Active Orders</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>Live from DB</span>
            </div>
          </div>
          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}><UserCog size={22} /></div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>{loading ? '—' : kpi.users}</h2>
              <p className={styles.kpiLabel}>System Users</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>Live from DB</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <div className={`card ${styles.lineChartCard}`}>
            <div className={styles.chartHeader}>
              <h3>Revenue Overview — All Companies</h3>
              <div className={styles.chartControls}>
                <button
                  className={`${styles.controlBtn} ${chartView === 'monthly' ? styles.controlBtnActive : ''}`}
                  onClick={() => setChartView('monthly')}
                >Monthly</button>
                <button
                  className={`${styles.controlBtn} ${chartView === 'weekly' ? styles.controlBtnActive : ''}`}
                  onClick={() => setChartView('weekly')}
                >Weekly</button>
              </div>
            </div>
            <div className={styles.chartLegend}>
              {lineChartData.series.map(s => (
                <div key={s.label} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: s.color }}></span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.svgWrapper}><MultiLineChart /></div>
          </div>

          <div className={`card ${styles.donutCard}`}>
            <div className={styles.chartHeader}><h3>Revenue by Company</h3></div>
            <div className={styles.donutWrapper}>
              <svg viewBox="0 0 160 160" className={styles.donutSvg}>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#7239ea" strokeWidth="26" strokeDasharray="170 377" strokeDashoffset="-40" />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#a855f7" strokeWidth="26" strokeDasharray="132 377" strokeDashoffset="-210" />
                <circle cx="80" cy="80" r="60" fill="none" stroke="#c4a4fb" strokeWidth="26" strokeDasharray="75 377" strokeDashoffset="-342" />
              </svg>
              <div className={styles.donutLabels}>
                <div className={styles.donutLabelItem}><span className={styles.legendDot} style={{ backgroundColor: '#7239ea' }}></span><span>Heating</span><strong>45%</strong></div>
                <div className={styles.donutLabelItem}><span className={styles.legendDot} style={{ backgroundColor: '#a855f7' }}></span><span>Screed</span><strong>35%</strong></div>
                <div className={styles.donutLabelItem}><span className={styles.legendDot} style={{ backgroundColor: '#c4a4fb' }}></span><span>Electrical</span><strong>20%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
