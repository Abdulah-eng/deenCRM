"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Plus, ClipboardList, Search, Edit3, Trash2 } from 'lucide-react';
import styles from '../manager/orders/page.module.css';
import { supabase } from '@/utils/supabase';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (data) setServices(data);
      setLoading(false);
    }
    fetchServices();
  }, []);

  return (
    <>
      <Header title="Services" subtitle="Manage Services" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <p className={styles.desc}>Manage standard services and base pricing for offers.</p>
          <button className={`btn btn-primary ${styles.newBtn}`}>
            <Plus size={15} style={{ marginRight: 6 }} /> Add Service
          </button>
        </div>

        <div className="card">
          <div className={styles.tableTitle}>
            <span>All Services ({services.length})</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>SERVICE ID</th>
                  <th>SERVICE NAME</th>
                  <th>CATEGORY</th>
                  <th>BASE PRICE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td><span className={styles.orderId}>{s.id}</span></td>
                    <td><strong className={styles.customer}><ClipboardList size={14} style={{ marginRight: 8, display: 'inline' }} />{s.name}</strong></td>
                    <td>
                      <span className={styles.typeBadge} style={{ backgroundColor: 'rgba(0,158,247,0.12)', color: '#009ef7' }}>
                        {s.category}
                      </span>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>€ {parseFloat(s.base_price || 0).toFixed(2)}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn}><Edit3 size={13} color="#50cd89" /></button>
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
