"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { FileText, TrendingUp, DollarSign, Percent, Plus } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const STATUS_COLORS = {
  'SENT': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'ACCEPTED': { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  'DRAFT': { bg: 'rgba(161,165,183,0.12)', color: '#a1a5b7' },
  'PENDING': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  'REJECTED': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
};

export default function SalesDashboard() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [stats, setStats] = useState({ openOffers: 0, converted: 0, totalValue: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: offersData } = await supabase
        .from('offers')
        .select('*, customers(name)')
        .order('created_at', { ascending: false });

      if (offersData) {
        setOffers(offersData.map(o => ({
          id: o.display_id,
          customer: o.customers?.name || 'Unknown',
          value: o.total ? `€ ${Number(o.total).toLocaleString()}` : '€ 0',
          status: o.status,
          date: new Date(o.created_at).toLocaleDateString()
        })));

        let open = 0;
        let conv = 0;
        let totalVal = 0;
        
        let draft = 0;
        let sent = 0;
        let pending = 0;
        let accepted = 0;
        let rejected = 0;

        offersData.forEach(o => {
          if (o.status === 'DRAFT') draft++;
          if (o.status === 'SENT') sent++;
          if (o.status === 'PENDING') pending++;
          if (o.status === 'ACCEPTED') accepted++;
          if (o.status === 'REJECTED') rejected++;
          
          if (o.status !== 'REJECTED' && o.status !== 'ACCEPTED') open++;
          if (o.status === 'ACCEPTED') conv++;
          totalVal += Number(o.total || 0);
        });

        const totalCreated = offersData.length;
        const convRate = totalCreated > 0 ? ((conv / totalCreated) * 100).toFixed(0) : 0;

        setStats({
          openOffers: open,
          converted: conv,
          totalValue: totalVal,
          conversionRate: convRate
        });

        const useFallback = totalCreated === 0;
        setFunnelData([
          { label: 'Created', count: useFallback ? 28 : totalCreated, color: '#a1a5b7' },
          { label: 'Sent', count: useFallback ? 20 : sent, color: '#3b82f6' },
          { label: 'Negotiation', count: useFallback ? 14 : pending, color: '#f59e0b' },
          { label: 'Accepted', count: useFallback ? 12 : accepted, color: '#10b981' },
          { label: 'Rejected', count: useFallback ? 8 : rejected, color: '#ef4444' },
        ]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const maxFunnel = funnelData.length > 0 ? Math.max(...funnelData.map(d => d.count)) : 1;

  return (
    <>
      <Header title="Dashboard" subtitle="Dashboard" />
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <div className={styles.welcome}>
            <h2>Sales Dashboard</h2>
            <p>Track your offers, conversions, and customer pipeline.</p>
          </div>
          <button className={styles.addBtn} onClick={() => router.push('/sales/offers?add=true')}>
            <Plus size={16} /> New Offer
          </button>
        </div>

        <div className={styles.kpiGrid}>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <FileText size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>{stats.openOffers}</h2>
                <p className={styles.kpiLabel}>Open Offers</p>
                <span className={styles.kpiSub}>Live from DB</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>{stats.converted}</h2>
                <p className={styles.kpiLabel}>Converted Orders</p>
                <span className={styles.kpiSub}>Live from DB</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <DollarSign size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>€ {stats.totalValue.toLocaleString()}</h2>
                <p className={styles.kpiLabel}>Total Offer Value</p>
                <span className={styles.kpiSub}>Pipeline</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <Percent size={22} />
              </div>
              <div>
                <h2 className={styles.kpiVal}>{stats.conversionRate}%</h2>
                <p className={styles.kpiLabel}>Conversion Rate</p>
                <span className={styles.kpiSub} style={{ color: '#10b981' }}>All time</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          <div className="card">
            <div className={styles.cardHeader}>
              <h3>Recent Offers</h3>
              <span className={styles.viewAll}>View All</span>
            </div>
            <div className="table-container">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>OFFER #</th>
                    <th>CUSTOMER</th>
                    <th>VALUE</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o, i) => {
                    const sc = STATUS_COLORS[o.status] || STATUS_COLORS['DRAFT'];
                    return (
                      <tr key={i}>
                        <td><span className={styles.offerId}>{o.id}</span></td>
                        <td><strong>{o.customer}</strong></td>
                        <td><strong style={{ color: '#10b981' }}>{o.value}</strong></td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {o.status}
                          </span>
                        </td>
                        <td><span className={styles.date}>{o.date}</span></td>
                      </tr>
                    );
                  })}
                  {offers.length === 0 && !loading && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No offers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className={styles.cardHeader}>
              <h3>Offer Conversion Funnel</h3>
            </div>
            <div className={styles.funnelContainer}>
              <div className={styles.funnelBars}>
                {funnelData.map((d, i) => {
                  const pct = (d.count / maxFunnel) * 100;
                  return (
                    <div key={i} className={styles.funnelRow}>
                      <span className={styles.funnelLabel}>{d.label}</span>
                      <div className={styles.funnelTrack}>
                        <div className={styles.funnelFill} style={{ width: `${pct}%`, backgroundColor: d.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.funnelLegend}>
                {funnelData.map((d, i) => (
                  <div key={i} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: d.color }}></span>
                    <span className={styles.legendLabel}>{d.label}</span>
                    <strong className={styles.legendCount}>{d.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
