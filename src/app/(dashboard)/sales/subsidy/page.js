"use client";
import React from 'react';
import Header from '@/components/layout/Header';
import { Calculator, Check, Building, Landmark, MapPin, Zap } from 'lucide-react';
import styles from './page.module.css';

export default function SubsidyCalculator() {
  return (
    <>
      <Header title="Subsidy Calculator" subtitle="Sales | Subsidy Calculator" />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.description}>Automatically calculate subsidies for heating and electrical offers.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Form Side */}
          <div className="card">
            <div className={styles.cardHeader}>
              <Calculator size={18} color="#009ef7" /> Project Parameters
            </div>
            <div className={styles.cardBody}>
              <div className={styles.formGroup}>
                <label>Project Type *</label>
                <select className={styles.input}>
                  <option>Select type...</option>
                  <option>Heat Pump Installation</option>
                  <option>Solar Photovoltaic</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Building Type</label>
                  <select className={styles.input}>
                    <option>Residential (Single)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Construction Year</label>
                  <input type="number" defaultValue="1985" className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Total Project Value (€)</label>
                  <input type="number" defaultValue="48200" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Heated Area (m²)</label>
                  <input type="number" defaultValue="320" className={styles.input} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Energy Efficiency Rating</label>
                  <select className={styles.input}>
                    <option>Below E (eligible)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Customer Type</label>
                  <select className={styles.input}>
                    <option>Private Homeowner</option>
                  </select>
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.checkboxCustom}></span>
                  Apply BAFA Federal Subsidy
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked />
                  <span className={styles.checkboxCustom}></span>
                  Apply KfW Funding (loan)
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span className={styles.checkboxCustom}></span>
                  Apply State (Bavaria) Subsidy
                </label>
              </div>

              <button className={`btn btn-primary ${styles.calcBtn}`}>
                <Calculator size={16} style={{ marginRight: '8px' }} /> Calculate All Subsidies
              </button>
            </div>
          </div>

          {/* Info Side */}
          <div className={styles.infoCol}>
            <div className={`${styles.infoCard} ${styles.infoBafa}`}>
              <div className={styles.infoIcon}><Building size={20} /></div>
              <div className={styles.infoContent}>
                <h4>BAFA — Federal Office</h4>
                <p>Up to 25% for heat pumps, up to 35% with bonus. Min project value € 3,000.</p>
              </div>
            </div>

            <div className={`${styles.infoCard} ${styles.infoKfw}`}>
              <div className={styles.infoIcon}><Landmark size={20} /></div>
              <div className={styles.infoContent}>
                <h4>KfW — Federal Bank</h4>
                <p>Subsidized loans from 1.99% p.a. Up to € 150,000 for energy-efficient renovation.</p>
              </div>
            </div>

            <div className={`${styles.infoCard} ${styles.infoState}`}>
              <div className={styles.infoIcon}><MapPin size={20} /></div>
              <div className={styles.infoContent}>
                <h4>Bavaria State Subsidy</h4>
                <p>Additional 10% for Bavarian homeowners. Combined max 55% of eligible costs.</p>
              </div>
            </div>

            <div className={`${styles.infoCard} ${styles.infoBonus}`}>
              <div className={styles.infoIcon}><Zap size={20} /></div>
              <div className={styles.infoContent}>
                <h4>Energy Bonus (+5%)</h4>
                <p>Extra 5% if replacing fossil fuel heater. Auto-applied for qualifying projects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
