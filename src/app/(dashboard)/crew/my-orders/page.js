"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { MapPin, Calendar, CheckCircle2, ChevronDown, Download } from 'lucide-react';
import styles from './page.module.css';

const orders = [
  {
    id: 'ORD-2024-058',
    customer: 'Bauunternehmen GmbH',
    service: 'Screed — Anhydrite CA-F5',
    location: 'Munich',
    area: '480 m²',
    height: '70mm',
    date: '2024-05-15',
    materials: 'Anhydrite Screed (480 m²), Insulation Board EPS35 (480 m²)',
    status: 'IN PROGRESS',
    statusColor: '#f97316',
    bgColor: 'rgba(249,115,22,0.05)'
  },
  {
    id: 'ORD-2024-060',
    customer: 'Stadtbau GmbH',
    service: 'Screed — Cement CT-C20',
    location: 'Augsburg',
    area: '320 m²',
    height: '75mm',
    date: '2024-05-17',
    materials: 'Cement Screed (320 m²), Edge Strip (85 m)',
    status: 'SCHEDULED',
    statusColor: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.05)'
  },
  {
    id: 'ORD-2024-062',
    customer: 'Bau & Projekt GmbH',
    service: 'Screed — Anhydrite CA-F5',
    location: 'Munich',
    area: '480 m²',
    height: '65mm',
    date: '2024-05-18',
    materials: 'Anhydrite Screed (480 m²)',
    status: 'SCHEDULED',
    statusColor: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.05)'
  },
  {
    id: 'ORD-2024-049',
    customer: 'Renovierung König',
    service: 'Heating Installation',
    location: 'Freiburg',
    area: '210 m²',
    height: '—',
    date: '2024-05-08',
    materials: 'UFH Pipe 16mm (2,100 m), Manifold 12-circuit',
    status: 'COMPLETED',
    statusColor: '#10b981',
    bgColor: 'rgba(16,185,129,0.05)'
  }
];

export default function MyOrders() {
  return (
    <>
      <Header title="My Orders" subtitle="My Orders" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h2 className={styles.title}>My Orders</h2>
            <p className={styles.desc}>All orders assigned to Team Alpha — details, materials, and status.</p>
          </div>
          <div className={styles.filterBox}>
            <span>All Status</span>
            <ChevronDown size={16} />
          </div>
        </div>

        <div className={styles.orderGrid}>
          {orders.map(o => (
            <div key={o.id} className={styles.orderCard} style={{ backgroundColor: o.bgColor, borderLeftColor: o.statusColor }}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.orderId} style={{ color: o.statusColor }}>{o.id}</span>
                  <h3 className={styles.customerName}>{o.customer}</h3>
                </div>
                <div className={styles.badge} style={{ borderColor: o.statusColor, color: o.statusColor }}>
                  {o.status}
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>SERVICE</span>
                  <span className={styles.value}>{o.service}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>LOCATION</span>
                  <span className={styles.value}><MapPin size={12} style={{ display: 'inline', color: '#f97316' }} /> {o.location}</span>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.label}>AREA</span>
                  <span className={styles.value} style={{ color: '#f97316' }}>{o.area}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.label}>HEIGHT</span>
                  <span className={styles.value}>{o.height}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.label}>DATE</span>
                  <span className={styles.value}>{o.date}</span>
                </div>
              </div>

              <div className={styles.materialsSection}>
                <span className={styles.label}>MATERIALS</span>
                <p className={styles.materialText}>{o.materials}</p>
              </div>

              <div className={styles.actionSection}>
                {o.status === 'COMPLETED' ? (
                  <div className={styles.completedStatus}>
                    <CheckCircle2 size={16} /> Order Completed — Completion notice sent.
                  </div>
                ) : (
                  <div className={styles.activeActions}>
                    <button className={styles.updateBtn}>
                      <CheckCircle2 size={14} /> Update Status
                    </button>
                    <button className={styles.downloadBtn}>
                      <Download size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
