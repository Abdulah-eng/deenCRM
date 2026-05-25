"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { FileText, ClipboardList, Activity, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

export default function CapacityPlanning() {
  return (
    <>
      <Header title="Capacity Planning" subtitle="Manager | Capacity Planning" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Weekly order volume, crew utilization, and capacity reporting.</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.weekSelector}>
              <span className={styles.weekText}>Week 20 (May 13 - 17)</span>
            </div>
            <button className="btn btn-primary">
              <FileText size={16} style={{ marginRight: '8px' }} /> Generate Report
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(0, 158, 247, 0.1)', color: '#009ef7' }}>
                <FileText size={20} />
              </div>
              <h2 className={styles.statValue}>€ 57,750</h2>
              <p className={styles.statLabel}>Total Volume<br/><span className={styles.statSubtext}>This week</span></p>
            </div>
          </div>
          
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(80, 205, 137, 0.1)', color: '#50cd89' }}>
                <ClipboardList size={20} />
              </div>
              <h2 className={styles.statValue}>31</h2>
              <p className={styles.statLabel}>Planned Orders<br/><span className={styles.statSubtext}>5 crews active</span></p>
            </div>
          </div>

          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(255, 199, 0, 0.1)', color: '#ffc700' }}>
                <Activity size={20} />
              </div>
              <h2 className={styles.statValue}>73%</h2>
              <p className={styles.statLabel}>Avg Utilization<br/><span className={styles.statSubtext}>Target: 80%</span></p>
            </div>
          </div>

          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(114, 57, 234, 0.1)', color: '#7239ea' }}>
                <BarChart2 size={20} />
              </div>
              <h2 className={styles.statValue}>27%</h2>
              <p className={styles.statLabel}>Available Capacity<br/><span className={styles.statSubtext}>18 crew-days free</span></p>
            </div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          {/* Line Chart Section */}
          <div className="card">
            <div className={styles.chartHeader}>
              <h3>Weekly Order Volume (€) — Current vs. Planned</h3>
              <div className={styles.chartLegend}>
                <span className={styles.legendItem}><span className={styles.legendColor} style={{ backgroundColor: '#0055ff' }}></span> Actual Volume</span>
                <span className={styles.legendItem}><span className={styles.legendColor} style={{ backgroundColor: 'rgba(0, 85, 255, 0.2)', border: '1px solid #0055ff' }}></span> Planned Capacity</span>
              </div>
            </div>
            
            <div className={styles.chartArea}>
              <div className={styles.yAxis}>
                <span>€16K</span><span>€14K</span><span>€12K</span><span>€10K</span><span>€8K</span><span>€6K</span><span>€4K</span><span>€2K</span><span>€0K</span>
              </div>
              
              <div className={styles.graphContent}>
                {/* Simulated line chart */}
                <svg className={styles.lineGraph} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 10 30 L 30 40 L 50 42 L 70 38 L 90 20" fill="none" stroke="#009ef7" strokeWidth="1" />
                  <circle cx="10" cy="30" r="1.5" fill="white" stroke="#009ef7" strokeWidth="0.5" />
                  <circle cx="30" cy="40" r="1.5" fill="white" stroke="#009ef7" strokeWidth="0.5" />
                  <circle cx="50" cy="42" r="1.5" fill="white" stroke="#009ef7" strokeWidth="0.5" />
                  <circle cx="70" cy="38" r="1.5" fill="white" stroke="#009ef7" strokeWidth="0.5" />
                  <circle cx="90" cy="20" r="1.5" fill="white" stroke="#009ef7" strokeWidth="0.5" />
                </svg>

                {/* Simulated Bar Chart for Actual Volume */}
                <div className={styles.barsContainer}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
                    const heights = [70, 60, 48, 40, 70];
                    return (
                      <div key={day} className={styles.barGroup}>
                        <div className={styles.barMain} style={{ height: `${heights[idx]}%`, backgroundColor: '#4169E1' }}></div>
                        <span className={styles.xLabel}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bars Section */}
          <div className="card">
            <div className={styles.chartHeader}>
              <h3>Crew Utilization by Team</h3>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressRow}>
                <div className={styles.progressInfo}>
                  <span className={styles.teamName}>Team Alpha <span className={styles.teamType}>(Screed)</span></span>
                  <span className={styles.teamValue} style={{ color: '#0055ff' }}>92%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '92%', backgroundColor: '#0055ff' }}></div>
                </div>
              </div>

              <div className={styles.progressRow}>
                <div className={styles.progressInfo}>
                  <span className={styles.teamName}>Team Beta <span className={styles.teamType}>(Screed)</span></span>
                  <span className={styles.teamValue} style={{ color: '#ffc700' }}>68%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '68%', backgroundColor: '#ffc700' }}></div>
                </div>
              </div>

              <div className={styles.progressRow}>
                <div className={styles.progressInfo}>
                  <span className={styles.teamName}>Team Gamma <span className={styles.teamType}>(Heating)</span></span>
                  <span className={styles.teamValue} style={{ color: '#0055ff' }}>85%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '85%', backgroundColor: '#0055ff' }}></div>
                </div>
              </div>

              <div className={styles.progressRow}>
                <div className={styles.progressInfo}>
                  <span className={styles.teamName}>Team Delta <span className={styles.teamType}>(Electrical)</span></span>
                  <span className={styles.teamValue} style={{ color: '#f1416c' }}>55%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '55%', backgroundColor: '#f1416c' }}></div>
                </div>
              </div>

              <div className={styles.progressRow}>
                <div className={styles.progressInfo}>
                  <span className={styles.teamName}>Team Epsilon <span className={styles.teamType}>(Screed)</span></span>
                  <span className={styles.teamValue} style={{ color: '#f1416c' }}>44%</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div className={styles.progressBarFill} style={{ width: '44%', backgroundColor: '#f1416c' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
