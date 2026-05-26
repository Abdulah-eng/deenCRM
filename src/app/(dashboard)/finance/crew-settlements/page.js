'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { supabase } from '@/utils/supabase';
import { Plus, Check, Trash2, X, Search, Users } from 'lucide-react';

export default function CrewSettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [crews, setCrews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    crew_id: '',
    order_id: '',
    amount: '',
    settlement_date: '',
    status: 'UNPAID'
  });

  useEffect(() => {
    fetchSettlements();
    fetchCrews();
    fetchOrders();
  }, []);

  const fetchSettlements = async () => {
    const { data, error } = await supabase
      .from('crew_settlements')
      .select(`
        *,
        crews (name),
        orders (
          display_id,
          customers (name)
        )
      `)
      .order('created_at', { ascending: false });
    if (!error) setSettlements(data || []);
  };

  const fetchCrews = async () => {
    const { data, error } = await supabase.from('crews').select('id, name');
    if (!error) setCrews(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('id, display_id');
    if (!error) setOrders(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('crew_settlements').insert([{
      ...formData,
      amount: parseFloat(formData.amount)
    }]);
    if (!error) { setIsModalOpen(false); fetchSettlements(); }
  };

  const handleMarkAsPaid = async (id) => {
    const { error } = await supabase.from('crew_settlements').update({ status: 'PAID' }).eq('id', id);
    if (!error) fetchSettlements();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete settlement?')) {
      const { error } = await supabase.from('crew_settlements').delete().eq('id', id);
      if (!error) fetchSettlements();
    }
  };

  const filtered = settlements.filter(s => {
    const matchesSearch = s.crews?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSettlements = settlements.reduce((a, s) => a + (s.amount || 0), 0);
  const totalUnpaid = settlements.filter(s => s.status === 'UNPAID').reduce((a, s) => a + (s.amount || 0), 0);
  const totalPaid = settlements.filter(s => s.status === 'PAID').reduce((a, s) => a + (s.amount || 0), 0);
  const crewCount = new Set(settlements.map(s => s.crew_id)).size;

  const styles = {
    container: { padding: '20px' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' },
    kpiCard: { padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    controls: { display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' },
    searchBox: { display: 'flex', alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' },
    input: { border: 'none', outline: 'none', marginLeft: '8px' },
    select: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' },
    addButton: { padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modal: { background: '#fff', padding: '24px', borderRadius: '8px', width: '400px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
    submitBtn: { width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <Header title="Crew Settlements" />
      
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}><h3>Total Settlements</h3><p>€{totalSettlements.toFixed(2)}</p></div>
        <div style={styles.kpiCard}><h3>Total Unpaid</h3><p>€{totalUnpaid.toFixed(2)}</p></div>
        <div style={styles.kpiCard}><h3>Total Paid</h3><p>€{totalPaid.toFixed(2)}</p></div>
        <div style={styles.kpiCard}><h3>Crew Count</h3><p>{crewCount}</p></div>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchBox}>
          <Search size={20} />
          <input style={styles.input} type="text" placeholder="Search crew name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PAID">Paid</option>
        </select>
        <button style={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Generate Settlement
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Crew</th>
            <th style={styles.th}>Order</th>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Settlement Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td style={styles.td}>{s.id}</td>
              <td style={styles.td}>{s.crews?.name || '-'}</td>
              <td style={styles.td}>{s.orders?.display_id || '-'}</td>
              <td style={styles.td}>{s.orders?.customers?.name || '-'}</td>
              <td style={styles.td}>€{s.amount}</td>
              <td style={styles.td}>{s.status}</td>
              <td style={styles.td}>{s.settlement_date}</td>
              <td style={styles.td}>
                {s.status === 'UNPAID' && <button onClick={() => handleMarkAsPaid(s.id)}><Check size={16} /></button>}
                <button onClick={() => handleDelete(s.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>New Settlement</h2>
              <button onClick={() => setIsModalOpen(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label>Crew</label>
                <select style={styles.select} required value={formData.crew_id} onChange={e => setFormData({...formData, crew_id: e.target.value})}>
                  <option value="">Select Crew...</option>
                  {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label>Order</label>
                <select style={styles.select} required value={formData.order_id} onChange={e => setFormData({...formData, order_id: e.target.value})}>
                  <option value="">Select Order...</option>
                  {orders.map(o => <option key={o.id} value={o.id}>{o.display_id}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label>Amount (€)</label>
                <input style={{...styles.input, border: '1px solid #ddd', padding: '8px'}} type="number" required step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div style={styles.formGroup}>
                <label>Date</label>
                <input style={{...styles.input, border: '1px solid #ddd', padding: '8px'}} type="date" required value={formData.settlement_date} onChange={e => setFormData({...formData, settlement_date: e.target.value})} />
              </div>
              <button type="submit" style={styles.submitBtn}>Save Settlement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
