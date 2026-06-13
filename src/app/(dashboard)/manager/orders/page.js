"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Search, Plus, Eye, Edit3, Trash2, MapPin, Download, X, ClipboardList, Wand2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

const STATUS_COLORS = {
  'IN PROGRESS': { bg: 'rgba(0,158,247,0.12)', color: '#009ef7' },
  'SCHEDULED':   { bg: 'rgba(114,57,234,0.12)', color: '#7239ea' },
  'COMPLETED':   { bg: 'rgba(80,205,137,0.12)', color: '#50cd89' },
  'DELAYED':     { bg: 'rgba(241,65,108,0.12)',  color: '#f1416c' },
  'NEW':         { bg: 'rgba(255,199,0,0.12)',   color: '#ffc700' },
};

const TYPE_COLORS = {
  'SCREED':     { bg: 'rgba(255,199,0,0.12)',   color: '#d16b11' },
  'HEATING':    { bg: 'rgba(241,65,108,0.12)',  color: '#f1416c' },
  'ELECTRICAL': { bg: 'rgba(0,158,247,0.12)',   color: '#009ef7' },
};

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Alle Typen');
  const [statusFilter, setStatusFilter] = useState('Alle Status');
  const [showModal, setShowModal] = useState(false);
  
  // Modal State
  const [modalOrderType, setModalOrderType] = useState('Screed');
  const [subTasks, setSubTasks] = useState([]);
  
  // AI Parsing State
  const [isParsing, setIsParsing] = useState(false);
  const [formCustomer, setFormCustomer] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formValue, setFormValue] = useState('0.00');
  const [formNotes, setFormNotes] = useState('');

  // Dropdown & Form Details States
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCrew, setSelectedCrew] = useState('');
  const [formArea, setFormArea] = useState('0');
  const [formAssemblyHeight, setFormAssemblyHeight] = useState('0');
  const [formSystemType, setFormSystemType] = useState('Fußbodenheizung');
  const [formPipeLength, setFormPipeLength] = useState('0');
  const [formCircuits, setFormCircuits] = useState('0');
  const [formConnectionPower, setFormConnectionPower] = useState('0');
  const [formScheduledDate, setFormScheduledDate] = useState('');
  const [dbCustomers, setDbCustomers] = useState([]);
  const [dbCompanies, setDbCompanies] = useState([]);
  const [dbCrews, setDbCrews] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      // 1. Fetch orders
      const { data: ordData, error } = await supabase
        .from('orders')
        .select('*, customers(name), crews(name)')
        .order('created_at', { ascending: false });
      if (!error && ordData) setOrders(ordData);

      // 2. Fetch customers
      const { data: custData } = await supabase.from('customers').select('id, name');
      if (custData) setDbCustomers(custData);

      // 3. Fetch companies
      const { data: compData } = await supabase.from('companies').select('id, name');
      if (compData) {
        setDbCompanies(compData);
        if (compData.length > 0) setSelectedCompany(compData[0].id);
      }

      // 4. Fetch crews
      const { data: crewData } = await supabase.from('crews').select('id, name');
      if (crewData) setDbCrews(crewData);

      setLoading(false);
    }
    fetchInitialData();
  }, []);

  const addSubTask = () => {
    setSubTasks([...subTasks, { id: Date.now(), name: '', assignee: 'Team A', status: 'Pending' }]);
  };

  const updateSubTask = (id, field, value) => {
    setSubTasks(subTasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeSubTask = (id) => {
    setSubTasks(subTasks.filter(t => t.id !== id));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/parse-order', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        setFormCustomer(data.customerName || '');
        setFormAddress(data.customerAddress || '');
        setFormValue(data.total || '0.00');
        
        if (data.items && data.items.length > 0) {
          const newTasks = data.items.map((item, idx) => ({
            id: Date.now() + idx,
            name: item.description,
            quantity: item.quantity || 0,
            assignee: 'Team A',
            status: 'Offen'
          }));
          setSubTasks(newTasks);
          setFormNotes("Positionen wurden automatisch als Teilaufgaben angelegt.");
        }
        
      } else {
        const msg = res.status === 503
          ? '⏳ KI-Dienst ist vorübergehend überlastet. Bitte in 30 Sekunden erneut versuchen.'
          : 'Fehler beim Verarbeiten des PDFs: ' + (data.error || 'Unbekannter Fehler');
        alert(msg);
      }
    } catch (error) {
      console.error(error);
      alert("Fehler beim Analysieren des PDFs.");
    }
    setIsParsing(false);
  };

  const handleSaveOrder = async () => {
    if (!formCustomer || !selectedCompany) {
      alert("Bitte Kundenname und Unternehmen eingeben.");
      return;
    }
    setSaving(true);
    try {
      // 1. Resolve customer
      let customerId;
      const existingCustomer = dbCustomers.find(c => c.name.toLowerCase() === formCustomer.trim().toLowerCase());
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCust, error: custErr } = await supabase
          .from('customers')
          .insert([{ name: formCustomer.trim() }])
          .select();
        if (custErr) throw custErr;
        customerId = newCust[0].id;
      }

      // 2. Generate display ID
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const displayId = `ORD-2026-${randomDigits}`;

      // 3. Prepare order type and database fields
      const orderType = modalOrderType.toUpperCase(); // SCREED, HEATING, ELECTRICAL
      const rev = Number(formValue) || 0;
      const planDb = rev * 0.25;

      const orderData = {
        display_id: displayId,
        customer_id: customerId,
        company_id: selectedCompany,
        type: orderType,
        crew_id: selectedCrew || null,
        location: formAddress || 'München',
        area: Number(formArea) || 0,
        assembly_height: modalOrderType === 'Screed' ? (Number(formAssemblyHeight) || null) : null,
        system_type: modalOrderType === 'Heating' ? formSystemType : null,
        pipe_length: modalOrderType === 'Heating' ? (Number(formPipeLength) || null) : null,
        circuits: modalOrderType === 'Electrical' ? (Number(formCircuits) || null) : null,
        connection_power: modalOrderType === 'Electrical' ? (Number(formConnectionPower) || null) : null,
        revenue: rev,
        plan_db: planDb,
        actual_db: planDb,
        status: formScheduledDate ? 'SCHEDULED' : 'NEW',
        scheduled_date: formScheduledDate || null,
        description: formNotes || null
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (error) throw error;
      const createdOrderId = data[0].id;

      // 4. Save order positions (subTasks)
      if (subTasks.length > 0) {
        const positionsToInsert = subTasks.map(t => ({
          order_id: createdOrderId,
          description: t.name,
          quantity: t.quantity || 1,
          unit: 'm²'
        }));
        await supabase.from('order_positions').insert(positionsToInsert);
      }

      alert('Auftrag erfolgreich erstellt!');
      setShowModal(false);
      
      // Refresh list
      const { data: refOrders } = await supabase
        .from('orders')
        .select('*, customers(name), crews(name)')
        .order('created_at', { ascending: false });
      if (refOrders) setOrders(refOrders);

      // Reset form states
      setFormCustomer('');
      setFormAddress('');
      setFormValue('0.00');
      setFormNotes('');
      setFormArea('0');
      setFormAssemblyHeight('0');
      setFormPipeLength('0');
      setFormCircuits('0');
      setFormConnectionPower('0');
      setFormScheduledDate('');
    } catch (err) {
      console.error(err);
      alert("Fehler beim Erstellen des Auftrags: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm("Möchten Sie diesen Auftrag wirklich löschen?")) {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) {
        alert("Fehler beim Löschen des Auftrags: " + error.message);
      } else {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      }
    }
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      alert("Keine Aufträge zum Exportieren vorhanden.");
      return;
    }
    
    // Create CSV content
    const headers = ["Auftrag #", "Kunde", "Typ", "Team", "Ort", "Flaeche (m2)", "Umsatz (EUR)", "Plan-DB (EUR)", "Ist-DB (EUR)", "Status", "Datum"];
    const csvRows = [
      headers.join(","), // header row
      ...filtered.map(o => [
        `"${o.display_id || ''}"`,
        `"${o.customers?.name || 'Unbekannt'}"`,
        `"${o.type || ''}"`,
        `"${o.crews?.name || 'Nicht zugewiesen'}"`,
        `"${o.location || ''}"`,
        `"${o.area || ''}"`,
        `"${o.revenue || ''}"`,
        `"${o.plan_db || ''}"`,
        `"${o.actual_db || ''}"`,
        `"${o.status || ''}"`,
        `"${o.scheduled_date || ''}"`
      ].join(","))
    ];
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `auftraege_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = orders.filter(o => {
    const custName = o.customers?.name || '';
    const matchSearch = custName.toLowerCase().includes(search.toLowerCase()) || o.display_id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Alle Typen' || o.type === typeFilter;
    const matchStatus = statusFilter === 'Alle Status' || o.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const formatCurrency = (val) => val ? `€ ${Number(val).toLocaleString('de-DE')}` : '—';
  const formatArea = (val) => val ? `${val} m²` : '—';

  return (
    <>
      <Header title="Alle Aufträge" subtitle="Alle Aufträge" />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <p className={styles.desc}>Verfolgen Sie alle Aufträge über Unternehmen hinweg mit wichtigen Finanzkennzahlen.</p>
          <button className={`btn btn-primary ${styles.newBtn}`} onClick={() => setShowModal(true)}>
            <Plus size={15} style={{ marginRight: 6 }} /> Neuer Auftrag
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.searchBox}>
            <Search size={14} color="#a1a5b7" />
            <input
              type="text"
              placeholder="Aufträge suchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option>Alle Typen</option>
            <option value="SCREED">ESTRICH</option>
            <option value="HEATING">HEIZUNG</option>
            <option value="ELECTRICAL">ELEKTRO</option>
          </select>
          <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>Alle Status</option>
            <option value="IN PROGRESS">IN ARBEIT</option>
            <option value="SCHEDULED">GEPLANT</option>
            <option value="COMPLETED">ABGESCHLOSSEN</option>
            <option value="DELAYED">VERSPÄTET</option>
            <option value="NEW">NEU</option>
          </select>
          <input type="date" className={styles.filterSelect} />
          <button className={styles.exportBtn} onClick={handleExport}>
            <Download size={14} style={{ marginRight: 6 }} /> Exportieren
          </button>
        </div>

        <div className="card">
          <div className={styles.tableTitle}>
            <span>Alle Aufträge ({filtered.length})</span>
          </div>
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--body-text-muted)' }}>Aufträge werden geladen...</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>AUFTRAG #</th>
                    <th>KUNDE</th>
                    <th>TYP</th>
                    <th>TEAM</th>
                    <th>ORT</th>
                    <th>FLÄCHE</th>
                    <th>UMSATZ</th>
                    <th>PLAN-DB</th>
                    <th>IST-DB</th>
                    <th>STATUS</th>
                    <th>DATUM</th>
                    <th>AKTIONEN</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>Keine Aufträge gefunden.</td></tr>
                  )}
                  {filtered.map((o) => {
                    const sc = STATUS_COLORS[o.status] || { bg: '#eee', color: '#666' };
                    const tc = TYPE_COLORS[o.type] || { bg: '#eee', color: '#666' };
                    
                    const statusLabelMap = {
                      'IN PROGRESS': 'IN ARBEIT',
                      'SCHEDULED': 'GEPLANT',
                      'COMPLETED': 'ABGESCHLOSSEN',
                      'DELAYED': 'VERSPÄTET',
                      'NEW': 'NEU'
                    };
                    const typeLabelMap = {
                      'SCREED': 'ESTRICH',
                      'HEATING': 'HEIZUNG',
                      'ELECTRICAL': 'ELEKTRO'
                    };

                    return (
                      <tr key={o.id}>
                        <td>
                          <a className={styles.orderId}>{o.display_id}</a>
                        </td>
                        <td><strong className={styles.customer}>{o.customers?.name || 'Unbekannt'}</strong></td>
                        <td>
                          <span className={styles.typeBadge} style={{ backgroundColor: tc.bg, color: tc.color }}>
                            {typeLabelMap[o.type] || o.type}
                          </span>
                        </td>
                        <td><span className={styles.crew}>{o.crews?.name || 'Nicht zugewiesen'}</span></td>
                        <td>
                          <span className={styles.location}>
                            <MapPin size={12} /> {o.location}
                          </span>
                        </td>
                        <td>{formatArea(o.area)}</td>
                        <td><strong className={styles.revenue}>{formatCurrency(o.revenue)}</strong></td>
                        <td>{formatCurrency(o.plan_db)}</td>
                        <td>{formatCurrency(o.actual_db)}</td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: sc.bg, color: sc.color }}>
                            {statusLabelMap[o.status] || o.status}
                          </span>
                        </td>
                        <td><span className={styles.date}>{o.scheduled_date || '—'}</span></td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} onClick={() => setSelectedOrder(o)} title="Details"><Eye size={13} color="#009ef7" /></button>
                            <button className={styles.actionBtn} onClick={() => handleDeleteOrder(o.id)} title="Löschen"><Trash2 size={13} color="#f1416c" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create New Order Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h3><ClipboardList size={16} style={{ marginRight: 8 }} />Neuen Auftrag erstellen</h3>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              
              {/* AI PDF Upload Feature */}
              <div style={{ backgroundColor: 'rgba(114,57,234,0.05)', padding: '16px', borderRadius: '8px', border: '1px dashed #7239ea', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', color: '#7239ea' }}>
                  <Wand2 size={16} style={{ marginRight: 8 }} /> KI-Auto-Ausfüllung aus PDF
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#5e6278' }}>
                  Laden Sie die PDF- oder Excel-Bestellung des Kunden hoch. Unsere Gemini-KI extrahiert sofort den Kunden, die Adresse und die Positionen, um das Formular vorauszufüllen!
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="file" accept="application/pdf, .xlsx, .xls" onChange={handleFileUpload} className={styles.formInput} style={{ flex: 1, cursor: 'pointer' }} disabled={isParsing} />
                  {isParsing && <span style={{ color: '#7239ea', fontSize: '13px', fontWeight: 500 }}>✨ Extrahiere Daten...</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Kundenname *</label>
                  <input type="text" placeholder="Kundenname" className={styles.formInput} value={formCustomer} onChange={e => setFormCustomer(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label>Unternehmen *</label>
                  <select className={styles.formInput} value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                    {dbCompanies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Auftragstyp</label>
                  <select className={styles.formInput} value={modalOrderType} onChange={e => setModalOrderType(e.target.value)}>
                    <option value="Screed">Estrich</option>
                    <option value="Heating">Heizung / Sanitär</option>
                    <option value="Electrical">Elektro</option>
                  </select>
                </div>
              </div>
              
              {/* Dynamic Job Details based on Order Type */}
              <div className={styles.sectionTitle}>Auftragsspezifische Details</div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Ort / Adresse</label>
                  <input type="text" placeholder="Adresse der Baustelle" className={styles.formInput} value={formAddress} onChange={e => setFormAddress(e.target.value)} />
                </div>
                {modalOrderType === 'Screed' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Fläche (m²)</label>
                      <input type="number" value={formArea} onChange={e => setFormArea(e.target.value)} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Aufbauhöhe (mm)</label>
                      <input type="number" value={formAssemblyHeight} onChange={e => setFormAssemblyHeight(e.target.value)} className={styles.formInput} />
                    </div>
                  </>
                )}
                {modalOrderType === 'Heating' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Systemtyp</label>
                      <select className={styles.formInput} value={formSystemType} onChange={e => setFormSystemType(e.target.value)}>
                        <option value="Fußbodenheizung">Fußbodenheizung</option>
                        <option value="Heizkörper">Heizkörper</option>
                        <option value="Wärmepumpe">Wärmepumpe</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Rohrlänge (m)</label>
                      <input type="number" value={formPipeLength} onChange={e => setFormPipeLength(e.target.value)} className={styles.formInput} />
                    </div>
                  </>
                )}
                {modalOrderType === 'Electrical' && (
                  <>
                    <div className={styles.formGroup}>
                      <label>Anzahl der Stromkreise</label>
                      <input type="number" value={formCircuits} onChange={e => setFormCircuits(e.target.value)} className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Anschlussleistung (kW)</label>
                      <input type="number" value={formConnectionPower} onChange={e => setFormConnectionPower(e.target.value)} className={styles.formInput} />
                    </div>
                  </>
                )}
              </div>

              <div className={styles.sectionTitle}>Planung & Finanzen</div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Primäres Team zuweisen</label>
                  <select className={styles.formInput} value={selectedCrew} onChange={e => setSelectedCrew(e.target.value)}>
                    <option value="">Nicht zugewiesen</option>
                    {dbCrews.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Geplantes Datum</label>
                  <input type="date" value={formScheduledDate} onChange={e => setFormScheduledDate(e.target.value)} className={styles.formInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Geschätzter Wert (€)</label>
                  <input type="number" className={styles.formInput} value={formValue} onChange={e => setFormValue(e.target.value)} />
                </div>
              </div>

              {/* Sub-tasks Section */}
              <div className={styles.sectionTitle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Teilaufgaben</span>
                <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addSubTask} style={{ padding: '4px 8px', fontSize: '11px' }}>
                  <Plus size={12} style={{ marginRight: 4 }} /> Aufgabe hinzufügen
                </button>
              </div>
              <div className={styles.subTasksList}>
                {subTasks.length === 0 && <p style={{ fontSize: '12px', color: 'var(--body-text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>Keine Teilaufgaben hinzugefügt. Dieser Auftrag wird als einzelne Aufgabe behandelt.</p>}
                {subTasks.map((task) => (
                  <div key={task.id} className={styles.subTaskRow} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Aufgabenbeschreibung..." 
                      className={styles.formInput} 
                      value={task.name} 
                      onChange={(e) => updateSubTask(task.id, 'name', e.target.value)} 
                      style={{ flex: 2 }}
                    />
                    <input 
                      type="number" 
                      placeholder="Menge" 
                      className={styles.formInput} 
                      value={task.quantity || ''} 
                      onChange={(e) => updateSubTask(task.id, 'quantity', e.target.value)} 
                      style={{ width: '80px' }}
                    />
                    <select 
                      className={styles.formInput} 
                      value={task.assignee} 
                      onChange={(e) => updateSubTask(task.id, 'assignee', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option>Team A</option><option>Team B</option><option>Team C</option><option>Team D</option>
                    </select>
                    <select 
                      className={styles.formInput} 
                      value={task.status} 
                      onChange={(e) => updateSubTask(task.id, 'status', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option>Offen</option><option>In Arbeit</option><option>Erledigt</option>
                    </select>
                    <button className={styles.actionBtn} onClick={() => removeSubTask(task.id)} style={{ padding: '6px' }}>
                      <Trash2 size={14} color="#f1416c" />
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label>Auftragsbeschreibung / Notizen</label>
                <textarea rows={4} className={styles.formTextarea} value={formNotes} onChange={e => setFormNotes(e.target.value)} />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={`btn ${styles.cancelBtn}`} onClick={() => setShowModal(false)}>Abbrechen</button>
              <button 
                className="btn btn-primary" 
                style={{ backgroundColor: '#7239ea' }}
                onClick={handleSaveOrder}
                disabled={saving}
              >
                {saving ? 'Erstelle...' : '✓ Auftrag erstellen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--card-border)', background: 'linear-gradient(135deg, rgba(114,57,234,0.06), rgba(114,57,234,0.02))' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--header-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardList size={18} color="#7239ea" /> Order Details - {selectedOrder.display_id || selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--body-text-muted)' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Customer</label>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--header-text)', marginTop: '4px' }}>{selectedOrder.customers?.name || 'Unbekannt'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Order Type</label>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--header-text)', marginTop: '4px' }}>{selectedOrder.type}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Assigned Crew</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedOrder.crews?.name || 'Nicht zugewiesen'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Status</label>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', backgroundColor: STATUS_COLORS[selectedOrder.status]?.bg || '#eee', color: STATUS_COLORS[selectedOrder.status]?.color || '#333' }}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Location</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedOrder.location || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Scheduled Date</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedOrder.scheduled_date || '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Area</label>
                  <div style={{ fontSize: '14px', color: 'var(--header-text)', marginTop: '4px' }}>{selectedOrder.area ? `${selectedOrder.area} m²` : '—'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Revenue</label>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>{selectedOrder.revenue ? `€ ${Number(selectedOrder.revenue).toLocaleString()}` : '—'}</div>
                </div>
              </div>
              {selectedOrder.description && (
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--body-text-muted)', textTransform: 'uppercase' }}>Notes / Description</label>
                  <div style={{ fontSize: '13px', color: 'var(--body-text)', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{selectedOrder.description}</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 24px', borderTop: '1px solid var(--card-border)', background: 'var(--body-bg)' }}>
              <button onClick={() => setSelectedOrder(null)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--body-text)', fontSize: '13px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
