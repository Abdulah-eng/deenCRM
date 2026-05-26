"use client";
import React, { useState } from 'react';
import { Building2, User, Users, Lock, LogIn, AlertCircle, ChevronDown } from 'lucide-react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('Electrical Works Southern Germany');
  const [role, setRole] = useState('Manager');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const roleRoutes = {
    'admin': '/admin/dashboard',
    'manager': '/manager/dashboard',
    'sales': '/sales/dashboard',
    'crew': '/crew/dashboard',
    'finance': '/finance/dashboard' // Changed from actual-costs to dashboard if we have it, else fallback
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Fetch user profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      const route = roleRoutes[profile.role] || '/manager/dashboard';
      router.push(route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (testEmail) => {
    setEmail(testEmail);
    setPassword('password123');
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
          <p className={styles.dividerText}>TEST ACCOUNTS (CLICK TO AUTO-FILL)</p>
          <div className={styles.roleGrid}>
            <button className={`${styles.roleBtn} ${email === 'admin@procrm.com' ? styles.roleBtnActive : ''}`} type="button" onClick={() => quickLogin('admin@procrm.com')}>
              <div className={styles.roleIcon} style={email === 'admin@procrm.com' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span>Admin</span>
            </button>
            <button className={`${styles.roleBtn} ${email === 'manager@procrm.com' ? styles.roleBtnActive : ''}`} type="button" onClick={() => quickLogin('manager@procrm.com')}>
              <div className={styles.roleIcon} style={email === 'manager@procrm.com' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <Users size={20} />
              </div>
              <span>Manager</span>
            </button>
            <button className={`${styles.roleBtn} ${email === 'sales@procrm.com' ? styles.roleBtnActive : ''}`} type="button" onClick={() => quickLogin('sales@procrm.com')}>
              <div className={styles.roleIcon} style={email === 'sales@procrm.com' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span>Sales</span>
            </button>
            <button className={`${styles.roleBtn} ${email === 'crew@procrm.com' ? styles.roleBtnActive : ''}`} type="button" onClick={() => quickLogin('crew@procrm.com')}>
              <div className={styles.roleIcon} style={email === 'crew@procrm.com' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <Users size={20} />
              </div>
              <span>Crew</span>
            </button>
            <button className={`${styles.roleBtn} ${email === 'finance@procrm.com' ? styles.roleBtnActive : ''}`} type="button" onClick={() => quickLogin('finance@procrm.com')}>
              <div className={styles.roleIcon} style={email === 'finance@procrm.com' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <span>Finance</span>
            </button>
          </div>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <p className={styles.dividerText}>OR LOGIN WITH CREDENTIALS</p>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(241,65,108,0.1)', color: '#f1416c', padding: '12px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

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
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={styles.textInput} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="Enter your password" 
                className={styles.textInput} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In to Dashboard</>}
          </button>
        </form>
      </div>
    </div>
  );
}
