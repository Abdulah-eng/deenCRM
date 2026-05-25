"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Download, FileText, CheckCircle2, Clock, AlertCircle, ChevronDown, Search, Eye, MessageCircle, Check } from 'lucide-react';
import styles from './page.module.css';

const invoices = [
  { id: 'INV-HW-4818', customer: 'Bauunternehmen GmbH', company: 'Heating Works', net: '€ 38,400', vat: '19%', gross: '€ 45,696', status: 'PAID', issued: '2024-04-28', due: '2024-05-28', paid: '€ 45,696' },
  { id: 'INV-SW-3211', customer: 'Wohnbau AG', company: 'Screed Works', net: '€ 32,500', vat: '19%', gross: '€ 38,675', status: 'SENT', issued: '2024-05-01', due: '2024-05-31', paid: '—' },
  { id: 'INV-EW-1874', customer: 'Immobilien Keller', company: 'Electrical Works', net: '€ 18,400', vat: '§13b', gross: '€ 18,400', status: 'OVERDUE', issued: '2024-04-15', due: '2024-05-15', paid: '—', isOverdue: true },
  { id: 'INV-SW-3212', customer: 'Stadtbau GmbH', company: 'Screed Works', net: '€ 71,800', vat: '19%', gross: '€ 85,442', status: 'DRAFT', issued: '2024-05-14', due: '2024-06-13', paid: '—' },
  { id: 'INV-HW-4828', customer: 'Bau & Projekt GmbH', company: 'Heating Works', net: '€ 48,200', vat: '19%', gross: '€ 57,358', status: 'PAID', issued: '2024-05-10', due: '2024-06-09', paid: '€ 57,358' },
  { id: 'INV-SW-3218', customer: 'Renovierung König', company: 'Screed Works', net: '€ 4,200', vat: '19%', gross: '€ 4,998', status: 'PAID', issued: '2024-05-08', due: '2024-06-07', paid: '€ 4,998' },
];

const STATUS_BADGES = {
  'PAID': { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  'SENT': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  'OVERDUE': { bg: 'rgba(241,65,108,0.1)', color: '#f1416c' },
  'DRAFT': { bg: 'rgba(161,165,183,0.1)', color: '#a1a5b7' }
};

export default function Invoices() {
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
            <div><h2 className={styles.kpiVal}>€ 250,569</h2><p className={styles.kpiLabel}>Total Invoiced</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><CheckCircle2 size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 108,052</h2><p className={styles.kpiLabel}>Received</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Clock size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 124,117</h2><p className={styles.kpiLabel}>Pending</p></div>
          </div></div>
          <div className="card"><div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ background: 'rgba(241,65,108,0.1)', color: '#f1416c' }}><AlertCircle size={20} /></div>
            <div><h2 className={styles.kpiVal}>€ 18,400</h2><p className={styles.kpiLabel}>Overdue</p></div>
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
                {invoices.map((inv, i) => (
                  <tr key={i}>
                    <td style={{ color: '#a61a2f', fontWeight: 600, fontSize: '11px' }}>{inv.id}</td>
                    <td><strong>{inv.customer}</strong></td>
                    <td style={{ color: '#a1a5b7' }}>{inv.company}</td>
                    <td style={{ fontWeight: 600 }}>{inv.net}</td>
                    <td>
                      {inv.vat === '§13b' ? (
                        <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>{inv.vat}</span>
                      ) : (
                        <span style={{ color: '#a1a5b7' }}>{inv.vat}</span>
                      )}
                    </td>
                    <td style={{ color: '#a61a2f', fontWeight: 600 }}>{inv.gross}</td>
                    <td>
                      <span className={styles.badge} style={{ backgroundColor: STATUS_BADGES[inv.status].bg, color: STATUS_BADGES[inv.status].color }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ color: '#a1a5b7' }}>{inv.issued}</td>
                    <td style={{ color: inv.isOverdue ? '#f1416c' : '#a1a5b7', fontWeight: inv.isOverdue ? 700 : 400 }}>{inv.due}</td>
                    <td style={{ color: inv.paid !== '—' ? '#10b981' : '#a1a5b7', fontWeight: 600 }}>{inv.paid}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn}><Eye size={12} color="#f1416c" /></button>
                        <button className={styles.actionBtn}><MessageCircle size={12} color="#3b82f6" /></button>
                        <button className={styles.actionBtn}><Check size={12} color="#10b981" /></button>
                        <button className={styles.actionBtn}><Download size={12} color="#a1a5b7" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
