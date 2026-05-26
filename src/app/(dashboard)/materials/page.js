"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Plus, Search, Edit3, Trash2, CheckCircle2, PackageSearch } from 'lucide-react';
import styles from './page.module.css';

import { supabase } from '@/utils/supabase';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMaterials() {
      const { data, error } = await supabase.from('materials').select('*').order('created_at', { ascending: true });
      if (data) setMaterials(data);
      setLoading(false);
    }
    fetchMaterials();
  }, []);

  const getPriceElement = (price, isBest) => {
    if (isBest) {
      return (
        <span className={styles.priceBest}>
          {price} <CheckCircle2 size={14} />
        </span>
      );
    }
    return <span className={styles.priceNormal}>{price}</span>;
  };

  const getBadgeClass = (cat) => {
    switch(cat) {
      case 'SCREED': return styles.badgeScreed;
      case 'HEATING': return styles.badgeHeating;
      case 'ELECTRICAL': return styles.badgeElectrical;
      default: return styles.badgeGeneral;
    }
  };

  return (
    <>
      <Header title="Materials" subtitle="Admin / Materials" />
      <div className={styles.container}>
        
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.title}>Material Database</h2>
            <p className={styles.desc}>Track all materials with supplier-specific pricing and stock levels.</p>
          </div>
          <button className={styles.addBtn}>
            <Plus size={16} /> Add Material
          </button>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <PackageSearch size={16} color="#7239ea" /> All Materials ({materials.length})
            </div>
            <div className={styles.tableActions}>
              <div className={styles.searchBox}>
                <Search size={14} className={styles.searchIcon} />
                <input type="text" placeholder="Search materials..." />
              </div>
              <select className={styles.categorySelect}>
                <option>All Categories</option>
              </select>
            </div>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>MATERIAL NAME</th>
                  <th>CATEGORY</th>
                  <th>UNIT</th>
                  <th>PRICE A (SUPPLIER 1)</th>
                  <th>PRICE B (SUPPLIER 2)</th>
                  <th>PRICE C (SUPPLIER 3)</th>
                  <th>STOCK</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td><span className={styles.sku}>{m.sku}</span></td>
                    <td>
                      <span className={styles.cellPrimary}>{m.name}</span>
                      <span className={styles.cellSecondary}>{m.supplier_name}</span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getBadgeClass(m.category)}`}>
                        {m.category}
                      </span>
                    </td>
                    <td><span className={styles.cellPrimary}>{m.unit}</span></td>
                    <td>{getPriceElement(`€ ${m.price_a.toFixed(2)}`, m.best_price === 'A')}</td>
                    <td>{getPriceElement(`€ ${m.price_b.toFixed(2)}`, m.best_price === 'B')}</td>
                    <td>{getPriceElement(`€ ${m.price_c.toFixed(2)}`, m.best_price === 'C')}</td>
                    <td><span className={styles.stockLevel}>{m.stock}</span></td>
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
