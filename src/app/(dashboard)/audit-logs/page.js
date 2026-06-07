"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Search, FileText, Download, Trash2, Clock, User, AlertCircle, X } from 'lucide-react';
import styles from './page.module.css';

const DEFAULT_LOGS = [
  { id: 'l-1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), user: 'Admin User', category: 'AUTH', action: 'Erfolgreiche Anmeldung am Admin-Portal.', severity: 'INFO' },
  { id: 'l-2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), user: 'Admin User', category: 'SYSTEM', action: 'SMTP Host Einstellungen geändert.', severity: 'INFO' },
  { id: 'l-3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), user: 'Max Mueller', category: 'ORDER', action: 'Auftrag #1025 für Kunde Heiz Werke Süddeutschland aktualisiert.', severity: 'INFO' },
  { id: 'l-4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), user: 'System (Auto)', category: 'BACKUP', action: 'Automatisches Datenbank-Backup erfolgreich generiert.', severity: 'INFO' },
  { id: 'l-5', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), user: 'Admin User', category: 'SYSTEM', action: 'SMTP Verbindungstest fehlgeschlagen (Connection Timeout).', severity: 'ERROR' },
  { id: 'l-6', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), user: 'Anna Fischer', category: 'USER', action: 'Berechtigungen für Klaus Weber aktualisiert.', severity: 'WARNING' }
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('crm_audit_logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    } else {
      localStorage.setItem('crm_audit_logs', JSON.stringify(DEFAULT_LOGS));
      setLogs(DEFAULT_LOGS);
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const q = search.toLowerCase();
    const matchesSearch = !q || 
      (log.action ?? '').toLowerCase().includes(q) ||
      (log.user ?? '').toLowerCase().includes(q) ||
      (log.category ?? '').toLowerCase().includes(q);
      
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const clearLogs = () => {
    if (confirm("Sind Sie sicher, dass Sie alle Aktivitätsprotokolle löschen möchten?")) {
      setLogs([]);
      localStorage.setItem('crm_audit_logs', JSON.stringify([]));
      showToast("Aktivitätsprotokoll bereinigt.");
    }
  };

  const exportCSV = () => {
    if (filteredLogs.length === 0) {
      alert("Keine Logs zum Exportieren vorhanden.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Zeitstempel,Benutzer,Kategorie,Aktivität,Priorität\n";

    filteredLogs.forEach(log => {
      const row = [
        log.id,
        new Date(log.timestamp).toLocaleString('de-DE'),
        `"${log.user?.replace(/"/g, '""')}"`,
        log.category,
        `"${log.action?.replace(/"/g, '""')}"`,
        log.severity
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("CSV-Export heruntergeladen!");
  };

  const getSeverityBadgeClass = (severity) => {
    if (severity === 'ERROR') return styles.badgeError;
    if (severity === 'WARNING') return styles.badgeWarning;
    return styles.badgeInfo;
  };

  return (
    <>
      <Header title="Aktivitätsprotokoll" subtitle="System / Aktivitätsprotokoll" />

      <div className={styles.container}>
        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#50cd89', color: 'white', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(80,205,137,0.3)' }}>
            ✓ {toast}
            <button onClick={() => setToast('')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={14} /></button>
          </div>
        )}

        {/* Header Title */}
        <div className={styles.header}>
          <div>
            <p className={styles.description}>
              Systemweite Überwachung aller Administrator-, Manager- und Mitarbeiteraktionen in Echtzeit.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className={styles.filterRow}>
          <div className={styles.searchBox}>
            <Search size={14} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Logs filtern (z.B. SMTP, Benutzer, ID)..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select 
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">Alle Kategorien</option>
            <option value="AUTH">Authentifizierung (AUTH)</option>
            <option value="USER">Benutzerverwaltung (USER)</option>
            <option value="ORDER">Auftragsverwaltung (ORDER)</option>
            <option value="BACKUP">Datensicherung (BACKUP)</option>
            <option value="SYSTEM">System/Einstellungen (SYSTEM)</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
          >
            <option value="all">Alle Dringlichkeiten</option>
            <option value="INFO">Information (INFO)</option>
            <option value="WARNING">Warnung (WARNING)</option>
            <option value="ERROR">Kritischer Fehler (ERROR)</option>
          </select>

          <button className={styles.exportBtn} onClick={exportCSV}>
            <Download size={14} /> Export CSV
          </button>

          <button 
            className={`${styles.exportBtn} ${styles.dangerBtn}`} 
            onClick={clearLogs}
            style={{ border: '1px solid rgba(241, 65, 108, 0.2)' }}
          >
            <Trash2 size={14} /> Protokoll leeren
          </button>
        </div>

        {/* Data Table Card */}
        <div className="card" style={{ padding: 0 }}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <FileText size={16} color="#7239ea" />
              Protokolleinträge ({filteredLogs.length})
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ZEITSTEMPEL</th>
                  <th>BENUTZER</th>
                  <th>KATEGORIE</th>
                  <th>AKTIVITÄT</th>
                  <th>PRIORITÄT</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--body-text-muted)' }}>
                      Keine Protokolleinträge gefunden. Passen Sie Ihre Filter an.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className={styles.timestamp}>
                          <Clock size={13} />
                          {new Date(log.timestamp).toLocaleString('de-DE')}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className={styles.user}>
                          <User size={13} />
                          {log.user}
                        </div>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>{log.category}</span>
                      </td>
                      <td>
                        <span className={styles.action}>{log.action}</span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${getSeverityBadgeClass(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
