"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Download, TrendingUp, AlertCircle, Clock, Users, BarChart3, PieChart } from 'lucide-react';
import styles from './page.module.css';

export default function FinanceDashboard() {
  const summaryCards = [
    { title: 'Total Revenue', value: '€ 486,400', subtext: '+12.3%', icon: <TrendingUp size={20} color="#f1416c" />, bg: 'rgba(241, 65, 108, 0.1)' },
    { title: 'Total Costs', value: '€ 354,200', subtext: '+4.1%', icon: <BarChart3 size={20} color="#ffc700" />, bg: 'rgba(255, 199, 0, 0.1)' },
    { title: 'Gross Margin', value: '€ 132,200', subtext: '27.2%', icon: <TrendingUp size={20} color="#50cd89" />, bg: 'rgba(80, 205, 137, 0.1)' },
    { title: 'Overdue Invoices', value: '€ 18,400', subtext: '2 invoices', icon: <AlertCircle size={20} color="#f1416c" />, bg: 'rgba(241, 65, 108, 0.1)' },
    { title: 'Pending Invoices', value: '€ 124,117', subtext: '4 invoices', icon: <Clock size={20} color="#009ef7" />, bg: 'rgba(0, 158, 247, 0.1)' },
    { title: 'Crew Settlements', value: '€ 48,200', subtext: 'Due this week', icon: <Users size={20} color="#7239ea" />, bg: 'rgba(114, 57, 234, 0.1)' },
  ];

  return (
    <>
      <Header title="Finance Dashboard" subtitle="Finance | Finance Dashboard" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Finance Dashboard <BarChart3 size={20} color="#009ef7" /></h1>
            <p className={styles.description}>Financial overview — revenue, costs, margins, and settlements.</p>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.monthText}>May 2024</span>
            <button className="btn btn-primary" style={{ backgroundColor: '#f1416c' }}>
              <Download size={16} style={{ marginRight: '8px' }} /> Export
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {summaryCards.map((card, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statIcon} style={{ backgroundColor: card.bg }}>
                {card.icon}
              </div>
              <div className={styles.statValue}>{card.value}</div>
              <div className={styles.statTitle}>{card.title}</div>
              <div className={styles.statSubtext}>{card.subtext}</div>
            </div>
          ))}
        </div>

        <div className={styles.chartsGrid}>
          {/* Bar Chart Section */}
          <div className="card">
            <div className={styles.chartHeader}>
              <h3>Revenue vs Costs vs Margin (Monthly)</h3>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}><span className={styles.legendColor} style={{ backgroundColor: '#f1416c' }}></span> Revenue</span>
                <span className={styles.legendItem}><span className={styles.legendColor} style={{ backgroundColor: '#f8d7da' }}></span> Costs</span>
                <span className={styles.legendItem}><span className={styles.legendColor} style={{ backgroundColor: '#50cd89', height: '3px', width: '20px' }}></span> Margin</span>
              </div>
            </div>
            <div className={styles.barChartContainer}>
              {/* CSS Custom Bar Chart */}
              <div className={styles.yAxis}>
                <span>€500K</span><span>€400K</span><span>€300K</span><span>€200K</span><span>€100K</span><span>€0K</span>
              </div>
              <div className={styles.chartArea}>
                <svg className={styles.lineOverlay} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 8 70 L 25 68 L 42 68 L 58 66 L 75 64 L 92 62" fill="none" stroke="#50cd89" strokeWidth="1.5" />
                  <circle cx="8" cy="70" r="2" fill="white" stroke="#50cd89" strokeWidth="1" />
                  <circle cx="25" cy="68" r="2" fill="white" stroke="#50cd89" strokeWidth="1" />
                  <circle cx="42" cy="68" r="2" fill="white" stroke="#50cd89" strokeWidth="1" />
                  <circle cx="58" cy="66" r="2" fill="white" stroke="#50cd89" strokeWidth="1" />
                  <circle cx="75" cy="64" r="2" fill="white" stroke="#50cd89" strokeWidth="1" />
                  <circle cx="92" cy="62" r="2" fill="white" stroke="#50cd89" strokeWidth="1" />
                </svg>
                {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, idx) => {
                  const revHeight = [75, 80, 82, 85, 95, 98][idx];
                  const costHeight = [55, 60, 62, 65, 70, 75][idx];
                  return (
                    <div key={month} className={styles.barGroup}>
                      <div className={styles.bars}>
                        <div className={styles.bar} style={{ height: `${revHeight}%`, backgroundColor: '#f1416c' }}></div>
                        <div className={styles.bar} style={{ height: `${costHeight}%`, backgroundColor: '#f8d7da' }}></div>
                      </div>
                      <span className={styles.xAxisLabel}>{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Donut Chart Section */}
          <div className="card">
            <div className={styles.chartHeader}>
              <h3>Revenue by Company</h3>
            </div>
            <div className={styles.donutChartContainer}>
              <div className={styles.donutChart}>
                <svg viewBox="0 0 100 100" className={styles.donutSvg}>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1416c" strokeWidth="20" strokeDasharray="103 125" strokeDashoffset="25"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ffc700" strokeWidth="20" strokeDasharray="84 125" strokeDashoffset="-78"></circle>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#50cd89" strokeWidth="20" strokeDasharray="64 125" strokeDashoffset="-162"></circle>
                </svg>
              </div>
              <div className={styles.donutLegend}>
                <div className={styles.legendRow}>
                  <span><span className={styles.legendColor} style={{ backgroundColor: '#f1416c', borderRadius: '50%' }}></span> Heating Works</span>
                  <strong>€ 198,400 (40.8%)</strong>
                </div>
                <div className={styles.legendRow}>
                  <span><span className={styles.legendColor} style={{ backgroundColor: '#ffc700', borderRadius: '50%' }}></span> Screed Works</span>
                  <strong>€ 162,800 (33.5%)</strong>
                </div>
                <div className={styles.legendRow}>
                  <span><span className={styles.legendColor} style={{ backgroundColor: '#50cd89', borderRadius: '50%' }}></span> Electrical</span>
                  <strong>€ 125,200 (25.7%)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
