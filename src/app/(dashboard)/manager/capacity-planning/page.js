'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Header from '@/components/layout/Header';
import { BarChart2, Calendar, Users, Download } from 'lucide-react';
import styles from './page.module.css';

export default function CapacityPlanningPage() {
  const [orders, setOrders] = useState([]);
  const [crews, setCrews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ordersRes, crewsRes] = await Promise.all([
      supabase.from('orders').select(`id, display_id, type, status, scheduled_date, location, area, customers(name), crews(name)`).not('scheduled_date', 'is', null),
      supabase.from('crews').select('*')
    ]);
    
    if (ordersRes.data) setOrders(ordersRes.data);
    if (crewsRes.data) setCrews(crewsRes.data);
  };

  const handleGenerateReport = () => {
    alert('Report exported!');
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (typeFilter !== 'All' && o.type !== typeFilter) return false;
    return true;
  });

  const totalScheduledOrders = filteredOrders.length;
  const totalArea = filteredOrders.reduce((sum, o) => sum + (Number(o.area) || 0), 0);
  
  const typeCounts = filteredOrders.reduce((acc, o) => {
    acc[o.type] = (acc[o.type] || 0) + 1;
    return acc;
  }, {});

  // Group by week and crew
  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const capacityData = {}; // crew_name -> { week1: count, week2: count }
  crews.forEach(c => capacityData[c.name] = {});
  
  const weeks = new Set();

  filteredOrders.forEach(o => {
    if (!o.scheduled_date) return;
    const week = `W${getWeekNumber(o.scheduled_date)}`;
    weeks.add(week);
    const crewName = o.crews?.name;
    if (crewName) {
      if (!capacityData[crewName]) capacityData[crewName] = {};
      capacityData[crewName][week] = (capacityData[crewName][week] || 0) + 1;
    }
  });

  const sortedWeeks = Array.from(weeks).sort();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Header title="Capacity Planning" />

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', marginTop: '24px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} /> Total Scheduled
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{totalScheduledOrders}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} /> Total Area
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{totalArea.toLocaleString()} m²</div>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> By Type
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '14px', flexWrap: 'wrap' }}>
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                {type}: <span style={{ fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="All">All Statuses</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
          </select>
          
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="All">All Types</option>
            <option value="SCREED">SCREED</option>
            <option value="HEATING">HEATING</option>
            <option value="ELECTRICAL">ELECTRICAL</option>
          </select>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#0f172a', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          <Download size={20} /> Generate Report
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', padding: '24px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>Capacity Overview (Orders per Week)</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', width: '200px' }}>Crew</th>
              {sortedWeeks.map(week => (
                <th key={week} style={{ textAlign: 'center', padding: '12px', borderBottom: '2px solid #e2e8f0' }}>{week}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crews.map(crew => (
              <tr key={crew.id}>
                <td style={{ padding: '16px 12px', borderBottom: '1px solid #e2e8f0', fontWeight: '500' }}>{crew.name}</td>
                {sortedWeeks.map(week => {
                  const count = capacityData[crew.name]?.[week] || 0;
                  return (
                    <td key={week} style={{ padding: '16px 12px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                      {count > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontWeight: 'bold' }}>{count}</span>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(count * 20, 100)}%`, height: '100%', backgroundColor: crew.color || '#3b82f6' }}></div>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {crews.length === 0 && (
              <tr>
                <td colSpan={sortedWeeks.length + 1} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No crews available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
