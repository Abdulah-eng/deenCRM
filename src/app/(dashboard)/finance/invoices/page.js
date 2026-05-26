"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Download, FileText, CheckCircle2, Clock, AlertCircle, ChevronDown, Search, Eye, MessageCircle, Check } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const STATUS_BADGES = {
  'PAID': { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  'SENT': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  'OVERDUE': { bg: 'rgba(241,65,108,0.1)', color: '#f1416c' },
  'DRAFT': { bg: 'rgba(161,165,183,0.1)', color: '#a1a5b7' },
  'OPEN': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' }
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          orders (
            customers (name),
            companies (name)
          )
        `)
        .order('issue_date', { ascending: false });

      if (!error && data) {
        setInvoices(data);
      }
      setLoading(false);
    }
    fetchInvoices();
  }, []);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const received = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + Number(inv.total), 0);
  const pending = invoices.filter(inv => inv.status === 'SENT' || inv.status === 'OPEN').reduce((sum, inv) => sum + Number(inv.total), 0);
  const overdue = invoices.filter(inv => inv.status === 'OVERDUE').reduce((sum, inv) => sum + Number(inv.total), 0);

  const formatCurrency = (val) => val ? `€ ${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

  return (
    <>
      <Header title="Invoices" subtitle="Invoices" />
      <div className={styles.container}>
        
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>Invoice Management</h2>
            <p className={styles.desc}>All invoices across companies with payment tracking and VAT breakdown.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className={styles.filterBox}>
              <span>All Companies</span>
              <ChevronDown size={16} />
            </div>
            <button className="btn btn-primary" style={{ backgroundColor: '#a61a2f', borderColor: '#a61a2f' }}>
              <Download size={16} style={{ marginRight: 6 }} /> Export
            </button>
          </div>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><FileText size={20} /></div>
            <div><h2 className={styles.kpiVal}>{formatCurrency(totalInvoiced)}</h2><p className={styles.kpiLabel}>Total Invoiced</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><CheckCircle2 size={20} /></div>
            <div><h2 className={styles.kpiVal}>{formatCurrency(received)}</h2><p className={styles.kpiLabel}>Received</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Clock size={20} /></div>
            <div><h2 className={styles.kpiVal}>{formatCurrency(pending)}</h2><p className={styles.kpiLabel}>Pending</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><AlertCircle size={20} /></div>
            <div><h2 className={styles.kpiVal}>{formatCurrency(overdue)}</h2><p className={styles.kpiLabel}>Overdue</p></div>
          </div></div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}><FileText size={16} color="#a61a2f" /> All Invoices</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className={styles.searchBox}>
                <Search size={14} color="#a1a5b7" />
                <input type="text" placeholder="Search Invoices..." />
              </div>
              <div className={styles.filterBoxSmall}>
                <span>All Status</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Loading invoices...</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>INVOICE #</th>
                    <th>CUSTOMER</th>
                    <th>COMPANY</th>
                    <th>NET</th>
                    <th>VAT</th>
                    <th>GROSS</th>
                    <th>STATUS</th>
                    <th>ISSUED</th>
                    <th>DUE</th>
                    <th>PAID AMOUNT</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 && (
                    <tr><td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>No invoices found.</td></tr>
                  )}
                  {invoices.map((inv) => {
                    const isOverdue = inv.status === 'OVERDUE';
                    const customerName = inv.orders?.customers?.name || 'Unknown';
                    const companyName = inv.orders?.companies?.name || 'Unknown';
                    
                    return (
                      <tr key={inv.id}>
                        <td style={{ color: '#a61a2f', fontWeight: 600, fontSize: '11px' }}>{inv.display_id}</td>
                        <td><strong>{customerName}</strong></td>
                        <td style={{ color: '#a1a5b7' }}>{companyName}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(inv.subtotal)}</td>
                        <td>
                          {inv.vat_rate === 0 ? (
                            <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>§13b</span>
                          ) : (
                            <span style={{ color: '#a1a5b7' }}>{inv.vat_rate}%</span>
                          )}
                        </td>
                        <td style={{ color: '#a61a2f', fontWeight: 600 }}>{formatCurrency(inv.total)}</td>
                        <td>
                          <span className={styles.badge} style={{ backgroundColor: STATUS_BADGES[inv.status]?.bg || '#eee', color: STATUS_BADGES[inv.status]?.color || '#666' }}>
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ color: '#a1a5b7' }}>{inv.issue_date}</td>
                        <td style={{ color: isOverdue ? '#f1416c' : '#a1a5b7', fontWeight: isOverdue ? 700 : 400 }}>{inv.due_date}</td>
                        <td style={{ color: inv.status === 'PAID' ? '#10b981' : '#a1a5b7', fontWeight: 600 }}>
                          {inv.status === 'PAID' ? formatCurrency(inv.total) : '—'}
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn}><Eye size={12} color="#f1416c" /></button>
                            <button className={styles.actionBtn}><MessageCircle size={12} color="#3b82f6" /></button>
                            <button className={styles.actionBtn}><Check size={12} color="#10b981" /></button>
                            <button className={styles.actionBtn}><Download size={12} color="#a1a5b7" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
