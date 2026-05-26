'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { FileText, Eye, Trash2, Download, X, Search } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewInvoice, setViewInvoice] = useState(null);
  
  // supabase client is imported from @/utils/supabase

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id, 
          display_id, 
          order_id, 
          amount, 
          vat_amount, 
          total_amount, 
          status, 
          due_date, 
          created_at,
          orders (
            display_id,
            type,
            customers (name),
            companies (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        const { error } = await supabase.from('invoices').delete().eq('id', id);
        if (error) throw error;
        setInvoices(invoices.filter(inv => inv.id !== id));
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
  };

  // KPIs
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const paidAmount = invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'PAID').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  const filteredInvoices = invoices.filter(inv => {
    const customerName = inv.orders?.customers?.name || inv.orders?.companies?.name || '';
    const matchesSearch = inv.display_id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className={styles.container || ''} style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header title="Invoices" />
      
      <div className={styles.content || ''} style={{ marginTop: '24px' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Total Invoiced</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>€{totalInvoiced.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Paid</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e8e3e' }}>€{paidAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Outstanding</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f29900' }}>€{outstandingAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#5f6368', marginBottom: '8px' }}>Overdue Invoices</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d93025' }}>{overdueCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#5f6368' }} size={20} />
            <input 
              type="text" 
              placeholder="Search by Invoice# or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#5f6368' }}>Loading invoices...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', textAlign: 'left' }}>
                <tr>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Invoice#</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Customer</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Type</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Amount</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>VAT</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Total</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Status</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Due Date</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: '#5f6368' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px' }}>{inv.display_id || '-'}</td>
                    <td style={{ padding: '16px' }}>{inv.orders?.customers?.name || inv.orders?.companies?.name || '-'}</td>
                    <td style={{ padding: '16px' }}>{inv.orders?.type || '-'}</td>
                    <td style={{ padding: '16px' }}>€{inv.amount?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
                    <td style={{ padding: '16px' }}>€{inv.vat_amount?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>€{inv.total_amount?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        ...getStatusColor(inv.status)
                      }}>
                        {inv.status || 'DRAFT'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setViewInvoice(inv)} style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#1a73e8' }} title="View">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => alert('PDF export coming soon!')} style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#5f6368' }} title="Download">
                          <Download size={18} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#d93025' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" style={{ padding: '32px', textAlign: 'center', color: '#5f6368' }}>No invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText /> Invoice Details
              </h2>
              <button onClick={() => setViewInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Invoice ID</p>
                <p style={{ fontWeight: '500', margin: 0 }}>{viewInvoice.display_id || viewInvoice.id}</p>
              </div>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Status</p>
                <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    ...getStatusColor(viewInvoice.status)
                  }}>
                    {viewInvoice.status || 'DRAFT'}
                  </span>
              </div>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Customer</p>
                <p style={{ fontWeight: '500', margin: 0 }}>{viewInvoice.orders?.customers?.name || viewInvoice.orders?.companies?.name || '-'}</p>
              </div>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Order Type</p>
                <p style={{ fontWeight: '500', margin: 0 }}>{viewInvoice.orders?.type || '-'}</p>
              </div>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Order ID</p>
                <p style={{ fontWeight: '500', margin: 0 }}>{viewInvoice.orders?.display_id || viewInvoice.order_id}</p>
              </div>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Created Date</p>
                <p style={{ fontWeight: '500', margin: 0 }}>{new Date(viewInvoice.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ color: '#5f6368', fontSize: '14px', marginBottom: '4px' }}>Due Date</p>
                <p style={{ fontWeight: '500', margin: 0 }}>{viewInvoice.due_date ? new Date(viewInvoice.due_date).toLocaleDateString() : '-'}</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '24px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5f6368' }}>Amount (excl. VAT):</span>
                <span style={{ fontWeight: '500' }}>€{viewInvoice.amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5f6368' }}>VAT Amount:</span>
                <span style={{ fontWeight: '500' }}>€{viewInvoice.vat_amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>Total Amount:</span>
                <span style={{ fontWeight: 'bold' }}>€{viewInvoice.total_amount?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setViewInvoice(null)}
                style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '500' }}
              >
                Close
              </button>
              <button 
                onClick={() => alert('PDF export coming soon!')}
                style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#1a73e8', color: 'white', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={18} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
