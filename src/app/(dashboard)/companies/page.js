"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Flame, Droplet, Zap, Image as ImageIcon, Settings, Edit3 } from 'lucide-react';
import styles from './page.module.css';

const companiesData = [
  {
    id: 1,
    name: 'Heating Works Southern Germany',
    color: '#ea580c',
    icon: Flame,
    prefix: 'INV-HW',
    nextInvoice: '4,821',
    vatNumber: 'DE 123456789',
    customers: 87,
    activeOrders: 24,
    monthlyRevenue: '€ 198,400',
    prefixColor: '#ea580c'
  },
  {
    id: 2,
    name: 'Screed Works Southern Germany',
    color: '#3b82f6',
    icon: Droplet,
    prefix: 'INV-SW',
    nextInvoice: '3,214',
    vatNumber: 'DE 987654321',
    customers: 124,
    activeOrders: 31,
    monthlyRevenue: '€ 162,800',
    prefixColor: '#3b82f6'
  },
  {
    id: 3,
    name: 'Electrical Works Southern Germany',
    color: '#10b981',
    icon: Zap,
    prefix: 'INV-EW',
    nextInvoice: '1,876',
    vatNumber: 'DE 456789123',
    customers: 36,
    activeOrders: 8,
    monthlyRevenue: '€ 125,200',
    prefixColor: '#10b981'
  }
];

export default function CompaniesPage() {
  return (
    <>
      <Header title="Companies" subtitle="Admin / Companies" />
      <div className={styles.container}>
        
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Company Management</h2>
            <p className={styles.desc}>Manage 3 independent companies — logos, invoice numbering, VAT settings.</p>
          </div>
        </div>

        <div className={styles.companyGrid}>
          {companiesData.map(company => {
            const Icon = company.icon;
            return (
              <div key={company.id} className={styles.companyCard}>
                <div className={styles.cardHeader} style={{ backgroundColor: company.color }}>
                  <div className={styles.companyIcon}>
                    <Icon size={24} color="white" />
                  </div>
                  <div className={styles.companyName}>{company.name}</div>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.invoiceBlockRow}>
                    <div className={styles.invoiceBlock}>
                      <h4 style={{ color: company.prefixColor }}>{company.prefix}</h4>
                      <span>Invoice Prefix</span>
                    </div>
                    <div className={styles.invoiceBlock}>
                      <h4 style={{ color: company.prefixColor }}>{company.nextInvoice}</h4>
                      <span>Next Invoice #</span>
                    </div>
                  </div>

                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>VAT Number</span>
                    <span className={styles.statValue}>{company.vatNumber}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Customers</span>
                    <span className={styles.statValue}>{company.customers}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Active Orders</span>
                    <span className={styles.statValue}>{company.activeOrders}</span>
                  </div>
                  <div className={styles.statRow}>
                    <span className={styles.statLabel}>Monthly Revenue</span>
                    <span className={styles.statValue} style={{ color: '#10b981' }}>{company.monthlyRevenue}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button className={`${styles.footerBtn} ${styles.editBtn}`}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button className={`${styles.footerBtn} ${styles.settingsBtn}`}>
                    <Settings size={14} /> Settings
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.logoSettingsCard}>
          <div className={styles.logoSettingsHeader}>
            <ImageIcon size={18} color="#7239ea" /> Shared Logo Settings
          </div>
          <div className={styles.logoSettingsBody}>
            <div className={styles.logoPreview}>
              <Building2 size={24} color="#a1a5b7" />
              <span>ProCRM Logo</span>
            </div>
            <div className={styles.logoUpload}>
              <h4>Upload New Shared Logo</h4>
              <div className={styles.uploadRow}>
                <button className={styles.browseBtn}>Browse...</button>
                <span className={styles.fileName}>No file selected.</span>
              </div>
              <span className={styles.uploadHint}>PNG, max 2MB, 240x80px recommended.</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
// Imported Building2 here since it is used in the placeholder
import { Building2 } from 'lucide-react';
