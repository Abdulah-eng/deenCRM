"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Download, Calculator, TrendingDown, TrendingUp, Eye } from 'lucide-react';
import styles from './page.module.css';

export default function PostCalculation() {
  const calculations = [
    { id: 'ORD-2024-049', customer: 'Renovierung König', type: 'HEATING', revenue: '€ 4,200', planDb: '€ 2,100', matCost: '€ 1,890', crewCost: '€ 210', actualDb: '€ 1,710', variance: '+€ 180', result: 'PROFIT' },
    { id: 'ORD-2024-041', customer: 'Wohnbau AG', type: 'SCREED', revenue: '€ 32,500', planDb: '€ 8,125', matCost: '€ 6,500', crewCost: '€ 2,000', actualDb: '€ 5,800', variance: '+€ 700', result: 'PROFIT' },
    { id: 'ORD-2024-035', customer: 'Bauunternehmen', type: 'SCREED', revenue: '€ 9,600', planDb: '€ 2,400', matCost: '€ 2,580', crewCost: '€ 800', actualDb: '€ 1,980', variance: '-€ 180', result: 'LOSS' },
    { id: 'ORD-2024-028', customer: 'Stadtbau GmbH', type: 'SCREED', revenue: '€ 12,350', planDb: '€ 3,088', matCost: '€ 2,900', crewCost: '€ 1,100', actualDb: '€ 2,650', variance: '+€ 188', result: 'PROFIT' },
    { id: 'ORD-2024-021', customer: 'Immobilien Keller', type: 'ELECTRICAL', revenue: '€ 5,800', planDb: '€ 1,450', matCost: '€ 1,380', crewCost: '€ 400', actualDb: '€ 1,300', variance: '+€ 70', result: 'PROFIT' },
  ];

  return (
    <>
      <Header title="Post-Calculation" subtitle="Finance | Post-Calculation" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Plan DB vs Actual DB — cost analysis per completed order.</p>
          </div>
          <div className={styles.headerRight}>
            <button className="btn btn-primary" style={{ backgroundColor: '#f1416c' }}>
              <Download size={16} style={{ marginRight: '8px' }} /> Export Report
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(241, 65, 108, 0.1)', color: '#f1416c' }}>
                <Calculator size={20} />
              </div>
              <h2 className={styles.statValue}>€ 64,450</h2>
              <p className={styles.statLabel}>Total Revenue</p>
            </div>
          </div>
          
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(0, 158, 247, 0.1)', color: '#009ef7' }}>
                <TrendingDown size={20} />
              </div>
              <h2 className={styles.statValue}>€ 17,163</h2>
              <p className={styles.statLabel}>Total Plan DB</p>
            </div>
          </div>

          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(80, 205, 137, 0.1)', color: '#50cd89' }}>
                <Calculator size={20} />
              </div>
              <h2 className={styles.statValue}>€ 15,140</h2>
              <p className={styles.statLabel}>Total Actual DB</p>
            </div>
          </div>

          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(80, 205, 137, 0.1)', color: '#50cd89' }}>
                <TrendingUp size={20} />
              </div>
              <h2 className={styles.statValue}>+€ 1,340</h2>
              <p className={styles.statLabel}>DB Variance</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <Calculator size={16} color="#f1416c" /> Order Post-Calculation
            </div>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>TYPE</th>
                  <th>REVENUE</th>
                  <th>PLAN DB</th>
                  <th>MAT. COST</th>
                  <th>CREW COST</th>
                  <th>ACTUAL DB</th>
                  <th>VARIANCE</th>
                  <th>RESULT</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calc, idx) => (
                  <tr key={idx}>
                    <td><span className={styles.orderId}>{calc.id}</span></td>
                    <td><strong className={styles.customer}>{calc.customer}</strong></td>
                    <td>
                      <span className={styles.typeBadge} data-type={calc.type}>{calc.type}</span>
                    </td>
                    <td><span className={styles.currencyText}>{calc.revenue}</span></td>
                    <td><span className={styles.currencyText} style={{ color: '#009ef7' }}>{calc.planDb}</span></td>
                    <td><span className={styles.currencyText} style={{ color: '#f1416c' }}>{calc.matCost}</span></td>
                    <td><span className={styles.currencyText} style={{ color: '#f1416c' }}>{calc.crewCost}</span></td>
                    <td><span className={styles.currencyText} style={{ color: '#50cd89' }}>{calc.actualDb}</span></td>
                    <td>
                      <span className={styles.variance} data-positive={calc.variance.startsWith('+')}>
                        {calc.variance}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${calc.result === 'PROFIT' ? 'badge-active' : 'badge-inactive'}`}>
                        {calc.result}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionBtn}>
                        <Eye size={14} color="#f1416c" />
                      </button>
                    </td>
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
