'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Calculator, CheckCircle, Save, RotateCcw } from 'lucide-react';

export default function SubsidyCalculatorPage() {
  const [formData, setFormData] = useState({
    customerName: '',
    orderType: '',
    eligibleSystem: '',
    installationCost: '',
    energyClass: '',
    isReplacement: false,
    buildingType: ''
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
    e.preventDefault();
    
    const cost = parseFloat(formData.installationCost) || 0;
    if (cost <= 0) {
      alert('Please enter a valid installation cost.');
      return;
    }
    if (!formData.eligibleSystem) {
      alert('Please select an eligible system.');
      return;
    }

    let baseRate = 0;
    switch (formData.eligibleSystem) {
      case 'Heat Pump': baseRate = 0.30; break;
      case 'Solar Thermal': baseRate = 0.25; break;
      case 'PV System': baseRate = 0.20; break;
      case 'EV Charger': baseRate = 0.15; break;
    }

    let bonusRate = 0;
    if (formData.isReplacement) bonusRate += 0.05;
    if (formData.energyClass === 'A++' || formData.energyClass === 'A+') bonusRate += 0.05;
    if (formData.buildingType === 'Residential') bonusRate += 0.05;

    const totalRate = baseRate + bonusRate;
    let subsidyAmount = cost * totalRate;
    
    // Cap at €15,000 max
    if (subsidyAmount > 15000) {
      subsidyAmount = 15000;
    }

    const customerPays = cost - subsidyAmount;

    setResults({
      subsidyRate: (totalRate * 100).toFixed(0),
      estimatedSubsidy: subsidyAmount,
      customerPays: customerPays,
      cost: cost
    });
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      orderType: '',
      eligibleSystem: '',
      installationCost: '',
      energyClass: '',
      isReplacement: false,
      buildingType: ''
    });
    setResults(null);
  };

  const saveToOrder = () => {
    alert('Subsidy calculation saved!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header title="Subsidy Calculator" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
        {/* Form Card */}
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={24} color="#1a73e8" />
            BAFA Subsidy Parameters
          </h2>
          
          <form onSubmit={calculateSubsidy} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>Customer Name</label>
              <input 
                type="text" 
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>Order Type</label>
                <select 
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white' }}
                >
                  <option value="">Select Type</option>
                  <option value="Heating">Heating</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>Eligible System</label>
                <select 
                  name="eligibleSystem"
                  value={formData.eligibleSystem}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white' }}
                >
                  <option value="">Select System</option>
                  <option value="Heat Pump">Heat Pump</option>
                  <option value="Solar Thermal">Solar Thermal</option>
                  <option value="PV System">PV System</option>
                  <option value="EV Charger">EV Charger</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>Installation Cost (€)</label>
              <input 
                type="number" 
                name="installationCost"
                value={formData.installationCost}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                min="0"
                step="0.01"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>Energy Efficiency Class</label>
                <select 
                  name="energyClass"
                  value={formData.energyClass}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white' }}
                >
                  <option value="">Select Class</option>
                  <option value="A++">A++</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px', color: '#333' }}>Building Type</label>
                <select 
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: 'white' }}
                >
                  <option value="">Select Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <input 
                type="checkbox" 
                id="isReplacement"
                name="isReplacement"
                checked={formData.isReplacement}
                onChange={handleInputChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="isReplacement" style={{ fontSize: '15px', cursor: 'pointer', color: '#333' }}>
                Replacing old fossil fuel heating system? (+5% bonus)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button 
                type="submit"
                style={{ flex: 1, padding: '12px', borderRadius: '6px', border: 'none', background: '#1a73e8', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Calculate Subsidy
              </button>
              <button 
                type="button"
                onClick={resetForm}
                style={{ padding: '12px 24px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f9fa', color: '#333', fontSize: '16px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Card */}
        <div style={{ backgroundColor: '#f8fafd', padding: '32px', borderRadius: '12px', border: '1px solid #e1ebfa', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a73e8' }}>
            <CheckCircle size={24} />
            Calculation Results
          </h2>
          
          {results ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                  <span style={{ color: '#5f6368', fontSize: '16px' }}>Total Project Cost</span>
                  <span style={{ fontSize: '18px', fontWeight: '500' }}>€{results.cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                  <span style={{ color: '#5f6368', fontSize: '16px' }}>Eligible Subsidy Rate</span>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '4px 12px', borderRadius: '16px' }}>{results.subsidyRate}%</span>
                </div>
                
                <div style={{ borderTop: '1px dashed #ccc', margin: '20px 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                  <span style={{ color: '#333', fontSize: '16px', fontWeight: '500' }}>Estimated Subsidy Amount</span>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#1e8e3e' }}>€{results.estimatedSubsidy.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#333', fontSize: '16px', fontWeight: '500' }}>Customer Pays (Net)</span>
                  <span style={{ fontSize: '24px', fontWeight: '700' }}>€{results.customerPays.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff8e1', padding: '16px', borderRadius: '8px', border: '1px solid #ffecb3', marginBottom: 'auto' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#b08d00', fontSize: '14px' }}>Eligibility Notes</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#5c4d06', fontSize: '13px', lineHeight: '1.5' }}>
                  {results.estimatedSubsidy >= 15000 && <li>The subsidy amount has reached the maximum cap of €15,000.</li>}
                  <li>This is an estimate. Final approval is subject to BAFA verification.</li>
                  <li>Application must be submitted BEFORE ordering the system.</li>
                </ul>
              </div>

              <button 
                onClick={saveToOrder}
                style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '6px', border: 'none', background: '#34a853', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
              >
                <Save size={20} /> Save to Order
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontStyle: 'italic', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #ccc' }}>
              Fill in the parameters and calculate to see results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
