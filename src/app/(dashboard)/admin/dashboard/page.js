"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Users, TrendingUp, ClipboardList, UserCog } from 'lucide-react';
import styles from './page.module.css';

const lineChartData = {
  weeks: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      label: 'Heating Works',
      color: '#7239ea',
      values: [8200, 9100, 9800, 13100, 11200, 10400, 9800],
    },
    {
      label: 'Screed Works',
      color: '#a855f7',
      values: [6200, 6800, 7100, 8900, 7800, 8200, 7400],
    },
    {
      label: 'Electrical Works',
      color: '#c4a4fb',
      values: [4200, 4900, 5800, 5500, 6100, 5200, 4800],
    },
  ],
};

function MultiLineChart() {
  const w = 680, h = 240, padL = 50, padB = 30, padT = 20, padR = 20;
  const allVals = lineChartData.series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals);
  const minVal = 0;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const cols = lineChartData.weeks.length;

  const xPos = i => padL + (i / (cols - 1)) * innerW;
  const yPos = v => padT + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const yTicks = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      {/* Grid lines */}
      {yTicks.map(t => (
        <line
          key={t}
          x1={padL} y1={yPos(t)} x2={w - padR} y2={yPos(t)}
          stroke="#f1f1f4" strokeWidth="1"
        />
      ))}
      {/* Y axis labels */}
      {yTicks.map(t => (
        <text key={t} x={padL - 8} y={yPos(t) + 4} textAnchor="end" fontSize="10" fill="#a1a5b7">
          €{t / 1000}K
        </text>
      ))}
      {/* X axis labels */}
      {lineChartData.weeks.map((w, i) => (
        <text key={i} x={xPos(i)} y={h - 6} textAnchor="middle" fontSize="10" fill="#a1a5b7">{w}</text>
      ))}
      {/* Lines + dots per series */}
      {lineChartData.series.map(series => {
        const points = series.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ');
        const areaPoints = [
          `${xPos(0)},${yPos(0)}`,
          ...series.values.map((v, i) => `${xPos(i)},${yPos(v)}`),
          `${xPos(series.values.length - 1)},${yPos(0)}`,
        ].join(' ');
        return (
          <g key={series.label}>
            <polygon points={areaPoints} fill={series.color} opacity="0.07" />
            <polyline points={points} fill="none" stroke={series.color} strokeWidth="2.5" strokeLinejoin="round" />
            {series.values.map((v, i) => (
              <circle key={i} cx={xPos(i)} cy={yPos(v)} r="4" fill={series.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function AdminDashboard() {
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
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}>
              <Users size={22} />
            </div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>247</h2>
              <p className={styles.kpiLabel}>Total Customers</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>+ +12 this month</span>
            </div>
          </div>

          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}>
              <TrendingUp size={22} />
            </div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>€ 485K</h2>
              <p className={styles.kpiLabel}>Total Revenue (Month)</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>+ +8.3%</span>
            </div>
          </div>

          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}>
              <ClipboardList size={22} />
            </div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>63</h2>
              <p className={styles.kpiLabel}>Active Orders</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>+ +5 today</span>
            </div>
          </div>

          <div className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ backgroundColor: 'rgba(114,57,234,0.1)', color: '#7239ea' }}>
              <UserCog size={22} />
            </div>
            <div className={styles.kpiBody}>
              <h2 className={styles.kpiValue}>12</h2>
              <p className={styles.kpiLabel}>System Users</p>
              <span className={styles.kpiTrend} style={{ color: '#50cd89' }}>+ 3 roles active</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          <div className={`card ${styles.lineChartCard}`}>
            <div className={styles.chartHeader}>
              <h3>Revenue Overview — All Companies</h3>
              <div className={styles.chartControls}>
                <button className={styles.controlBtn}>Monthly</button>
                <button className={`${styles.controlBtn} ${styles.controlBtnActive}`}>Weekly</button>
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
            <div className={styles.svgWrapper}>
              <MultiLineChart />
            </div>
          </div>

          <div className={`card ${styles.donutCard}`}>
            <div className={styles.chartHeader}>
              <h3>Revenue by Company</h3>
            </div>
            <div className={styles.donutWrapper}>
              <svg viewBox="0 0 160 160" className={styles.donutSvg}>
                {/* Heating Works ~45% */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="#7239ea"
                  strokeWidth="26" strokeDasharray="170 377" strokeDashoffset="-40" />
                {/* Screed Works ~35% */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="#a855f7"
                  strokeWidth="26" strokeDasharray="132 377" strokeDashoffset="-210" />
                {/* Electrical Works ~20% */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="#c4a4fb"
                  strokeWidth="26" strokeDasharray="75 377" strokeDashoffset="-342" />
              </svg>
              <div className={styles.donutLabels}>
                <div className={styles.donutLabelItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#7239ea' }}></span>
                  <span>Heating</span>
                  <strong>45%</strong>
                </div>
                <div className={styles.donutLabelItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#a855f7' }}></span>
                  <span>Screed</span>
                  <strong>35%</strong>
                </div>
                <div className={styles.donutLabelItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: '#c4a4fb' }}></span>
                  <span>Electrical</span>
                  <strong>20%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
