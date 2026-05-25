"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Plus, X, List, Save, Send, Trash2 } from 'lucide-react';
import styles from './page.module.css';

export default function OffersQuotes() {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <Header title="Offers & Quotes" subtitle="Sales | Offers & Quotes" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Create, manage, and send offers to customers.</p>
          </div>
          <div className={styles.headerRight}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} style={{ marginRight: '8px' }} /> New Offer
            </button>
          </div>
        </div>

        {/* The background table would be here, but for this design we focus on the modal overlay */}
        <div className="card">
          <div className="table-container" style={{ opacity: 0.5 }}>
            <table>
              <thead>
                <tr>
                  <th>OFFER #</th>
                  <th>CUSTOMER</th>
                  <th>COMPANY</th>
                  <th>NET TOTAL</th>
                  <th>STATUS</th>
                  <th>VALID UNTIL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>OFR-2024-022</td>
                  <td>Bauunternehmen GmbH</td>
                  <td>Heating Works</td>
                  <td>€ 38,400</td>
                  <td><span className="badge badge-active">ACCEPTED</span></td>
                  <td>2024-05-25</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>OFR-2024-019</td>
                  <td>Wohnbau AG</td>
                  <td>Screed Works</td>
                  <td>€ 32,500</td>
                  <td><span className="badge" style={{ backgroundColor: '#009ef7', color: 'white' }}>SENT</span></td>
                  <td>2024-05-23</td>
                  <td>--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3><Plus size={16} /> Create New Offer</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Customer *</label>
                  <select className={styles.input}>
                    <option>Select customer...</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Company *</label>
                  <select className={styles.input}>
                    <option>Screed Works</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Valid Until</label>
                  <input type="date" className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Area (m²)</label>
                  <input type="number" defaultValue="0" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Assembly Height (mm)</label>
                  <input type="number" defaultValue="65" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>§13b VAT Exempt</label>
                  <select className={styles.input}>
                    <option>No (Standard 19%)</option>
                  </select>
                </div>
              </div>

              <div className={styles.servicesSection}>
                <label className={styles.servicesLabel}><List size={14} /> Services (Drag & Drop)</label>
                
                <div className={styles.dragDropGrid}>
                  <div className={styles.availableServices}>
                    <div className={styles.serviceListHeader}>AVAILABLE SERVICES</div>
                    <div className={styles.draggableItem}>
                      Anhydrite Screed CA-F5 (per m²) — € 12.50
                    </div>
                    <div className={styles.draggableItem}>
                      Cement Screed CT-C20 (per m²) — € 9.80
                    </div>
                    <div className={styles.draggableItem}>
                      Underfloor Heating Pipe 16mm — € 2.40
                    </div>
                    <div className={styles.draggableItem}>
                      Insulation Board EPS 35 (per m²) — € 4.80
                    </div>
                    <div className={styles.draggableItem}>
                      Labour — Screed Laying — € 8.50/m²
                    </div>
                  </div>
                  
                  <div className={styles.dropZone}>
                    <div className={styles.dropZoneEmpty}>
                      <List size={24} color="#a1a5b7" />
                      <p>Drag services here to add to offer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.summarySection}>
                <div className={styles.summaryRow}>
                  <span>Net Total:</span>
                  <span>€ 0.00</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>VAT (19%):</span>
                  <span>€ 0.00</span>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span>Grand Total:</span>
                  <span>€ 0.00</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className="btn" style={{ backgroundColor: 'transparent' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn" style={{ backgroundColor: 'var(--body-bg)', border: '1px solid var(--card-border)', marginLeft: 'auto' }}>
                <Save size={16} style={{ marginRight: '6px' }} /> Save Draft
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: '#50cd89' }}>
                <Send size={16} style={{ marginRight: '6px' }} /> Create & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
