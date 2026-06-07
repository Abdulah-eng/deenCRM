'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { FileText, Eye, Trash2, Download, X, Search, Plus, Save, Send } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewInvoice, setViewInvoice] = useState(null);
  
  // Creation modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Form states
  const [selectedOffer, setSelectedOffer] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceNum, setInvoiceNum] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [netAmount, setNetAmount] = useState('0.00');
  const [vatRate, setVatRate] = useState('19');
  const [grossTotal, setGrossTotal] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchModalData();
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
          subtotal, 
          total, 
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

  const fetchModalData = async () => {
    try {
      // 1. Fetch customers
      let { data: custData, error: custErr } = await supabase.from('customers').select('id, name, city');
      if (custErr) {
        console.warn("Failed to fetch customers with city, trying fallback:", custErr);
        const { data: fallbackData } = await supabase.from('customers').select('id, name');
        custData = fallbackData;
      }
      if (custData) setCustomers(custData);

      // 2. Fetch companies
      const { data: compData } = await supabase.from('companies').select('id, name, type');
      if (compData) setCompanies(compData);

      // 3. Fetch accepted offers
      const { data: offersData } = await supabase
        .from('offers')
        .select('id, display_id, customer_id, company_id, total, customers (name)')
        .eq('status', 'ACCEPTED');
      if (offersData) setOffers(offersData);
    } catch (e) {
      console.error("Error fetching modal options:", e);
    }
  };

  const handleOfferChange = (offerId) => {
    setSelectedOffer(offerId);
    if (offerId === '') {
      setSelectedCompany('');
      setSelectedCustomer('');
      setNetAmount('0.00');
      setGrossTotal(0);
      setInvoiceNum('');
      return;
    }

    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      setSelectedCustomer(offer.customer_id || '');
      setSelectedCompany(offer.company_id || '');
      const net = Number(offer.total || 0);
      setNetAmount(net.toFixed(2));
      const vat = Number(vatRate) / 100;
      setGrossTotal(net * (1 + vat));
      
      // Auto-generate invoice number based on company
      generateInvoiceNum(offer.company_id);
    }
  };

  const generateInvoiceNum = (companyId) => {
    const comp = companies.find(c => c.id === companyId);
    if (comp) {
      const prefix = comp.name.split(' ').map(w => w[0]).join('').toUpperCase();
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      setInvoiceNum(`INV-${prefix}-${randomDigits}`);
    } else {
      setInvoiceNum(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    generateInvoiceNum(companyId);
  };

  const handleNetAmountChange = (val) => {
    setNetAmount(val);
    const net = Number(val) || 0;
    const vat = Number(vatRate) / 100;
    setGrossTotal(net * (1 + vat));
  };

  const handleVatRateChange = (rate) => {
    setVatRate(rate);
    const net = Number(netAmount) || 0;
    const vat = Number(rate) / 100;
    setGrossTotal(net * (1 + vat));
  };

  const resetForm = () => {
    setSelectedOffer('');
    setSelectedCompany('');
    setSelectedCustomer('');
    setInvoiceNum('');
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const due = new Date();
    due.setDate(today.getDate() + 30);
    const dueStr = due.toISOString().split('T')[0];
    
    setIssueDate(todayStr);
    setDueDate(dueStr);
    setNetAmount('0.00');
    setVatRate('19');
    setGrossTotal(0);
    setNotes('');
    setSaving(false);
  };

  const handleSaveInvoice = async (statusVal = 'DRAFT') => {
    if (!selectedCompany || !selectedCustomer || !invoiceNum) {
      alert("Please select a company, a customer, and generate an invoice number.");
      return;
    }

    setSaving(true);
    try {
      // 1. Create a background order record since invoice links to order_id
      const cust = customers.find(c => c.id === selectedCustomer);
      const location = cust?.city || 'München';

      const comp = companies.find(c => c.id === selectedCompany);
      const orderType = comp?.type?.toUpperCase() || 'SCREED';

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          display_id: `ORD-2024-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_id: selectedCustomer,
          company_id: selectedCompany,
          type: orderType,
          revenue: Number(netAmount),
          status: 'COMPLETED',
          scheduled_date: issueDate,
          location: location
        }])
        .select();

      if (orderError) throw orderError;
      const newOrderId = orderData[0].id;

      // 2. Create the invoice record
      const { error: invError } = await supabase
        .from('invoices')
        .insert([{
          display_id: invoiceNum,
          order_id: newOrderId,
          status: statusVal,
          subtotal: Number(netAmount),
          vat_rate: Number(vatRate),
          total: grossTotal,
          issue_date: issueDate,
          due_date: dueDate
        }]);

      if (invError) throw invError;

      alert(statusVal === 'DRAFT' ? 'Invoice draft saved!' : 'Invoice created and sent!');
      setShowAddModal(false);
      fetchInvoices();
    } catch (e) {
      console.error("Error creating invoice:", e);
      alert("Failed to save invoice.");
    } finally {
      setSaving(false);
    }
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
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .logo h1 { color: #10b981; margin: 0; font-size: 24px; }
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
            .totals-row.grand-total { font-weight: bold; border-top: 1px solid #ddd; padding-top: 8px; font-size: 16px; color: #10b981; }
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
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const paidAmount = invoices.filter(i => i.status === 'PAID').reduce((sum, inv) => sum + (inv.total || 0), 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'PAID').reduce((sum, inv) => sum + (inv.total || 0), 0);
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
      
      {/* Title & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--header-text)', margin: '0 0 4px 0' }}>Invoices</h2>
          <p style={{ fontSize: '13px', color: 'var(--body-text-muted)', margin: 0 }}>Auto-generated invoices with consecutive numbering per company.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      <div className={styles.content || ''}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '14px', color: 'var(--body-text-muted)', marginBottom: '8px' }}>Total Invoiced</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--header-text)' }}>€{totalInvoiced.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '14px', color: 'var(--body-text-muted)', marginBottom: '8px' }}>Paid</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e8e3e' }}>€{paidAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '14px', color: 'var(--body-text-muted)', marginBottom: '8px' }}>Outstanding</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f29900' }}>€{outstandingAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div style={{ padding: '20px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '14px', color: 'var(--body-text-muted)', marginBottom: '8px' }}>Overdue Invoices</div>
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
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Loading invoices...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--body-bg)', borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
                <tr>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Invoice#</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Customer</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Type</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Amount</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>VAT</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Total</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Status</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)' }}>Due Date</th>
                  <th style={{ padding: '16px', fontWeight: '500', color: 'var(--body-text-muted)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '16px', color: 'var(--header-text)', fontWeight: '500' }}>{inv.display_id || '-'}</td>
                    <td style={{ padding: '16px', color: 'var(--header-text)' }}>{inv.orders?.customers?.name || inv.orders?.companies?.name || '-'}</td>
                    <td style={{ padding: '16px', color: 'var(--body-text)' }}>{inv.orders?.type || '-'}</td>
                    <td style={{ padding: '16px', color: 'var(--body-text)' }}>€{inv.subtotal?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
                    <td style={{ padding: '16px', color: 'var(--body-text)' }}>€{(inv.subtotal ? (inv.total - inv.subtotal) : 0).toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#10b981' }}>€{inv.total?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</td>
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
                    <td style={{ padding: '16px', color: 'var(--body-text)' }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewInvoice(inv)} style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#1a73e8' }} title="View">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => downloadPDF(inv)} style={{ padding: '6px', border: 'none', background: 'none', cursor: 'pointer', color: '#5f6368' }} title="Download">
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
                    <td colSpan="9" style={{ padding: '32px', textAlign: 'center', color: 'var(--body-text-muted)' }}>No invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' }}>
          <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', border: '1px solid var(--card-border)' }}>
            <div style={{ padding: '20px 24px', backgroundColor: '#10b981', color: 'white', borderRadius: '12px 12px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> Create Invoice
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>From Offer</label>
                  <select 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={selectedOffer}
                    onChange={(e) => handleOfferChange(e.target.value)}
                  >
                    <option value="">Manually (no offer)</option>
                    {offers.map(o => (
                      <option key={o.id} value={o.id}>{o.display_id} - {o.customers?.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Company *</label>
                  <select 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={selectedCompany}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                  >
                    <option value="">Select Company...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Customer *</label>
                  <select 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Select Customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Invoice # (auto)</label>
                  <input 
                    type="text" 
                    readOnly 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text-muted)', outline: 'none' }}
                    value={invoiceNum}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Issue Date</label>
                  <input 
                    type="date" 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Due Date (30 days)</label>
                  <input 
                    type="date" 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Net Amount (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={netAmount}
                    onChange={(e) => handleNetAmountChange(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>VAT Rate</label>
                  <select 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none' }}
                    value={vatRate}
                    onChange={(e) => handleVatRateChange(e.target.value)}
                  >
                    <option value="19">19%</option>
                    <option value="0">0%</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Gross Total</label>
                  <input 
                    type="text" 
                    readOnly 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text-muted)', outline: 'none', fontWeight: 'bold' }}
                    value={`€ ${Number(grossTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--body-text-muted)' }}>Notes / Payment Terms</label>
                <textarea 
                  rows="3" 
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', outline: 'none', resize: 'vertical' }}
                  placeholder="e.g. Payment within 30 days net..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--body-bg)', borderRadius: '0 0 12px 12px' }}>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--body-text)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveInvoice('DRAFT')}
                disabled={saving}
                style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--body-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={16} /> Save Draft
              </button>
              <button 
                onClick={() => handleSaveInvoice('SENT')}
                disabled={saving}
                style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} /> Create & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--header-text)' }}>
                <FileText /> Invoice Details
              </h2>
              <button onClick={() => setViewInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-text)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Invoice ID</p>
                <p style={{ fontWeight: '500', margin: 0, color: 'var(--header-text)' }}>{viewInvoice.display_id || viewInvoice.id}</p>
              </div>
              <div>
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Status</p>
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
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Customer</p>
                <p style={{ fontWeight: '500', margin: 0, color: 'var(--header-text)' }}>{viewInvoice.orders?.customers?.name || viewInvoice.orders?.companies?.name || '-'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Order Type</p>
                <p style={{ fontWeight: '500', margin: 0, color: 'var(--header-text)' }}>{viewInvoice.orders?.type || '-'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Order ID</p>
                <p style={{ fontWeight: '500', margin: 0, color: 'var(--header-text)' }}>{viewInvoice.orders?.display_id || viewInvoice.order_id}</p>
              </div>
              <div>
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Created Date</p>
                <p style={{ fontWeight: '500', margin: 0, color: 'var(--header-text)' }}>{new Date(viewInvoice.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ color: 'var(--body-text-muted)', fontSize: '14px', marginBottom: '4px' }}>Due Date</p>
                <p style={{ fontWeight: '500', margin: 0, color: 'var(--header-text)' }}>{viewInvoice.due_date ? new Date(viewInvoice.due_date).toLocaleDateString() : '-'}</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '24px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--body-text-muted)' }}>Amount (excl. VAT):</span>
                <span style={{ fontWeight: '500', color: 'var(--header-text)' }}>€{viewInvoice.subtotal?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--body-text-muted)' }}>VAT Amount:</span>
                <span style={{ fontWeight: '500', color: 'var(--header-text)' }}>€{(viewInvoice.subtotal ? (viewInvoice.total - viewInvoice.subtotal) : 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginTop: '8px' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--header-text)' }}>Total Amount:</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>€{viewInvoice.total?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setViewInvoice(null)}
                style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--body-text)', cursor: 'pointer', fontWeight: '500' }}
              >
                Close
              </button>
              <button 
                onClick={() => downloadPDF(viewInvoice)}
                style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
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
