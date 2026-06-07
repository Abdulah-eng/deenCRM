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
    const subtotal = parseFloat(newInvoice.amount);
    const vat_amount = parseFloat(newInvoice.vat_amount);
    const total = subtotal + vat_amount;
    const vat_rate = subtotal > 0 ? Math.round((vat_amount / subtotal) * 100) : 19;
    const display_id = 'INV-' + Math.floor(1000 + Math.random() * 9000);
    const issue_date = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('invoices')
      .insert([{
        order_id: newInvoice.order_id,
        display_id,
        status: newInvoice.status,
        subtotal,
        total,
        vat_rate,
        issue_date,
        due_date: newInvoice.due_date
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

  const downloadPDF = (inv) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download/print the PDF.");
      return;
    }
    
    const customerName = inv.orders?.customers?.name || inv.orders?.companies?.name || 'Customer';
    const companyName = inv.orders?.companies?.name || 'Company';
    const orderType = inv.orders?.type || 'SCREED';
    const subtotal = inv.subtotal || 0;
    const total = inv.total || 0;
    const vat = total - subtotal;
    const vatRate = inv.vat_rate || 19;
    const displayId = inv.display_id || inv.id;
    const issueDate = inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : new Date().toLocaleDateString();
    const dueDate = inv.due_date ? new Date(inv.due_date).toLocaleDateString() : new Date().toLocaleDateString();

    const htmlContent = `
      <html>
        <head>
          <title>Rechnung ${displayId}</title>
          <style>
            body { font-family: 'system-ui', -apple-system, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #7239ea; padding-bottom: 20px; margin-bottom: 30px; }
            .logo h1 { color: #7239ea; margin: 0; font-size: 24px; }
            .logo p { margin: 2px 0 0 0; font-size: 12px; color: #666; }
            .inv-title { font-size: 28px; font-weight: 700; text-align: right; margin: 0; color: #111; }
            .meta-section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .meta-group h3 { font-size: 12px; text-transform: uppercase; color: #888; margin: 0 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            .meta-group p { margin: 4px 0; font-size: 14px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #555; border-bottom: 2px solid #ddd; }
            .table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .totals { width: 250px; margin-left: auto; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
            .totals-row { display: flex; justify-content: space-between; }
            .totals-row.grand-total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 8px; font-size: 16px; color: #7239ea; }
            .footer { margin-top: 100px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <h1>ProCRM Invoice</h1>
              <p>${companyName}</p>
            </div>
            <div>
              <h2 class="inv-title">RECHNUNG</h2>
              <p style="margin: 4px 0 0 0; text-align: right; color: #666; font-size: 14px;"><strong>Nr:</strong> ${displayId}</p>
            </div>
          </div>
          
          <div class="meta-section">
            <div class="meta-group">
              <h3>Empfänger</h3>
              <p><strong>${customerName}</strong></p>
            </div>
            <div class="meta-group">
              <h3>Details</h3>
              <p><strong>Datum:</strong> ${issueDate}</p>
              <p><strong>Fälligkeit:</strong> ${dueDate}</p>
              <p><strong>Gewerk:</strong> ${orderType}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Leistung / Beschreibung</th>
                <th style="text-align: right;">Menge</th>
                <th style="text-align: right;">Einheit</th>
                <th style="text-align: right;">Gesamt (Netto)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Erbrachte Bauleistung (${orderType}) laut Auftrag ${inv.orders?.display_id || '—'}</td>
                <td style="text-align: right;">1</td>
                <td style="text-align: right;">pauschal</td>
                <td style="text-align: right;">€ ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Netto-Betrag:</span>
              <span>€ ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="totals-row">
              <span>USt. (${vatRate}%):</span>
              <span>€ ${vat.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Brutto-Betrag:</span>
              <span>€ ${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>

          <div class="footer">
            <p>Vielen Dank für Ihre geschätzte Beauftragung! Bitte überweisen Sie den Betrag innerhalb von 30 Tagen auf unser Bankkonto.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

  const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((acc, inv) => acc + (inv.total || 0), 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'PAID' && i.status !== 'DRAFT').reduce((acc, inv) => acc + (inv.total || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'PAID': return { backgroundColor: '#e6f4ea', color: '#1e8e3e' };
      case 'SENT': return { backgroundColor: '#e8f0fe', color: '#1a73e8' };
      case 'DRAFT': return { backgroundColor: '#f1f3f4', color: '#5f6368' };
      case 'OVERDUE': return { backgroundColor: '#fce8e6', color: '#d93025' };
      default: return { backgroundColor: '#f1f3f4', color: '#5f6368' };
    }
  };

  return (
    <>
      <Header title="Invoices" subtitle="Finanzen / Übersicht" />
      <div className={styles.container}>
        
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

        <div className="card" style={{ overflowX: 'auto', marginTop: '20px' }}>
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
                  <td>€{(inv.subtotal || 0).toFixed(2)}</td>
                  <td>€{((inv.total || 0) - (inv.subtotal || 0)).toFixed(2)}</td>
                  <td>€{(inv.total || 0).toFixed(2)}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px', 
                      fontWeight: '600',
                      ...getStatusColor(inv.status)
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td>{inv.due_date}</td>
                  <td>
                    <div className={styles.actions}>
                      {inv.status !== 'PAID' && (
                        <button className={styles.actionBtn} onClick={() => handleMarkAsPaid(inv.id)} title="Mark as Paid">
                          <Check size={16} color="#50cd89" />
                        </button>
                      )}
                      <button className={styles.actionBtn} onClick={() => downloadPDF(inv)} title="Download PDF">
                        <Download size={16} color="#5f6368" />
                      </button>
                      <button className={styles.actionBtn} onClick={() => handleDelete(inv.id)} title="Delete">
                        <Trash2 size={16} color="#f1416c" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </>
  );
}
