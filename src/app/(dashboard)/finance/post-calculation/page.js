'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { supabase } from '@/utils/supabase';
import { TrendingUp, TrendingDown, FileText, Download, Eye } from 'lucide-react';

export default function PostCalculationPage() {
  const [data, setData] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, display_id, type, revenue, plan_db, actual_db, status, customers(name)');
      
    const { data: costs, error: costsError } = await supabase
      .from('actual_costs')
      .select('order_id, amount');

    if (!ordersError && !costsError) {
      const processed = orders.map(order => {
        const orderCosts = costs.filter(c => c.order_id === order.id).reduce((a, c) => a + (c.amount || 0), 0);
        const revenue = order.revenue || 0;
        const plannedMargin = order.plan_db || 0;
        const actualMargin = revenue - orderCosts;
        const variance = plannedMargin === 0 ? 0 : ((actualMargin - plannedMargin) / Math.abs(plannedMargin)) * 100;
        
        return {
          ...order,
          plannedMargin,
          actualCosts: orderCosts,
          actualMargin,
          variance
        };
      });
      setData(processed);
    }
  };

  const filtered = data.filter(d => {
    const matchesType = typeFilter === 'All' || d.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalRevenue = data.reduce((a, d) => a + (d.revenue || 0), 0);
  const totalPlannedMargin = data.reduce((a, d) => a + d.plannedMargin, 0);
  const totalActualMargin = data.reduce((a, d) => a + d.actualMargin, 0);
  const totalVariance = totalPlannedMargin === 0 ? 0 : ((totalActualMargin - totalPlannedMargin) / Math.abs(totalPlannedMargin)) * 100;

  const styles = {
    container: { padding: '20px' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' },
    kpiCard: { padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    controls: { display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' },
    select: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' },
    button: { padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    positive: { color: 'green', fontWeight: 'bold' },
    negative: { color: 'red', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <Header title="Post Calculation" />

      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}><h3>Total Revenue</h3><p>€{totalRevenue.toFixed(2)}</p></div>
        <div style={styles.kpiCard}><h3>Planned Margin</h3><p>€{totalPlannedMargin.toFixed(2)}</p></div>
        <div style={styles.kpiCard}><h3>Actual Margin</h3><p>€{totalActualMargin.toFixed(2)}</p></div>
        <div style={styles.kpiCard}>
          <h3>Margin Deviation</h3>
          <p style={totalVariance >= 0 ? styles.positive : styles.negative}>
            {totalVariance >= 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
            {totalVariance.toFixed(2)}%
          </p>
        </div>
      </div>

      <div style={styles.controls}>
        <select style={styles.select} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="All">All Types</option>
          <option value="PROJECT">Project</option>
          <option value="SERVICE">Service</option>
        </select>
        <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button style={styles.button} onClick={() => alert('Report exported!')}>
          <Download size={20} /> Export Report
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Order</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Revenue</th>
            <th style={styles.th}>Planned Margin</th>
            <th style={styles.th}>Actual Costs</th>
            <th style={styles.th}>Actual Margin</th>
            <th style={styles.th}>Variance %</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(d => (
            <tr key={d.id}>
              <td style={styles.td}>{d.display_id}</td>
              <td style={styles.td}>{d.customers?.name || '-'}</td>
              <td style={styles.td}>{d.type}</td>
              <td style={styles.td}>€{d.revenue || 0}</td>
              <td style={styles.td}>€{d.plannedMargin}</td>
              <td style={styles.td}>€{d.actualCosts}</td>
              <td style={styles.td}>€{d.actualMargin}</td>
              <td style={styles.td}>
                <span style={d.variance >= 0 ? styles.positive : styles.negative}>
                  {d.variance.toFixed(2)}%
                </span>
              </td>
              <td style={styles.td}>{d.status}</td>
              <td style={styles.td}>
                <button 
                  onClick={() => alert(`Details for ${d.display_id}:\nRevenue: €${d.revenue}\nCosts: €${d.actualCosts}\nMargin: €${d.actualMargin}`)}
                  style={{background:'none',border:'none',cursor:'pointer'}}
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
