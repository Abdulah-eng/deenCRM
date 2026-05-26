"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Plus, Users, Search, Edit3, Trash2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

// Mock summary data to match screenshot
const KPI_DATA = {
  total: 6,
  active: 5,
  exempt: 3,
  revenue: '€ 497K'
};

const MOCK_CUSTOMERS = [
  { id: 1, company: 'Bauunternehmen GmbH', email: 'f.mueller@bauunternehmen.de', contact: 'Friedrich Müller', phone: '+49 89 1234567', city: 'Munich', vat13b: true, assigned: 'Heating', orders: 5, total: '€ 48,200', status: 'ACTIVE' },
  { id: 2, company: 'Wohnbau AG', email: 's.richter@wohnbau.de', contact: 'Sabine Richter', phone: '+49 89 7654321', city: 'Stuttgart', vat13b: false, assigned: 'Screed', orders: 12, total: '€ 125,800', status: 'ACTIVE' },
  { id: 3, company: 'Immobilien Keller KG', email: 't.keller@ik.de', contact: 'Thomas Keller', phone: '+49 711 9876543', city: 'Augsburg', vat13b: true, assigned: 'Electrical', orders: 3, total: '€ 22,400', status: 'ACTIVE' },
  { id: 4, company: 'Stadtbau GmbH', email: 'e.zimmermann@stadtbau.de', contact: 'Eva Zimmermann', phone: '+49 821 4567890', city: 'Nuremberg', vat13b: false, assigned: 'Screed', orders: 8, total: '€ 87,500', status: 'ACTIVE' },
  { id: 5, company: 'Renovierung König', email: 'k.koenig@reno.de', contact: 'Klaus König', phone: '+49 89 3456789', city: 'Munich', vat13b: true, assigned: 'Heating', orders: 2, total: '€ 15,200', status: 'INACTIVE' },
  { id: 6, company: 'Bau & Projekt GmbH', email: 'm.wolf@bauprojekt.de', contact: 'Maria Wolf', phone: '+49 911 2345678', city: 'Freiburg', vat13b: false, assigned: 'All', orders: 15, total: '€ 198,000', status: 'ACTIVE' }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  // We'll use mock data to perfectly match the screenshot, but we could merge with supabase if needed.

  return (
    <>
      <Header title="Customers" subtitle="Admin / Customers" />
      <div className={styles.container}>
        
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Customer Database</h2>
            <p className={styles.desc}>Manage customers with VAT §13b status and company assignments.</p>
          </div>
          <button className={styles.addBtn}>
            <Plus size={16} /> Add Customer
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: '#7239ea' }}>{KPI_DATA.total}</div>
            <div className={styles.kpiLabel}>Total Customers</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: '#50cd89' }}>{KPI_DATA.active}</div>
            <div className={styles.kpiLabel}>Active</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: '#f59e0b' }}>{KPI_DATA.exempt}</div>
            <div className={styles.kpiLabel}>§13b Exempt</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: '#7239ea' }}>{KPI_DATA.revenue}</div>
            <div className={styles.kpiLabel}>Total Revenue</div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <Users size={16} color="#7239ea" /> All Customers
            </div>
            <div className={styles.tableActions}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input type="text" placeholder="Search customers..." />
              </div>
              <select className={styles.companySelect}>
                <option>All Companies</option>
              </select>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>COMPANY NAME</th>
                  <th>CONTACT</th>
                  <th>CITY</th>
                  <th>§13B VAT</th>
                  <th>ASSIGNED TO</th>
                  <th>ORDERS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, index) => (
                  <tr key={c.id}>
                    <td style={{ color: '#a1a5b7' }}>{index + 1}.</td>
                    <td>
                      <span className={styles.cellPrimary}>{c.company}</span>
                      <span className={styles.cellSecondary}>{c.email}</span>
                    </td>
                    <td>
                      <span className={styles.cellPrimary}>{c.contact}</span>
                      <span className={styles.cellSecondary}>{c.phone}</span>
                    </td>
                    <td><span className={styles.cellPrimary}>{c.city}</span></td>
                    <td>
                      <span className={`${styles.badge} ${c.vat13b ? styles.badgeYellow : styles.badgeGray}`}>
                        {c.vat13b ? '§13B EXEMPT' : 'STANDARD VAT'}
                      </span>
                    </td>
                    <td><span className={styles.cellPrimary}>{c.assigned}</span></td>
                    <td><span className={styles.cellPrimary}>{c.orders}</span></td>
                    <td><span className={styles.cellPrimary} style={{ color: '#7239ea' }}>{c.total}</span></td>
                    <td>
                      <span className={c.status === 'ACTIVE' ? styles.badgeGreen : styles.badgeRed}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionWrapper}>
                        <button className={styles.actionBtn}><Edit3 size={13} color="#7239ea" /></button>
                        <button className={styles.actionBtn}><Trash2 size={13} color="#f1416c" /></button>
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
