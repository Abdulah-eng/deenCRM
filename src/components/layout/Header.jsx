"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, ShieldAlert, CheckCircle, Settings, LogOut } from 'lucide-react';
import styles from './Header.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function Header({ title = "Dashboard", subtitle = "Overview" }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        setUserProfile(profile);
      }
    }
    loadUser();
  }, [router]);

  const roleInfo = React.useMemo(() => {
    if (userProfile) {
      const roleMap = {
        'admin': { badge: 'Administrator', color: '#7239ea', root: 'Admin' },
        'manager': { badge: 'Manager', color: '#009ef7', root: 'Manager' },
        'finance': { badge: 'Accountant', color: '#c92a42', root: 'Finance' },
        'sales': { badge: 'Sales Staff', color: '#10b981', root: 'Sales' },
        'crew': { badge: 'Crew', color: '#f97316', root: 'Crew' },
      };
      const info = roleMap[userProfile.role] || { badge: 'User', color: '#a1a5b7', root: 'System' };
      
      return {
        avatar: userProfile.avatar_url || userProfile.full_name?.charAt(0) || 'U',
        userName: userProfile.full_name || 'Unknown User',
        userRole: info.badge,
        root: info.root,
        roleBadge: info.badge,
        roleBadgeColor: info.color
      };
    }

    // Fallback while loading
    return { avatar: '...', userName: 'Loading...', userRole: '...', root: '...', roleBadge: '...', roleBadgeColor: '#ccc' };
  }, [userProfile]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.pageTitle}>
        <h1>{title}</h1>
        <div className={styles.breadcrumbs}>
          <span>{roleInfo.root}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{subtitle}</span>
        </div>
      </div>
      
      <div className={styles.headerActions}>
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search..." className={styles.searchInput} />
        </div>

        {/* Role Badge */}
        <div className={styles.roleBadge} style={{ backgroundColor: `${roleInfo.roleBadgeColor}20`, color: roleInfo.roleBadgeColor, borderColor: `${roleInfo.roleBadgeColor}40` }}>
          <span className={styles.roleDot} style={{ backgroundColor: roleInfo.roleBadgeColor }}></span>
          {roleInfo.roleBadge}
        </div>
        
        <div className={styles.actionIcons}>
          {/* Notifications */}
          <div className={styles.notifWrapper} ref={notifRef}>
            <button
              className={styles.iconBtn}
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            >
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>

            {showNotifications && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <h4>Notifications</h4>
                </div>
                <div className={styles.notifList}>
                  <div className={styles.notifItem}>
                    <div className={styles.notifIcon} style={{ backgroundColor: 'rgba(0,158,247,0.1)', color: '#009ef7' }}>
                      <User size={14} />
                    </div>
                    <span>New user registered: John M.</span>
                  </div>
                  <div className={styles.notifItem}>
                    <div className={styles.notifIcon} style={{ backgroundColor: 'rgba(241,65,108,0.1)', color: '#f1416c' }}>
                      <ShieldAlert size={14} />
                    </div>
                    <span>Backup due in 2 hours</span>
                  </div>
                  <div className={styles.notifItem}>
                    <div className={styles.notifIcon} style={{ backgroundColor: 'rgba(80,205,137,0.1)', color: '#50cd89' }}>
                      <CheckCircle size={14} />
                    </div>
                    <span>Module update available</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* User Profile with Dropdown */}
        <div className={styles.userProfileWrapper} ref={userMenuRef}>
          <div
            className={styles.userProfile}
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          >
            <div className={styles.avatar}>{roleInfo.avatar}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{roleInfo.userName}</span>
              <span className={styles.userRole}>{roleInfo.userRole}</span>
            </div>
            <ChevronDown size={16} className={`${styles.dropdownIcon} ${showUserMenu ? styles.dropdownIconOpen : ''}`} />
          </div>

          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.avatarLg}>{roleInfo.avatar}</div>
                <div>
                  <div className={styles.udName}>{roleInfo.userName}</div>
                  <div className={styles.udRole}>{roleInfo.userRole}</div>
                </div>
              </div>
              <div className={styles.userDropdownList}>
                <button className={styles.udItem} onClick={() => setShowUserMenu(false)}>
                  <User size={16} />
                  My Profile
                </button>
                <button className={styles.udItem} onClick={() => setShowUserMenu(false)}>
                  <Settings size={16} />
                  Settings
                </button>
                <div className={styles.udDivider} />
                <button className={`${styles.udItem} ${styles.udLogout}`} onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
