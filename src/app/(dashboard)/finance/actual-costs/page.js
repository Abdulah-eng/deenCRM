'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { supabase } from '@/utils/supabase';
import { Plus, Edit2, Trash2, X, Search, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

export default function ActualCostsPage() {
  const [costs, setCosts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    order_id: '',
    cost_type: 'MATERIAL',
    amount: '',
    cost_date: '',
    description: ''
  });

  useEffect(() => {
    fetchCosts();
    fetchOrders();
  }, []);

  const fetchCosts = async () => {
    const { data, error } = await supabase
      .from('actual_costs')
      .select(`
        *,
        orders (
          display_id,
          type,
          customers (name)
        )
      `)
      .order('created_at', { ascending: false });
    if (!error) setCosts(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, display_id');
    if (!error) setOrders(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    if (editingId) {
      const { error } = await supabase.from('actual_costs').update(payload).eq('id', editingId);
      if (!error) { setIsModalOpen(false); fetchCosts(); }
    } else {
      const { error } = await supabase.from('actual_costs').insert([payload]);
      if (!error) { setIsModalOpen(false); fetchCosts(); }
    }
  };

  const handleEdit = (cost) => {
    setFormData({
      order_id: cost.order_id,
      cost_type: cost.cost_type,
      amount: cost.amount,
      cost_date: cost.cost_date,
      description: cost.description
    });
    setEditingId(cost.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete cost entry?')) {
      const { error } = await supabase.from('actual_costs').delete().eq('id', id);
      if (!error) fetchCosts();
    }
  };

  const filteredCosts = costs.filter(c => {
    const matchesSearch = 
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.orders?.display_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || c.cost_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCosts = costs.reduce((a, c) => a + (c.amount || 0), 0);
  const materialCosts = costs.filter(c => c.cost_type === 'MATERIAL').reduce((a, c) => a + (c.amount || 0), 0);
  const crewCosts = costs.filter(c => c.cost_type === 'CREW').reduce((a, c) => a + (c.amount || 0), 0);
  const otherCosts = costs.filter(c => c.cost_type === 'OTHER').reduce((a, c) => a + (c.amount || 0), 0);

  return (
    <div className={styles.container}>
      <Header title="Actual Costs" />
      
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}><h3>Total Costs</h3><p>€{totalCosts.toFixed(2)}</p></div>
        <div className={styles.kpiCard}><h3>Material Costs</h3><p>€{materialCosts.toFixed(2)}</p></div>
        <div className={styles.kpiCard}><h3>Crew Costs</h3><p>€{crewCosts.toFixed(2)}</p></div>
        <div className={styles.kpiCard}><h3>Other Costs</h3><p>€{otherCosts.toFixed(2)}</p></div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input type="text" placeholder="Search desc or order..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="All">All Types</option>
          <option value="MATERIAL">Material</option>
          <option value="CREW">Crew</option>
          <option value="EQUIPMENT">Equipment</option>
          <option value="OTHER">Other</option>
        </select>
        <button className={styles.addButton} onClick={() => { setEditingId(null); setFormData({order_id:'',cost_type:'MATERIAL',amount:'',cost_date:'',description:''}); setIsModalOpen(true); }}>
          <Plus size={20} /> Add Cost Entry
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cost ID</th>
            <th>Order</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCosts.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.orders?.display_id || '-'}</td>
              <td>{c.orders?.customers?.name || '-'}</td>
              <td>{c.cost_type}</td>
              <td>{c.description}</td>
              <td>€{c.amount}</td>
              <td>{c.cost_date}</td>
              <td>
                <button onClick={() => handleEdit(c)}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(c.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Cost Entry' : 'New Cost Entry'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Order</label>
                <select required value={formData.order_id} onChange={e => setFormData({...formData, order_id: e.target.value})}>
                  <option value="">Select Order...</option>
                  {orders.map(o => <option key={o.id} value={o.id}>{o.display_id}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Cost Type</label>
                <select value={formData.cost_type} onChange={e => setFormData({...formData, cost_type: e.target.value})}>
                  <option value="MATERIAL">Material</option>
                  <option value="CREW">Crew</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Amount (€)</label>
                <input type="number" required step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input type="date" required value={formData.cost_date} onChange={e => setFormData({...formData, cost_date: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className={styles.submitBtn}>Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
