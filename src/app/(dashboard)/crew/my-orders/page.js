'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import Header from '@/components/layout/Header';
import { ClipboardList, MapPin, CheckCircle, Clock, X } from 'lucide-react';
import styles from './page.module.css';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [crews, setCrews] = useState([]);
  const [selectedCrew, setSelectedCrew] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedCrew, selectedStatus]);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('id, display_id, type, status, location, area, scheduled_date, customers(name), crews(name, id)');
    
    if (data) {
      setOrders(data);
      
      const uniqueCrews = Array.from(
        new Set(data.map(o => o.crews?.name).filter(Boolean))
      ).map(name => {
        const crewData = data.find(o => o.crews?.name === name);
        return { name, id: crewData.crews.id };
      });
      setCrews(uniqueCrews);
    }
  }

  function filterOrders() {
    let filtered = [...orders];
    if (selectedCrew) {
      filtered = filtered.filter(o => o.crews?.id === selectedCrew);
    }
    if (selectedStatus) {
      filtered = filtered.filter(o => o.status === selectedStatus);
    }
    setFilteredOrders(filtered);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN PROGRESS': return '#3b82f6';
      case 'SCHEDULED': return '#a855f7';
      case 'COMPLETED': return '#10b981';
      case 'DELAYED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleUpdateStatus = async () => {
    if (!updatingOrder || !newStatus) return;
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', updatingOrder.id);
      
    if (!error) {
      setOrders(orders.map(o => o.id === updatingOrder.id ? { ...o, status: newStatus } : o));
      setIsModalOpen(false);
      setUpdatingOrder(null);
      setNewStatus('');
    } else {
      alert('Failed to update status');
    }
  };

  const openModal = (order) => {
    setUpdatingOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const activeOrders = filteredOrders.filter(o => o.status === 'IN PROGRESS').length;
  const completedOrders = filteredOrders.filter(o => o.status === 'COMPLETED').length;
  const scheduledOrders = filteredOrders.filter(o => o.status === 'SCHEDULED').length;
  const totalArea = filteredOrders.reduce((sum, o) => sum + (Number(o.area) || 0), 0);

  return (
    <div className={styles.container}>
      <Header title="My Orders" userName="Crew Member" />
      
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Crew Orders</h1>
          <p className={styles.desc}>Manage and track all crew assignments.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className={styles.filterBox} 
            value={selectedCrew} 
            onChange={e => setSelectedCrew(e.target.value)}
          >
            <option value="">All Crews</option>
            {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            className={styles.filterBox}
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELAYED">Delayed</option>
          </select>
        </div>
      </div>

      <div className={styles.statsGrid} style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', flex: 1 }}>
          <div className={styles.label}>Active Orders</div>
          <div className={styles.value} style={{ fontSize: '24px' }}>{activeOrders}</div>
        </div>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', flex: 1 }}>
          <div className={styles.label}>Completed</div>
          <div className={styles.value} style={{ fontSize: '24px' }}>{completedOrders}</div>
        </div>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', flex: 1 }}>
          <div className={styles.label}>Scheduled</div>
          <div className={styles.value} style={{ fontSize: '24px' }}>{scheduledOrders}</div>
        </div>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', flex: 1 }}>
          <div className={styles.label}>Total Area</div>
          <div className={styles.value} style={{ fontSize: '24px' }}>{totalArea} m²</div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Order#</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Customer</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Type</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Location</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Area</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Scheduled Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--body-text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600' }}>{order.display_id || order.id.slice(0,8)}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{order.customers?.name || 'Unknown'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{order.type || '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{order.location || '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{order.area ? `${order.area} m²` : '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={styles.badge} style={{ color: getStatusColor(order.status), borderColor: getStatusColor(order.status) }}>
                    {order.status || 'PENDING'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button 
                    onClick={() => openModal(order)}
                    style={{ background: '#d95319', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: 'var(--body-text-muted)' }}>No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--header-text)' }}>Update Status</h3>
              <X style={{ cursor: 'pointer', color: 'var(--body-text-muted)' }} onClick={() => setIsModalOpen(false)} />
            </div>
            <p style={{ fontSize: '13px', color: 'var(--body-text-muted)', marginBottom: '16px' }}>
              Updating order: {updatingOrder?.display_id || updatingOrder?.id.slice(0,8)}
            </p>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>New Status</label>
              <select 
                value={newStatus} 
                onChange={e => setNewStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--header-text)' }}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="DELAYED">Delayed</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--body-text)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStatus}
                style={{ padding: '8px 16px', background: '#d95319', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
