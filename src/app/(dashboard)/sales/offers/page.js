"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Plus, X, List, Save, Send, Trash2, Wand2, Check } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

// Format a number to currency string
function fmtCurrency(n) {
  const num = Number(n);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Safe multiply: always returns a number
function multiply(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (isNaN(na) || isNaN(nb)) return 0;
  return na * nb;
}

// Compute net total from items array
function calcNetTotal(items) {
  return items.reduce((sum, item) => {
    return sum + multiply(item.quantity, item.unitPrice);
  }, 0);
}

function OffersQuotesContent() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [vatExempt, setVatExempt] = useState(false); // boolean, not string

  const [projectDetails, setProjectDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Each item: { description: string, quantity: number, unit: string, unitPrice: number }
  const [offerItems, setOfferItems] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (searchParams.get('add') === 'true') setShowModal(true);
  }, [searchParams]);

  async function fetchInitialData() {
    try {
      setLoading(true);
      const { data: offersData } = await supabase
        .from('offers')
        .select('id, display_id, total, status, created_at, customers(id,name), companies(id,name)')
        .order('created_at', { ascending: false });
      setOffers(offersData || []);

      const { data: custData } = await supabase.from('customers').select('id, name');
      const { data: compData } = await supabase.from('companies').select('id, name');
      if (custData?.length) { setCustomers(custData); setSelectedCustomer(custData[0].id); }
      if (compData?.length) { setCompanies(compData); setSelectedCompany(compData[0].id); }
    } catch (e) {
      console.error('fetchInitialData error:', e);
    } finally {
      setLoading(false);
    }
  }

  function addEmptyRow() {
    setOfferItems(prev => [...prev, { description: '', quantity: 1, unit: 'Stück', unitPrice: 0 }]);
  }

  function removeRow(idx) {
    setOfferItems(prev => prev.filter((_, i) => i !== idx));
  }

  function updateRow(idx, field, rawValue) {
    setOfferItems(prev => {
      const copy = prev.map((item, i) => {
        if (i !== idx) return item;
        // Always store numeric fields as numbers
        if (field === 'quantity' || field === 'unitPrice') {
          const parsed = parseFloat(rawValue);
          return { ...item, [field]: isNaN(parsed) ? 0 : parsed };
        }
        return { ...item, [field]: rawValue };
      });
      return copy;
    });
  }

  async function handleGenerateOffer() {
    if (!projectDetails) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectDetails, type: 'Construction' }),
      });
      const data = await res.json();
      if (res.ok && data.items) {
        // Force all values to proper numbers
        const parsed = data.items.map(item => ({
          description: String(item.description ?? ''),
          quantity:  Number(item.quantity)  || 0,
          unit:      String(item.unit ?? 'Stück'),
          unitPrice: Number(item.unitPrice) || 0,
        }));
        setOfferItems(parsed);
      } else {
        alert('Fehler beim Generieren: ' + (data.error || 'Unbekannt'));
      }
    } catch (err) {
      console.error(err);
      alert('Verbindungsfehler mit KI.');
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave(statusVal = 'DRAFT') {
    if (!selectedCustomer || !selectedCompany) {
      alert('Bitte Kunde und Unternehmen auswählen.');
      return;
    }
    const net = calcNetTotal(offerItems);
    setSaving(true);
    try {
      const displayId = `OFR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: inserted, error: offerErr } = await supabase
        .from('offers')
        .insert([{ display_id: displayId, customer_id: selectedCustomer, company_id: selectedCompany, total: net, status: statusVal }])
        .select();
      if (offerErr) throw offerErr;

      const offerId = inserted[0].id;
      const validItems = offerItems.filter(i => i.description.trim());
      if (validItems.length) {
        const { error: itemsErr } = await supabase.from('offer_items').insert(
          validItems.map(i => ({
            offer_id: offerId,
            description: `${i.description} (${i.unit})`,
            quantity: Number(i.quantity) || 1,
            price: Number(i.unitPrice) || 0,
          }))
        );
        if (itemsErr) throw itemsErr;
      }

      alert(statusVal === 'DRAFT' ? 'Entwurf gespeichert!' : 'Angebot erstellt und gesendet!');
      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (e) {
      console.error('Save error:', e);
      alert('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStatus(id, status) {
    await supabase.from('offers').update({ status }).eq('id', id);
    fetchInitialData();
  }

  async function handleDelete(id) {
    if (!confirm('Angebot löschen?')) return;
    await supabase.from('offers').delete().eq('id', id);
    fetchInitialData();
  }

  function resetForm() {
    setProjectDetails('');
    setOfferItems([]);
    setValidUntil('');
    setVatExempt(false);
    if (customers.length) setSelectedCustomer(customers[0].id);
    if (companies.length) setSelectedCompany(companies[0].id);
  }

  function statusBadge(status) {
    const map = {
      ACCEPTED: ['ANGENOMMEN', 'rgba(16,185,129,0.12)', '#10b981'],
      SENT:     ['GESENDET',   'rgba(0,158,247,0.12)',  '#009ef7'],
      REJECTED: ['ABGELEHNT', 'rgba(239,68,68,0.12)',  '#ef4444'],
      DRAFT:    ['ENTWURF',   'rgba(161,165,183,0.12)','#a1a5b7'],
    };
    const [label, bg, color] = map[status] || map.DRAFT;
    return <span style={{ background: bg, color, fontWeight: 600, padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{label}</span>;
  }

  // ─── RENDER ────────────────────────────────────────────────────────────────
  // Compute totals inline here — guaranteed to always reflect current offerItems
  const currentNetTotal   = calcNetTotal(offerItems);
  const currentVat        = vatExempt ? 0 : currentNetTotal * 0.19;
  const currentGrossTotal = currentNetTotal + currentVat;

  return (
    <>
      <Header title="Angebote" subtitle="Vertrieb | Angebote & Kostenvoranschläge" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Angebote erstellen, verwalten und an Kunden senden.</p>
          </div>
          <div className={styles.headerRight}>
            <button className="btn btn-primary"
              style={{ backgroundColor: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center' }}
              onClick={() => { resetForm(); setShowModal(true); }}>
              <Plus size={16} style={{ marginRight: 8 }} /> Neues Angebot
            </button>
          </div>
        </div>

        <div className="card">
          <div className="table-container" style={{ opacity: showModal ? 0.5 : 1 }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--body-text-muted)' }}>Lade Angebote...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ANGEBOT #</th><th>KUNDE</th><th>UNTERNEHMEN</th>
                    <th>NETTO-GESAMT</th><th>STATUS</th><th>GÜLTIG BIS</th><th>AKTIONEN</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>{o.display_id}</td>
                      <td>{o.customers?.name || '—'}</td>
                      <td>{o.companies?.name || '—'}</td>
                      <td style={{ fontWeight: 600, color: '#10b981' }}>€ {fmtCurrency(o.total)}</td>
                      <td>{statusBadge(o.status)}</td>
                      <td>{o.created_at ? new Date(new Date(o.created_at).getTime() + 14*86400000).toLocaleDateString() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {o.status !== 'ACCEPTED' && (
                            <button onClick={() => handleUpdateStatus(o.id, 'ACCEPTED')}
                              style={{ background: 'rgba(16,185,129,0.1)', border: 'none', color: '#10b981', cursor: 'pointer', padding: 6, borderRadius: 4, display: 'flex' }}>
                              <Check size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(o.id)}
                            style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 6, borderRadius: 4, display: 'flex' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!offers.length && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--body-text-muted)' }}>
                      Keine Angebote. Klicken Sie "Neues Angebot" zum Erstellen.
                    </td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--header-text)' }}>
                <Plus size={16} /> Neues Angebot erstellen
              </h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div className={styles.modalBody}>
              {/* Row 1: Customer / Company / Date */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Kunde *</label>
                  <select className={styles.input} value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Unternehmen *</label>
                  <select className={styles.input} value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Gültig bis</label>
                  <input type="date" className={styles.input} value={validUntil} onChange={e => setValidUntil(e.target.value)} />
                </div>
              </div>

              {/* VAT toggle */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>§13b UStG Steuerfrei</label>
                  <select className={styles.input} value={vatExempt ? 'true' : 'false'} onChange={e => setVatExempt(e.target.value === 'true')}>
                    <option value="false">Nein (Standard 19% USt.)</option>
                    <option value="true">Ja (Steuerschuldnerschaft des Leistungsempfängers)</option>
                  </select>
                </div>
              </div>

              {/* AI Generator */}
              <div style={{ background: 'rgba(16,185,129,0.05)', padding: 16, borderRadius: 8, border: '1px dashed #10b981', marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', color: '#10b981' }}>
                  <Wand2 size={16} style={{ marginRight: 8 }} /> KI-Angebotsgenerator
                </h4>
                <textarea rows={3} className={styles.input}
                  placeholder="z.B. Benötigt 150m2 Anhydritestrich mit 30m2 Fußbodenheizung..."
                  value={projectDetails} onChange={e => setProjectDetails(e.target.value)}
                  style={{ width: '100%', marginBottom: 10, boxSizing: 'border-box' }} />
                <button className="btn btn-primary"
                  style={{ backgroundColor: '#10b981', borderColor: '#10b981', width: '100%', fontWeight: 600 }}
                  onClick={handleGenerateOffer} disabled={isGenerating || !projectDetails}>
                  {isGenerating ? 'Generierung läuft...' : '✨ Positionen generieren'}
                </button>
              </div>

              {/* Items table */}
              <div className={styles.servicesSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label className={styles.servicesLabel} style={{ margin: 0 }}><List size={14} /> Positionen</label>
                  <button onClick={addEmptyRow}
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#10b981', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={13} /> Position hinzufügen
                  </button>
                </div>

                {offerItems.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                        {['Beschreibung', 'Menge', 'Einheit', 'Preis (€)', 'Gesamt', ''].map((h, i) => (
                          <th key={i} style={{ padding: '6px 8px', color: 'var(--body-text-muted)', fontSize: 11, textTransform: 'uppercase', textAlign: 'left', fontWeight: 600,
                            width: i === 0 ? 'auto' : i === 1 ? 70 : i === 2 ? 90 : i === 3 ? 100 : i === 4 ? 100 : 36 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {offerItems.map((item, idx) => {
                        // Inline calculation — always uses the actual current item values
                        const qty   = Number(item.quantity)  || 0;
                        const price = Number(item.unitPrice) || 0;
                        const lineTotal = qty * price;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--card-border)' }}>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="text" value={item.description}
                                onChange={e => updateRow(idx, 'description', e.target.value)}
                                style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 4, padding: '4px 8px', background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit' }}
                                placeholder="Beschreibung..." />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" value={item.quantity}
                                onChange={e => updateRow(idx, 'quantity', e.target.value)}
                                style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 4, padding: '4px 8px', background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit' }}
                                min="0" step="any" />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <select value={item.unit} onChange={e => updateRow(idx, 'unit', e.target.value)}
                                style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 4, padding: '4px 6px', background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit' }}>
                                {['Stück', 'm²', 'm³', 'm', 'kg', 'Stunde', 'lot', 'pc', 'pauschal'].map(u => <option key={u}>{u}</option>)}
                              </select>
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input type="number" value={item.unitPrice}
                                onChange={e => updateRow(idx, 'unitPrice', e.target.value)}
                                style={{ width: '100%', border: '1px solid var(--card-border)', borderRadius: 4, padding: '4px 8px', background: 'var(--body-bg)', color: 'var(--body-text)', fontSize: 13, fontFamily: 'inherit' }}
                                min="0" step="any" />
                            </td>
                            <td style={{ padding: '6px 8px', fontWeight: 700, color: lineTotal > 0 ? 'var(--header-text)' : 'var(--body-text-muted)' }}>
                              € {fmtCurrency(lineTotal)}
                            </td>
                            <td style={{ padding: '6px 4px' }}>
                              <button onClick={() => removeRow(idx)}
                                style={{ background: 'none', border: 'none', color: '#f1416c', cursor: 'pointer', padding: 4 }}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.dropZone}>
                    <div className={styles.dropZoneEmpty}>
                      <List size={24} color="#a1a5b7" />
                      <p style={{ color: 'var(--body-text-muted)', fontSize: 13, margin: '8px 0 0' }}>
                        Noch keine Positionen. KI nutzen oder manuell hinzufügen.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Summary ── computed inline, always fresh ── */}
              <div className={styles.summarySection}>
                <div className={styles.summaryRow}>
                  <span style={{ color: 'var(--body-text-muted)' }}>Netto-Gesamt:</span>
                  <span style={{ fontWeight: 700, color: 'var(--header-text)' }}>
                    € {fmtCurrency(currentNetTotal)}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span style={{ color: 'var(--body-text-muted)' }}>
                    {vatExempt ? 'USt. (§13b, 0%):' : 'USt. (19%):'}
                  </span>
                  <span style={{ color: 'var(--body-text-muted)' }}>
                    € {fmtCurrency(currentVat)}
                  </span>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span style={{ fontWeight: 700 }}>Brutto-Gesamt:</span>
                  <span style={{ fontWeight: 700, color: '#10b981', fontSize: 16 }}>
                    € {fmtCurrency(currentGrossTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className="btn"
                style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--body-text)' }}
                onClick={() => setShowModal(false)}>
                Abbrechen
              </button>
              <button className="btn"
                style={{ background: 'var(--body-bg)', border: '1px solid var(--card-border)', marginLeft: 'auto', color: 'var(--body-text)' }}
                onClick={() => handleSave('DRAFT')} disabled={saving}>
                <Save size={16} style={{ marginRight: 6 }} /> Entwurf speichern
              </button>
              <button className="btn btn-primary"
                style={{ backgroundColor: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
                onClick={() => handleSave('SENT')} disabled={saving}>
                <Send size={16} style={{ marginRight: 6 }} /> Erstellen &amp; Senden
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function OffersQuotes() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Lade Angebote...</div>}>
      <OffersQuotesContent />
    </Suspense>
  );
}
