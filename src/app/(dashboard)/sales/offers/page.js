"use client";
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { Plus, X, List, Save, Send, Trash2, Wand2 } from 'lucide-react';
import styles from './page.module.css';

export default function OffersQuotes() {
  const [showModal, setShowModal] = useState(false);
  
  // AI Generation State
  const [projectDetails, setProjectDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [offerItems, setOfferItems] = useState([]);
  const [netTotal, setNetTotal] = useState(0);

  const handleGenerateOffer = async () => {
    if (!projectDetails) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectDetails, type: 'Construction' })
      });
      const data = await res.json();
      if (res.ok && data.items) {
        setOfferItems(data.items);
        setNetTotal(data.estimatedTotal || data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0));
      } else {
        alert("Fehler beim Generieren des Angebots: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Fehler beim Verbinden mit der KI.");
    }
    setIsGenerating(false);
  };

  const removeItem = (index) => {
    const newItems = [...offerItems];
    newItems.splice(index, 1);
    setOfferItems(newItems);
    setNetTotal(newItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0));
  };

  return (
    <>
      <Header title="Angebote" subtitle="Vertrieb | Angebote & Kostenvoranschläge" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Angebote erstellen, verwalten und an Kunden senden.</p>
          </div>
          <div className={styles.headerRight}>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} style={{ marginRight: '8px' }} /> Neues Angebot
            </button>
          </div>
        </div>

        {/* The background table */}
        <div className="card">
          <div className="table-container" style={{ opacity: showModal ? 0.5 : 1 }}>
            <table>
              <thead>
                <tr>
                  <th>ANGEBOT #</th>
                  <th>KUNDE</th>
                  <th>UNTERNEHMEN</th>
                  <th>NETTO-GESAMT</th>
                  <th>STATUS</th>
                  <th>GÜLTIG BIS</th>
                  <th>AKTIONEN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>OFR-2024-022</td>
                  <td>Bauunternehmen GmbH</td>
                  <td>Heiz Werke Süddeutschland</td>
                  <td>€ 38.400</td>
                  <td><span className="badge badge-active" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}>ANGENOMMEN</span></td>
                  <td>25.05.2024</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>OFR-2024-019</td>
                  <td>Wohnbau AG</td>
                  <td>Estrich Werke Süddeutschland</td>
                  <td>€ 32.500</td>
                  <td><span className="badge" style={{ backgroundColor: 'rgba(0,158,247,0.12)', color: '#009ef7' }}>GESENDET</span></td>
                  <td>23.05.2024</td>
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
              <h3><Plus size={16} /> Neues Angebot erstellen</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Kunde *</label>
                  <select className={styles.input}>
                    <option>Kunde auswählen...</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Unternehmen *</label>
                  <select className={styles.input}>
                    <option value="Estrich Werke Süddeutschland">Estrich Werke Süddeutschland</option>
                    <option value="Heiz Werke Süddeutschland">Heiz Werke Süddeutschland</option>
                    <option value="Elektro Werke Süddeutschland">Elektro Werke Süddeutschland</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Gültig bis</label>
                  <input type="date" className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Fläche (m²)</label>
                  <input type="number" defaultValue="0" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Aufbauhöhe (mm)</label>
                  <input type="number" defaultValue="65" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>§13b UStG Steuerfrei</label>
                  <select className={styles.input}>
                    <option>Nein (Standard 19%)</option>
                    <option>Ja (Steuerschuldnerschaft des Leistungsempfängers)</option>
                  </select>
                </div>
              </div>

              {/* AI Generation Feature */}
              <div style={{ backgroundColor: 'rgba(114,57,234,0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed #7239ea', marginBottom: '24px', marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', color: '#7239ea' }}>
                  <Wand2 size={16} style={{ marginRight: 8 }} /> KI-Angebotsgenerator aus Notizen
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#5e6278' }}>
                  Notizen, Bauprotokolle oder Anforderungen einfügen. Die KI schlägt automatisch passende Positionen, Mengen und Preise vor.
                </p>
                <textarea 
                  rows={3} 
                  className={styles.input} 
                  placeholder="z.B. Benötigt 150m2 Anhydritestrich mit 30m2 Fußbodenheizung..."
                  value={projectDetails}
                  onChange={e => setProjectDetails(e.target.value)}
                  style={{ width: '100%', marginBottom: '12px' }}
                />
                <button 
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#7239ea', width: '100%' }} 
                  onClick={handleGenerateOffer}
                  disabled={isGenerating || !projectDetails}
                >
                  {isGenerating ? 'Generierung läuft...' : '✨ Positionen generieren'}
                </button>
              </div>

              <div className={styles.servicesSection}>
                <label className={styles.servicesLabel}><List size={14} /> Positionen</label>
                
                {offerItems.length > 0 ? (
                  <table style={{ width: '100%', textAlign: 'left', marginTop: '12px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '8px' }}>Beschreibung</th>
                        <th style={{ padding: '8px' }}>Menge</th>
                        <th style={{ padding: '8px' }}>Einheit</th>
                        <th style={{ padding: '8px' }}>Preis</th>
                        <th style={{ padding: '8px' }}>Gesamt</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {offerItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '8px' }}>{item.description}</td>
                          <td style={{ padding: '8px' }}>{item.quantity}</td>
                          <td style={{ padding: '8px' }}>{item.unit}</td>
                          <td style={{ padding: '8px' }}>€{Number(item.unitPrice).toFixed(2)}</td>
                          <td style={{ padding: '8px' }}>€{(item.quantity * item.unitPrice).toFixed(2)}</td>
                          <td style={{ padding: '8px' }}>
                            <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#f1416c', cursor: 'pointer' }}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.dropZone}>
                    <div className={styles.dropZoneEmpty}>
                      <List size={24} color="#a1a5b7" />
                      <p>Noch keine Positionen hinzugefügt. Nutzen Sie die KI oder fügen Sie manuell welche hinzu.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.summarySection}>
                <div className={styles.summaryRow}>
                  <span>Netto-Gesamt:</span>
                  <span>€ {netTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>USt (19%):</span>
                  <span>€ {(netTotal * 0.19).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span>Brutto-Gesamt:</span>
                  <span>€ {(netTotal * 1.19).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className="btn" style={{ backgroundColor: 'transparent' }} onClick={() => setShowModal(false)}>Abbrechen</button>
              <button 
                className="btn" 
                style={{ backgroundColor: 'var(--body-bg)', border: '1px solid var(--card-border)', marginLeft: 'auto' }}
                onClick={() => { alert('Entwurf erfolgreich gespeichert!'); setShowModal(false); }}
              >
                <Save size={16} style={{ marginRight: '6px' }} /> Entwurf speichern
              </button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#50cd89' }}
                onClick={() => { alert('Angebot erfolgreich erstellt und gesendet!'); setShowModal(false); }}
              >
                <Send size={16} style={{ marginRight: '6px' }} /> Erstellen & Senden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
