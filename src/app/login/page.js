"use client";
import React, { useState } from 'react';
import { Building2, User, Users, Lock, ChevronDown, LogIn } from 'lucide-react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('Manager');
  const [company, setCompany] = useState('Electrical Works Southern Germany');

  const roleRoutes = {
    'Administrator': '/admin/dashboard',
    'Admin': '/admin/dashboard',
    'Manager': '/manager/dashboard',
    'Sales Staff': '/sales/dashboard',
    'Sales': '/sales/dashboard',
    'Crew / Worker': '/crew/dashboard',
    'Crew': '/crew/dashboard',
    'Accountant / Finance': '/finance/actual-costs',
    'Finance': '/finance/actual-costs'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const route = roleRoutes[role] || '/manager/dashboard';
    router.push(route);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <Building2 size={32} color="white" />
          </div>
          <h1>ProCRM</h1>
          <p>Southern Germany Works — Unified Management System</p>
        </div>

        <div className={styles.quickAccess}>
          <p className={styles.dividerText}>QUICK ACCESS BY ROLE</p>
          <div className={styles.roleGrid}>
            <button className={`${styles.roleBtn} ${role === 'Administrator' ? styles.roleBtnActive : ''}`} type="button" onClick={() => setRole('Administrator')}>
              <div className={styles.roleIcon} style={role === 'Administrator' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span>Admin</span>
            </button>
            <button className={`${styles.roleBtn} ${role === 'Manager' ? styles.roleBtnActive : ''}`} type="button" onClick={() => setRole('Manager')}>
              <div className={styles.roleIcon} style={role === 'Manager' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <Users size={20} />
              </div>
              <span>Manager</span>
            </button>
            <button className={`${styles.roleBtn} ${role === 'Sales Staff' ? styles.roleBtnActive : ''}`} type="button" onClick={() => setRole('Sales Staff')}>
              <div className={styles.roleIcon} style={role === 'Sales Staff' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span>Sales</span>
            </button>
            <button className={`${styles.roleBtn} ${role === 'Crew / Worker' ? styles.roleBtnActive : ''}`} type="button" onClick={() => setRole('Crew / Worker')}>
              <div className={styles.roleIcon} style={role === 'Crew / Worker' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <Users size={20} />
              </div>
              <span>Crew</span>
            </button>
            <button className={`${styles.roleBtn} ${role === 'Accountant / Finance' ? styles.roleBtnActive : ''}`} type="button" onClick={() => setRole('Accountant / Finance')}>
              <div className={styles.roleIcon} style={role === 'Accountant / Finance' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <span>Finance</span>
            </button>
          </div>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <p className={styles.dividerText}>OR LOGIN WITH CREDENTIALS</p>
          
          <div className={styles.inputGroup}>
            <label>Select Company</label>
            <div className={styles.inputWrapper}>
              <Building2 size={16} className={styles.inputIcon} color="#f1416c" />
              <select className={styles.selectInput} value={company} onChange={(e) => setCompany(e.target.value)}>
                <option value="Electrical Works Southern Germany">Electrical Works Southern Germany</option>
                <option value="Heating Works Southern Germany">Heating Works Southern Germany</option>
                <option value="Screed Works Southern Germany">Screed Works Southern Germany</option>
              </select>
              <ChevronDown size={16} className={styles.dropdownIcon} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Username</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input type="text" placeholder="Enter your username" className={styles.textInput} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input type="password" placeholder="Enter your password" defaultValue="password" className={styles.textInput} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Role</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>—</span>
              <select className={styles.selectInput} value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Sales Staff">Sales Staff</option>
                <option value="Crew / Worker">Crew / Worker</option>
                <option value="Accountant / Finance">Accountant / Finance</option>
              </select>
              <ChevronDown size={16} className={styles.dropdownIcon} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <LogIn size={18} /> Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
