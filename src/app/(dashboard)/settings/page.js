"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Settings, Save, Database, Shield, Mail } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Settings" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Configure global CRM settings, communication channels, and backup.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            {/* General Settings */}
            <div className="card">
              <div className={styles.cardHeader}>
                <Settings size={18} color="#7239ea" /> General Settings
              </div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>System Name</label>
                    <input type="text" defaultValue="ProCRM - Southern Germany Works" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Default Language</label>
                    <select className={styles.input}>
                      <option>German (de-DE)</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Date Format</label>
                    <select className={styles.input}>
                      <option>DD.MM.YYYY</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Currency</label>
                    <select className={styles.input}>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Default VAT Rate (%)</label>
                    <input type="number" defaultValue="19" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Timezone</label>
                    <select className={styles.input}>
                      <option>Europe/Berlin (CET+1)</option>
                    </select>
                  </div>
                </div>
                <div className={styles.actionRow}>
                  <button className="btn btn-primary">
                    <Save size={16} style={{ marginRight: '8px' }} /> Save Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Email / SMTP */}
            <div className="card" style={{ marginTop: '20px' }}>
              <div className={styles.cardHeader}>
                <Mail size={18} color="#009ef7" /> Email / SMTP Settings
              </div>
              <div className={styles.cardBody}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>SMTP Host</label>
                    <input type="text" defaultValue="smtp.gmail.com" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>SMTP Port</label>
                    <input type="text" defaultValue="587" className={styles.input} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>SMTP Username</label>
                    <input type="text" defaultValue="noreply@procrm.de" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>SMTP Password</label>
                    <input type="password" defaultValue="password123" className={styles.input} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>From Name</label>
                    <input type="text" defaultValue="ProCRM System" className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Encryption</label>
                    <select className={styles.input}>
                      <option>TLS</option>
                    </select>
                  </div>
                </div>
                <div className={styles.actionRow}>
                  <button className="btn" style={{ backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', border: '1px solid var(--card-border)' }}>Send Test Email</button>
                  <button className="btn btn-primary" style={{ marginLeft: '10px' }}>
                    <Save size={16} style={{ marginRight: '8px' }} /> Save SMTP
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightCol}>
            {/* Backup */}
            <div className="card">
              <div className={styles.cardHeader}>
                <Database size={18} color="#50cd89" /> Backup & Database
              </div>
              <div className={styles.cardBody}>
                <div className={styles.alertSuccess}>
                  <div className={styles.alertTitle}>Last Backup Successful</div>
                  <div className={styles.alertText}>Today at 03:00 AM — 142 MB</div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Backup Frequency</label>
                  <select className={styles.input}>
                    <option>Daily (03:00 AM)</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                  <label>Retention (days)</label>
                  <input type="number" defaultValue="30" className={styles.input} />
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="btn" style={{ width: '100%', backgroundColor: '#7239ea', color: 'white', justifyContent: 'center' }}>
                    Run Backup Now
                  </button>
                  <button className="btn" style={{ width: '100%', backgroundColor: 'var(--body-bg)', color: 'var(--body-text)', border: '1px solid var(--card-border)', justifyContent: 'center' }}>
                    Download Last Backup
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="card" style={{ marginTop: '20px' }}>
              <div className={styles.cardHeader}>
                <Shield size={18} color="#ffc700" /> Security
              </div>
              <div className={styles.cardBody}>
                <div className={styles.toggleRow}>
                  <span>Two-Factor Authentication</span>
                  <div className={styles.toggleActive}></div>
                </div>
                <div className={styles.toggleRow}>
                  <span>IP Whitelist</span>
                  <div className={styles.toggleInactive}></div>
                </div>
                
                <div className={styles.formGroup} style={{ marginTop: '20px' }}>
                  <label>Session Timeout (minutes)</label>
                  <input type="number" defaultValue="60" className={styles.input} />
                </div>
                <div className={styles.formGroup} style={{ marginTop: '16px' }}>
                  <label>Max Login Attempts</label>
                  <input type="number" defaultValue="5" className={styles.input} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
