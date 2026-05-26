"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Plus, Search, Edit3, Trash2, Boxes } from 'lucide-react';
import styles from './page.module.css';

import { supabase } from '@/utils/supabase';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: true });
      if (data) setSuppliers(data);
      setLoading(false);
    }
    fetchSuppliers();
  }, []);

  const renderStars = (rating) => {
    return (
      <span className={styles.starRating}>
        {'★'.repeat(rating)}
        <span className={styles.starEmpty}>{'★'.repeat(5 - rating)}</span>
      </span>
    );
  };

  return (
    <>
      <Header title="Suppliers" subtitle="Admin / Suppliers" />
      <div className={styles.container}>
        
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Supplier Database</h2>
            <p className={styles.desc}>Manage all suppliers, their categories, and contact information.</p>
          </div>
          <button className={styles.addBtn}>
            <Plus size={16} /> Add Supplier
          </button>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <Boxes size={16} color="#7239ea" /> All Suppliers ({suppliers.length})
            </div>
            <div className={styles.tableActions}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input type="text" placeholder="Search suppliers..." />
              </div>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>SUPPLIER</th>
                  <th>CONTACT</th>
                  <th>CITY</th>
                  <th>CATEGORY</th>
                  <th>RATING</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s, index) => (
                  <tr key={s.id}>
                    <td style={{ color: '#a1a5b7' }}>{index + 1}</td>
                    <td>
                      <span className={styles.cellPrimary}>{s.name}</span>
                      <span className={styles.cellSecondary}>{s.email}</span>
                    </td>
                    <td>
                      <span className={styles.cellPrimary}>{s.contact}</span>
                      <span className={styles.cellSecondary}>{s.phone}</span>
                    </td>
                    <td><span className={styles.cellPrimary}>{s.city}</span></td>
                    <td>
                      <span className={`${styles.badge} ${styles.badgeCategory}`}>
                        {s.category}
                      </span>
                    </td>
                    <td>{renderStars(s.rating)}</td>
                    <td>
                      <span className={`${styles.badge} ${s.status === 'ACTIVE' ? styles.badgeGreen : styles.badgeRed}`}>
                        {s.status}
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
