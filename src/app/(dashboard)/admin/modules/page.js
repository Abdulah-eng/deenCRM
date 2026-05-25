"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import {
  ClipboardList, ClipboardCheck, FileText, Calendar,
  Users, Package, BarChart2, AlertCircle, Calculator, CreditCard, ToggleLeft, ToggleRight
} from 'lucide-react';
import styles from './page.module.css';

const modules = {
  core: [
    { id: 'offers', label: 'Offers & Quotes', desc: 'Create and manage professional offers with drag-and-drop services.', icon: ClipboardList, enabled: true },
    { id: 'orders', label: 'Orders Management', desc: 'Full order lifecycle from creation to completion.', icon: ClipboardCheck, enabled: true },
    { id: 'invoice', label: 'Invoice Module', desc: 'Auto-generate and send invoices per company.', icon: FileText, enabled: true },
    { id: 'scheduling', label: 'Scheduling & Calendar', desc: 'Calendar view for orders, appointments, and crew scheduling.', icon: Calendar, enabled: true },
  ],
  operations: [
    { id: 'crew', label: 'Crew Management', desc: 'Assign crews to orders, track sub-crews and costs.', icon: Users, enabled: true },
    { id: 'material', label: 'Material Ordering', desc: 'Auto-generate material order lists with supplier suggestions.', icon: Package, enabled: true },
    { id: 'capacity', label: 'Capacity Planning', desc: 'Weekly capacity reporting and utilization key figures.', icon: BarChart2, enabled: true },
    { id: 'complaints', label: 'Complaints Module', desc: 'Manage complaints, auto-create complaint orders.', icon: AlertCircle, enabled: true },
  ],
  finance: [
    { id: 'postcalc', label: 'Post-Calculation', desc: 'Plan vs. actual margin analysis per order.', icon: Calculator, enabled: true },
    { id: 'settlements', label: 'Crew Settlements', desc: 'Generate crew payment settlements from scheduling.', icon: CreditCard, enabled: true },
  ],
};

export default function ModuleManager() {
  const [state, setState] = useState(() => {
    const flat = {};
    Object.values(modules).flat().forEach(m => { flat[m.id] = m.enabled; });
    return flat;
  });

  const toggle = id => setState(prev => ({ ...prev, [id]: !prev[id] }));

  const ModuleCard = ({ mod }) => {
    const Icon = mod.icon;
    const active = state[mod.id];
    return (
      <div className={`${styles.moduleCard} ${active ? styles.moduleCardOn : styles.moduleCardOff}`}>
        <div className={styles.moduleIcon} style={{ color: active ? '#7239ea' : '#a1a5b7' }}>
          <Icon size={22} />
        </div>
        <div className={styles.moduleBody}>
          <h4 className={styles.moduleLabel}>{mod.label}</h4>
          <p className={styles.moduleDesc}>{mod.desc}</p>
        </div>
        <button
          className={styles.toggleBtn}
          onClick={() => toggle(mod.id)}
          aria-label={`Toggle ${mod.label}`}
        >
          {active
            ? <ToggleRight size={32} color="#7239ea" />
            : <ToggleLeft size={32} color="#a1a5b7" />}
        </button>
      </div>
    );
  };

  const Section = ({ title, count, items }) => (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>{title}</h3>
        <span className={styles.sectionBadge}>{count} modules</span>
      </div>
      <div className={styles.modulesGrid}>
        {items.map(m => <ModuleCard key={m.id} mod={m} />)}
      </div>
    </div>
  );

  return (
    <>
      <Header title="Module Manager" subtitle="Module Manager" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Module Manager</h2>
          <p className={styles.description}>Enable or disable CRM modules independently. Each module functions on its own.</p>
        </div>

        <Section title="Core Modules" count={modules.core.length} items={modules.core} />
        <Section title="Operations Modules" count={modules.operations.length} items={modules.operations} />
        <Section title="Finance Modules" count={modules.finance.length} items={modules.finance} />
      </div>
    </>
  );
}
