'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Header from '@/components/layout/Header';
import { TrendingUp, BarChart2, Download, FileText } from 'lucide-react';

export default function KeyFiguresPage() {
  const [orders, setOrders] = useState([]);
  const [actualCosts, setActualCosts] = useState([]);
  const [period, setPeriod] = useState('All Time');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ordersRes, costsRes] = await Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('actual_costs').select('*')
    ]);
    
    if (ordersRes.data) setOrders(ordersRes.data);
    if (costsRes.data) setActualCosts(costsRes.data);
  };

  const handleExport = () => {
    alert('Exported!');
  };

  const filteredOrders = orders.filter(o => {
    if (period === 'All Time') return true;
    
    const orderDate = new Date(o.created_at);
    const now = new Date();
    
    if (period === 'This Month') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    
    if (period === 'Last Month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear();
    }
    
    return true;
  });

  const orderIds = filteredOrders.map(o => o.id);
  const filteredCosts = actualCosts.filter(c => orderIds.includes(c.order_id));

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (Number(o.revenue) || 0), 0);
  const totalPlanDB = filteredOrders.reduce((sum, o) => sum + (Number(o.plan_db) || 0), 0);
  const totalActualDB = filteredOrders.reduce((sum, o) => sum + (Number(o.actual_db) || 0), 0);
  const totalActualCosts = filteredCosts.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  
  const dbMargin = totalRevenue > 0 ? ((totalActualDB / totalRevenue) * 100).toFixed(1) : 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Header title="Key Figures" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '24px' }}>
        <select 
          value={period} 
          onChange={e => setPeriod(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white', minWidth: '150px' }}
        >
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="All Time">All Time</option>
        </select>
        
        <button 
          onClick={handleExport}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0f172a', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          <Download size={20} /> Export
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} /> Total Revenue
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(totalRevenue)}</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} /> Total Planned DB
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(totalPlanDB)}</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} /> Total Actual DB
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a' }}>{formatCurrency(totalActualDB)}</div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>DB Margin %</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: dbMargin >= 0 ? '#16a34a' : '#dc2626' }}>
            {dbMargin}%
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Orders Overview</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b', fontSize: '14px' }}>Order ID</th>
              <th style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b', fontSize: '14px' }}>Type</th>
              <th style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b', fontSize: '14px' }}>Revenue</th>
              <th style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b', fontSize: '14px' }}>Plan DB</th>
              <th style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b', fontSize: '14px' }}>Actual DB</th>
              <th style={{ padding: '16px 24px', fontWeight: '500', color: '#64748b', fontSize: '14px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '16px 24px', fontWeight: '500' }}>{o.id ? o.id.substring(0, 8) + '...' : ''}</td>
                <td style={{ padding: '16px 24px' }}>{o.type}</td>
                <td style={{ padding: '16px 24px' }}>{formatCurrency(o.revenue)}</td>
                <td style={{ padding: '16px 24px' }}>{formatCurrency(o.plan_db)}</td>
                <td style={{ padding: '16px 24px', fontWeight: '500', color: (Number(o.actual_db) || 0) < (Number(o.plan_db) || 0) ? '#dc2626' : '#16a34a' }}>
                  {formatCurrency(o.actual_db)}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '9999px', 
                    fontSize: '12px', 
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontWeight: '500'
                  }}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No orders found for this period.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
