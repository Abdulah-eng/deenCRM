'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Calculator, CheckCircle, Save, RotateCcw, Building, Landmark, MapPin, Zap } from 'lucide-react';
import styles from './page.module.css';

export default function SubsidyCalculatorPage() {
  const [formData, setFormData] = useState({
    projectType: '',
    buildingType: 'Residential (Single)',
    constructionYear: '1985',
    projectValue: '48200',
    heatedArea: '320',
    efficiencyRating: 'Below E (eligible)',
    customerType: 'Private Homeowner',
    applyBafa: true,
    applyKfw: true,
    applyState: false
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateSubsidy = (e) => {
    if (e) e.preventDefault();
    
    const cost = parseFloat(formData.projectValue) || 0;
    if (cost <= 0) {
      alert('Please enter a valid project value.');
      return;
    }
    if (!formData.projectType) {
      alert('Please select a project type.');
      return;
    }

    let baseRate = 0;
    switch (formData.projectType) {
      case 'Heat Pump': baseRate = 0.25; break;
      case 'Solar Thermal': baseRate = 0.25; break;
      case 'PV System': baseRate = 0.20; break;
      case 'EV Charger': baseRate = 0.15; break;
      default: baseRate = 0.10;
    }

    let bonusRate = 0;
    // Energy Bonus (+5%): Replacing old fossil heater + eligible rating
    if (formData.efficiencyRating === 'Below E (eligible)' && (formData.projectType === 'Heat Pump' || formData.projectType === 'Solar Thermal')) {
      bonusRate += 0.05;
    }
    
    // Bavaria State Subsidy: if checked, add 10%
    if (formData.applyState) {
      bonusRate += 0.10;
    }

    const totalRate = Math.min(baseRate + bonusRate, 0.55); // Cap at 55% combined rate
    
    let subsidyAmount = 0;
    if (formData.applyBafa) {
      if (cost >= 3000) {
        subsidyAmount = cost * totalRate;
        // Cap BAFA at 30000
        if (subsidyAmount > 30000) subsidyAmount = 30000;
      }
    }

    let kfwLoan = 0;
    if (formData.applyKfw) {
      kfwLoan = Math.min(cost, 150000);
    }

    const customerPays = cost - subsidyAmount;

    setResults({
      subsidyRate: (totalRate * 100).toFixed(0),
      estimatedSubsidy: subsidyAmount,
      kfwLoan: kfwLoan,
      customerPays: customerPays,
      cost: cost
    });
  };

  const resetForm = () => {
    setFormData({
      projectType: '',
      buildingType: 'Residential (Single)',
      constructionYear: '1985',
      projectValue: '48200',
      heatedArea: '320',
      efficiencyRating: 'Below E (eligible)',
      customerType: 'Private Homeowner',
      applyBafa: true,
      applyKfw: true,
      applyState: false
    });
    setResults(null);
  };

  const saveToOrder = () => {
    alert('Subsidy calculation saved!');
  };

  return (
    <div className={styles.container}>
      <Header title="Förderungsrechner" subtitle="Vertrieb | Förderungsrechner" />

      {/* Header welcome section matching standard Sales view */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcome}>
          <h2>Subsidy Calculator</h2>
          <p>Automatically calculate subsidies for heating and electrical offers.</p>
        </div>
        <button className={styles.headerBtn} onClick={() => calculateSubsidy()}>
          <Calculator size={16} /> Calculate Subsidies
        </button>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Side Box - Project Parameters Form */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Calculator size={20} color="#10b981" />
            Project Parameters
          </h3>
          
          <form onSubmit={calculateSubsidy} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Project Type *</label>
              <select 
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Select type...</option>
                <option value="Heat Pump">Heat Pump (Heating)</option>
                <option value="Solar Thermal">Solar Thermal (Heating)</option>
                <option value="PV System">PV System (Electrical)</option>
                <option value="EV Charger">EV Charger (Electrical)</option>
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Building Type</label>
                <select 
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="Residential (Single)">Residential (Single)</option>
                  <option value="Residential (Multi)">Residential (Multi)</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Construction Year</label>
                <input 
                  type="text" 
                  name="constructionYear"
                  value={formData.constructionYear}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Total Project Value (€)</label>
                <input 
                  type="number" 
                  name="projectValue"
                  value={formData.projectValue}
                  onChange={handleInputChange}
                  className={styles.input}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Heated Area (m²)</label>
                <input 
                  type="number" 
                  name="heatedArea"
                  value={formData.heatedArea}
                  onChange={handleInputChange}
                  className={styles.input}
                  min="0"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Energy Efficiency Rating</label>
                <select 
                  name="efficiencyRating"
                  value={formData.efficiencyRating}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="Below E (eligible)">Below E (eligible)</option>
                  <option value="E or above">E or above</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Customer Type</label>
                <select 
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="Private Homeowner">Private Homeowner</option>
                  <option value="Business / Commercial">Business / Commercial</option>
                </select>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="applyBafa"
                  checked={formData.applyBafa}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Apply BAFA Federal Subsidy
              </label>

              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="applyKfw"
                  checked={formData.applyKfw}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Apply KfW Funding (loan)
              </label>

              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  name="applyState"
                  checked={formData.applyState}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Apply State (Bavaria) Subsidy
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <button type="submit" className={styles.calculateBtn}>
                <Calculator size={18} /> Calculate All Subsidies
              </button>
              <button 
                type="button"
                onClick={resetForm}
                style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--body-text)', fontSize: '15px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </form>

          {/* Results section rendered dynamically inside the parameters container */}
          {results && (
            <div className={styles.resultsSection}>
              <h3 className={styles.cardTitle} style={{ color: '#10b981', borderTop: '1px dashed var(--card-border)', paddingTop: '24px', marginTop: 0 }}>
                <CheckCircle size={20} />
                Calculation Results
              </h3>
              
              <div className={styles.resultsCard}>
                <div className={styles.resultRow}>
                  <span>Total Project Cost</span>
                  <span className={styles.resultValue}>€ {results.cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                
                <div className={styles.resultRow}>
                  <span>Eligible Subsidy Rate</span>
                  <span className={styles.resultRateBadge}>{results.subsidyRate}%</span>
                </div>
                
                {formData.applyKfw && (
                  <div className={styles.resultRow}>
                    <span>KfW Subsidized Loan</span>
                    <span className={styles.resultValue} style={{ color: '#3b82f6' }}>€ {results.kfwLoan.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                )}
                
                <div className={styles.resultTotalRow}>
                  <span>Estimated Subsidy Amount</span>
                  <span className={styles.resultTotalValue}>€ {results.estimatedSubsidy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                
                <div className={styles.resultTotalRow} style={{ borderTop: 'none', paddingTop: 0, marginTop: 10 }}>
                  <span style={{ fontWeight: '600' }}>Customer Pays (Net)</span>
                  <span style={{ fontSize: '20px', color: 'var(--header-text)' }}>€ {results.customerPays.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className={styles.notesCard}>
                <h4 className={styles.notesTitle}>Eligibility Notes</h4>
                <ul className={styles.notesList}>
                  {results.estimatedSubsidy >= 30000 && <li>The subsidy amount has reached the maximum cap of €30,000.</li>}
                  <li>This is an estimate. Final approval is subject to BAFA verification.</li>
                  <li>Application must be submitted BEFORE ordering the system.</li>
                </ul>
              </div>

              <button onClick={saveToOrder} className={styles.saveBtn}>
                <Save size={18} /> Save to Order
              </button>
            </div>
          )}
        </div>

        {/* Right Side Stack - Information Cards */}
        <div className={styles.infoStack}>
          {/* Card 1 */}
          <div className={styles.infoCard} style={{ backgroundColor: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <div className={styles.infoIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Building size={20} />
            </div>
            <div className={styles.infoDetails}>
              <h4 style={{ color: '#065f46' }}>BAFA — Federal Office</h4>
              <p style={{ color: '#047857' }}>Up to 25% for heat pumps, up to 35% with bonus. Min project value € 3,000.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.infoCard} style={{ backgroundColor: 'rgba(59, 130, 246, 0.04)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
            <div className={styles.infoIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Landmark size={20} />
            </div>
            <div className={styles.infoDetails}>
              <h4 style={{ color: '#1e3a8a' }}>KfW — Federal Bank</h4>
              <p style={{ color: '#1d4ed8' }}>Subsidized loans from 1.99% p.a. Up to € 150,000 for energy-efficient renovation.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className={styles.infoCard} style={{ backgroundColor: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
            <div className={styles.infoIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <MapPin size={20} />
            </div>
            <div className={styles.infoDetails}>
              <h4 style={{ color: '#78350f' }}>Bavaria State Subsidy</h4>
              <p style={{ color: '#b45309' }}>Additional 10% for Bavarian homeowners. Combined max 55% of eligible costs.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className={styles.infoCard} style={{ backgroundColor: 'rgba(139, 92, 246, 0.04)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
            <div className={styles.infoIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Zap size={20} />
            </div>
            <div className={styles.infoDetails}>
              <h4 style={{ color: '#4c1d95' }}>Energy Bonus (+5%)</h4>
              <p style={{ color: '#6d28d9' }}>Extra 5% if replacing fossil fuel heater. Auto-applied for qualifying projects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
