'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { supabase } from '@/utils/supabase';
import { FileText, Plus, Check, Trash2, X, Search, Download } from 'lucide-react';
import styles from './page.module.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newInvoice, setNewInvoice] = useState({
    order_id: '',
    amount: '',
    vat_amount: '',
    due_date: '',
    status: 'DRAFT'
  });

  useEffect(() => {
    fetchInvoices();
    fetchOrders();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        orders (
          display_id,
          type,
          customers (name),
          companies (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching invoices:', error);
    else setInvoices(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, display_id');
    
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const total_amount = parseFloat(newInvoice.amount) + parseFloat(newInvoice.vat_amount);
    // Gen dummy display_id
    const display_id = 'INV-' + Math.floor(Math.random() * 10000);
    const { data, error } = await supabase
      .from('invoices')
      .insert([{
        ...newInvoice,
        amount: parseFloat(newInvoice.amount),
        vat_amount: parseFloat(newInvoice.vat_amount),
        total_amount,
        display_id
      }]);
      
    if (error) console.error(error);
    else {
      setIsAddModalOpen(false);
      fetchInvoices();
    }
  };

  const handleMarkAsPaid = async (id) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'PAID' })
      .eq('id', id);
    if (!error) fetchInvoices();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete invoice?')) {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      if (!error) fetchInvoices();
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.display_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.orders?.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const totalOutstanding = invoices.filter(i => i.status === 'SENT' || i.status === 'OVERDUE').reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'PAID': return 'green';
      case 'SENT': return 'blue';
      case 'OVERDUE': return 'red';
      case 'DRAFT': default: return 'gray';
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Invoices" />
      
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <h3>Total Invoiced</h3>
          <p>€{totalInvoiced.toFixed(2)}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3>Paid</h3>
          <p>€{totalPaid.toFixed(2)}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3>Outstanding</h3>
          <p>€{totalOutstanding.toFixed(2)}</p>
        </div>
        <div className={styles.kpiCard}>
          <h3>Overdue</h3>
          <p>{overdueCount}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search invoice or customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
        <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} /> New Invoice
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Invoice#</th>
            <th>Customer</th>
            <th>Company</th>
            <th>Amount</th>
            <th>VAT</th>
            <th>Total</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.display_id}</td>
              <td>{inv.orders?.customers?.name || '-'}</td>
              <td>{inv.orders?.companies?.name || '-'}</td>
              <td>€{inv.amount}</td>
              <td>€{inv.vat_amount}</td>
              <td>€{inv.total_amount}</td>
              <td>
                <span style={{ color: getStatusColor(inv.status), fontWeight: 'bold' }}>{inv.status}</span>
              </td>
              <td>{inv.due_date}</td>
              <td>
                {inv.status !== 'PAID' && (
                  <button onClick={() => handleMarkAsPaid(inv.id)} title="Mark as Paid"><Check size={16} /></button>
                )}
                <button onClick={() => handleDelete(inv.id)} title="Delete"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>New Invoice</h2>
              <button onClick={() => setIsAddModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className={styles.formGroup}>
                <label>Order</label>
                <select required value={newInvoice.order_id} onChange={e => setNewInvoice({...newInvoice, order_id: e.target.value})}>
                  <option value="">Select Order...</option>
                  {orders.map(o => <option key={o.id} value={o.id}>{o.display_id}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Amount (€)</label>
                <input type="number" required step="0.01" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>VAT Amount (€)</label>
                <input type="number" required step="0.01" value={newInvoice.vat_amount} onChange={e => setNewInvoice({...newInvoice, vat_amount: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Due Date</label>
                <input type="date" required value={newInvoice.due_date} onChange={e => setNewInvoice({...newInvoice, due_date: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select value={newInvoice.status} onChange={e => setNewInvoice({...newInvoice, status: e.target.value})}>
                  <option value="DRAFT">Draft</option>
                  <option value="SENT">Sent</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
              <button type="submit" className={styles.submitBtn}>Save Invoice</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
