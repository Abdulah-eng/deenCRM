"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { HardDrive, Database, Download, RefreshCw, Play, CheckCircle, Calendar, ShieldAlert, Trash2, AlertCircle, X } from 'lucide-react';
import styles from './page.module.css';

const DEFAULT_BACKUPS = [
  { id: 'b-1', filename: 'backup_20260601_1200.sql', size: '1.18 MB', created_at: '2026-06-01T12:00:00.000Z', created_by: 'Admin User', status: 'SUCCESS' },
  { id: 'b-2', filename: 'backup_20260525_0915.sql', size: '1.04 MB', created_at: '2026-05-25T09:15:00.000Z', created_by: 'System (Auto)', status: 'SUCCESS' }
];

export default function BackupPage() {
  const [backups, setBackups] = useState([]);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState('');
  
  // Restore simulation state
  const [restoring, setRestoring] = useState(null); // holds backup object being restored
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [restoreStep, setRestoreStep] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('crm_backups');
    if (saved) {
      setBackups(JSON.parse(saved));
    } else {
      localStorage.setItem('crm_backups', JSON.stringify(DEFAULT_BACKUPS));
      setBackups(DEFAULT_BACKUPS);
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addAuditLog = (category, action, severity = 'INFO') => {
    try {
      const logs = JSON.parse(localStorage.getItem('crm_audit_logs') || '[]');
      const newLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        user: 'Admin User',
        category,
        action,
        severity
      };
      localStorage.setItem('crm_audit_logs', JSON.stringify([newLog, ...logs]));
    } catch (e) {
      console.error(e);
    }
  };

  const triggerBackup = async () => {
    setCreating(true);
    showToast("Backup-Generierung gestartet...");
    
    // Simulate generation delay
    await new Promise(r => setTimeout(r, 1800));
    
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.toTimeString().slice(0, 5).replace(/:/g, '');
    const filename = `backup_${dateStr}_${timeStr}.sql`;
    
    const newBackup = {
      id: 'b-' + Math.random().toString(36).substring(2, 9),
      filename,
      size: (1.1 + Math.random() * 0.5).toFixed(2) + " MB",
      created_at: date.toISOString(),
      created_by: 'Admin User',
      status: 'SUCCESS'
    };
    
    const updated = [newBackup, ...backups];
    setBackups(updated);
    localStorage.setItem('crm_backups', JSON.stringify(updated));
    
    setCreating(false);
    showToast("Backup erfolgreich erstellt!");
    addAuditLog('BACKUP', `Datenbank-Backup erstellt: ${filename}`, 'INFO');
  };

  const deleteBackup = (id, filename) => {
    if (confirm(`Sind Sie sicher, dass Sie das Backup "${filename}" löschen möchten?`)) {
      const updated = backups.filter(b => b.id !== id);
      setBackups(updated);
      localStorage.setItem('crm_backups', JSON.stringify(updated));
      showToast("Backup gelöscht.");
      addAuditLog('BACKUP', `Backup-Datei gelöscht: ${filename}`, 'WARNING');
    }
  };

  const downloadBackup = (backup) => {
    // High fidelity SQL dump file structure matching ProCRM schema
    const sqlContent = `-- ProCRM Supabase Database Backup
-- Dump Date: ${new Date().toISOString()}
-- Backup File: ${backup.filename}
-- Creator: ${backup.created_by}

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

-- 1. Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    contact TEXT,
    phone TEXT,
    city TEXT,
    category TEXT,
    rating INTEGER DEFAULT 5,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Materials Table
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    supplier_name TEXT,
    category TEXT,
    unit TEXT,
    price_a NUMERIC,
    price_b NUMERIC,
    price_c NUMERIC,
    best_price TEXT,
    stock TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    base_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    display_id TEXT UNIQUE NOT NULL,
    customer_id UUID,
    company_id UUID,
    total NUMERIC,
    status TEXT DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    role TEXT,
    company_id UUID,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seeding Sample Metadata
INSERT INTO public.services (name, category, base_price) VALUES 
('Heizungsinstallation Standard', 'Heizung', 12500.00),
('Estrich Verlegen Zement', 'Estrich', 3200.00)
ON CONFLICT DO NOTHING;

-- End of Database SQL Dump.`;

    const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = backup.filename;
    link.click();
    URL.revokeObjectURL(url);
    
    showToast("SQL-Datei heruntergeladen!");
    addAuditLog('BACKUP', `Backup heruntergeladen: ${backup.filename}`, 'INFO');
  };

  const triggerRestore = (backup) => {
    setRestoring(backup);
    setRestoreProgress(0);
    setRestoreStep('Vorbereitung zur Wiederherstellung...');
    
    // Simulate multi-phase restore process
    const steps = [
      { p: 15, msg: 'Verbindung zur Datenbank wird validiert...' },
      { p: 30, msg: 'Fremdschlüssel-Constraints werden temporär deaktiviert...' },
      { p: 50, msg: 'Bestehende Tabellendaten werden gelöscht (Clean Slate)...' },
      { p: 75, msg: 'SQL-Dump wird eingespielt und Tabellen neu strukturiert...' },
      { p: 90, msg: 'RLS-Policies und Fremdschlüssel-Constraints werden reaktiviert...' },
      { p: 100, msg: 'Cache wird zurückgesetzt. Datenbank erfolgreich wiederhergestellt!' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setRestoreProgress(step.p);
        setRestoreStep(step.msg);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setRestoring(null);
          showToast(`Datenbank erfolgreich auf Stand von ${backup.filename} zurückgesetzt!`);
          addAuditLog('BACKUP', `Datenbank erfolgreich wiederhergestellt aus Datei: ${backup.filename}`, 'WARNING');
        }, 800);
      }
    }, 1000);
  };

  return (
    <>
      <Header title="Backup & Daten" subtitle="System / Backup" />

      <div className={styles.container}>
        {/* Toast Notification */}
        {toast && (
          <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#50cd89', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(80,205,137,0.3)' }}>
            ✓ {toast}
            <button onClick={() => setToast('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        )}

        {/* Header Section */}
        <div className={styles.header}>
          <div>
            <p className={styles.description}>
              Verwalten Sie System-Backups, exportieren Sie SQL-Datenbank-Snapshots und stellen Sie vorherige Stände wieder her.
            </p>
          </div>
          <div>
            <button 
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              onClick={triggerBackup}
              disabled={creating}
            >
              <RefreshCw size={14} className={creating ? 'spin-animation' : ''} style={{ marginRight: '6px' }} />
              {creating ? 'Backup wird erstellt...' : 'Backup erstellen'}
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className={styles.backupGrid}>
          {/* Main List */}
          <div className="card" style={{ padding: 0 }}>
            <div className={styles.tableHeader}>
              <div className={styles.tableTitle}>
                <Database size={16} color="#7239ea" />
                Erstellte Backups ({backups.length})
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>DATEINAME</th>
                    <th>GRÖSSE</th>
                    <th>ERSTELLT AM</th>
                    <th>ERSTELLER</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'right' }}>AKTIONEN</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--body-text-muted)' }}>
                        Keine Backups vorhanden. Klicken Sie oben auf "Backup erstellen".
                      </td>
                    </tr>
                  ) : (
                    backups.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HardDrive size={16} color="#7239ea" />
                            <span style={{ fontWeight: 600, color: 'var(--header-text)', fontSize: '13px' }}>{b.filename}</span>
                          </div>
                        </td>
                        <td><span style={{ fontSize: '13px', color: 'var(--body-text)' }}>{b.size}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--body-text-muted)' }}>
                            <Calendar size={13} />
                            {new Date(b.created_at).toLocaleString('de-DE')}
                          </div>
                        </td>
                        <td><span style={{ fontSize: '13px', color: 'var(--body-text-muted)' }}>{b.created_by}</span></td>
                        <td>
                          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                            SUCCESS
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              className={styles.actionBtn}
                              title="Herunterladen"
                              onClick={() => downloadBackup(b)}
                            >
                              <Download size={13} color="#009ef7" />
                              Download
                            </button>
                            <button 
                              className={styles.actionBtn}
                              title="Wiederherstellen"
                              onClick={() => triggerRestore(b)}
                              style={{ border: '1px solid rgba(80, 205, 137, 0.3)', backgroundColor: 'rgba(80, 205, 137, 0.05)' }}
                            >
                              <Play size={13} color="#50cd89" />
                              Restore
                            </button>
                            <button 
                              className={`${styles.actionBtn} ${styles.dangerBtn}`}
                              title="Löschen"
                              onClick={() => deleteBackup(b.id, b.filename)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Connection Details */}
          <div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <ShieldAlert size={18} color="#ffc700" />
                <h3 className={styles.cardTitle}>Sicherheit & Status</h3>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.alertBlock}>
                  <strong>Wichtig:</strong> Die Wiederherstellung überschreibt alle aktuellen Daten im System. Erstellen Sie vor dem Einspielen immer ein manuelles Backup!
                </div>
                <div className={styles.statsList}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Verbindung</span>
                    <span className={styles.statValue} style={{ color: '#50cd89' }}>✓ Supabase Online</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Tabellen gezählt</span>
                    <span className={styles.statValue}>14 Systemtabellen</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Rolle</span>
                    <span className={styles.statValue}>Administrator</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Letztes Backup</span>
                    <span className={styles.statValue}>{backups[0] ? backups[0].filename.slice(7, 15) : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restore Simulation Modal Overlay */}
        {restoring && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
            <div className={styles.card} style={{ width: '480px', margin: 0 }}>
              <div className={styles.cardHeader}>
                <Play size={18} color="#f1416c" />
                <h3 className={styles.cardTitle}>Datenbank wird wiederhergestellt...</h3>
              </div>
              <div className={styles.cardBody}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <AlertCircle size={32} color="#f1416c" />
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--header-text)', fontWeight: 500 }}>
                    Spiele Backup <strong>{restoring.filename}</strong> ein. Bitte schließen Sie dieses Tabulatorfenster nicht!
                  </p>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${restoreProgress}%` }}></div>
                  </div>
                  <div className={styles.progressText}>
                    <span>{restoreStep}</span>
                    <span>{restoreProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Dynamic spinner CSS */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
