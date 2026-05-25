"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { FileText, CheckCircle, Clock, AlertCircle, Plus, Search, Eye, Download, Trash2 } from 'lucide-react';
import styles from './page.module.css';

export default function Invoices() {
  const invoices = [
    { id: 'INV-HW-4818', ref: 'OFR-2024-022', customer: 'Bauunternehmen GmbH', company: 'Heating Works', net: '€ 38,400', vat: '€ 7,296', gross: '€ 45,696', status: 'PAID', issued: '2024-04-28', due: '2024-05-28' },
    { id: 'INV-SW-3211', ref: 'OFR-2024-019', customer: 'Wohnbau AG', company: 'Screed Works', net: '€ 32,500', vat: '€ 6,175', gross: '€ 38,675', status: 'SENT', issued: '2024-05-01', due: '2024-05-31' },
    { id: 'INV-EW-1874', ref: 'OFR-2024-018', customer: 'Immobilien Keller', company: 'Electrical Works', net: '€ 18,400', vat: '§13b', gross: '€ 18,400', status: 'OVERDUE', issued: '2024-04-15', due: '2024-05-15' },
    { id: 'INV-SW-3212', ref: 'OFR-2024-023', customer: 'Stadtbau GmbH', company: 'Screed Works', net: '€ 71,800', vat: '€ 13,642', gross: '€ 85,442', status: 'DRAFT', issued: '2024-05-14', due: '2024-06-13' },
    { id: 'INV-HW-4820', ref: 'OFR-2024-024', customer: 'Bau & Projekt GmbH', company: 'Heating Works', net: '€ 48,200', vat: '€ 9,158', gross: '€ 57,358', status: 'PAID', issued: '2024-05-10', due: '2024-06-09' },
  ];

  return (
    <>
      <Header title="Invoices" subtitle="Sales | Invoices" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Auto-generated invoices with consecutive numbering per company.</p>
          </div>
          <div className={styles.headerRight}>
            <button className="btn btn-primary" style={{ backgroundColor: '#50cd89' }}>
              <Plus size={16} style={{ marginRight: '8px' }} /> New Invoice
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(80, 205, 137, 0.1)', color: '#50cd89' }}>
                <FileText size={20} />
              </div>
              <h2 className={styles.statValue}>€ 245,571</h2>
              <p className={styles.statLabel}>Total Invoiced</p>
            </div>
          </div>
          
          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(80, 205, 137, 0.1)', color: '#50cd89' }}>
                <CheckCircle size={20} />
              </div>
              <h2 className={styles.statValue}>€ 103,054</h2>
              <p className={styles.statLabel}>Paid</p>
            </div>
          </div>

          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(0, 158, 247, 0.1)', color: '#009ef7' }}>
                <Clock size={20} />
              </div>
              <h2 className={styles.statValue}>€ 124,117</h2>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </div>

          <div className="card">
            <div className={styles.statContent}>
              <div className={styles.statIcon} style={{ backgroundColor: 'rgba(241, 65, 108, 0.1)', color: '#f1416c' }}>
                <AlertCircle size={20} />
              </div>
              <h2 className={styles.statValue}>€ 18,400</h2>
              <p className={styles.statLabel}>Overdue</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <FileText size={16} color="#50cd89" /> All Invoices
            </div>
            <div className={styles.searchBox}>
              <Search size={14} color="#a1a5b7" />
              <input type="text" placeholder="Search invoices..." />
            </div>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>INVOICE #</th>
                  <th>OFFER REF</th>
                  <th>CUSTOMER</th>
                  <th>COMPANY</th>
                  <th>NET</th>
                  <th>VAT</th>
                  <th>GROSS</th>
                  <th>STATUS</th>
                  <th>ISSUED</th>
                  <th>DUE</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => (
                  <tr key={idx}>
                    <td><span className={styles.invoiceId}>{inv.id}</span></td>
                    <td><span className={styles.offerRef}>{inv.ref}</span></td>
                    <td><strong className={styles.customer}>{inv.customer}</strong></td>
                    <td><span className={styles.company}>{inv.company}</span></td>
                    <td><span className={styles.currency}>{inv.net}</span></td>
                    <td><span className={styles.currency} style={{ color: '#a1a5b7' }}>{inv.vat}</span></td>
                    <td><span className={styles.currencyGross}>{inv.gross}</span></td>
                    <td>
                      <span className={`badge ${styles['status' + inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td><span className={styles.date}>{inv.issued}</span></td>
                    <td><span className={styles.date} style={{ color: inv.status === 'OVERDUE' ? '#f1416c' : 'inherit' }}>{inv.due}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn}><Eye size={14} color="#009ef7" /></button>
                        <button className={styles.actionBtn}><Download size={14} color="#50cd89" /></button>
                        <button className={styles.actionBtn}><Trash2 size={14} color="#f1416c" /></button>
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
