"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, ShieldAlert, CheckCircle, Settings, LogOut } from 'lucide-react';
import styles from './Header.module.css';
import { usePathname, useRouter } from 'next/navigation';

export default function Header({ title = "Dashboard", subtitle = "Overview" }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const roleInfo = React.useMemo(() => {
    if (pathname.startsWith('/admin')) return { avatar: 'A', userName: 'Admin User', userRole: 'Super Administrator', root: 'Admin', roleBadge: 'Administrator', roleBadgeColor: '#7239ea' };
    if (pathname.startsWith('/manager')) return { avatar: 'M', userName: 'Max Mueller', userRole: 'Manager', root: 'Manager', roleBadge: 'Manager', roleBadgeColor: '#009ef7' };
    if (pathname.startsWith('/sales')) return { avatar: 'H', userName: 'Hans Schmidt', userRole: 'Sales Staff', root: 'Sales', roleBadge: 'Sales Staff', roleBadgeColor: '#10b981' };
    if (pathname.startsWith('/finance')) return { avatar: 'A', userName: 'Anna Fischer', userRole: 'Accountant', root: 'Finance', roleBadge: 'Accountant', roleBadgeColor: '#c92a42' };
    if (pathname.startsWith('/crew')) return { avatar: 'K', userName: 'Klaus Weber', userRole: 'Team Alpha Lead', root: 'Crew', roleBadge: 'Crew', roleBadgeColor: '#f97316' };
    return { avatar: 'U', userName: 'User', userRole: 'Staff', root: 'System', roleBadge: 'Staff', roleBadgeColor: '#a1a5b7' };
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                <button className={`${styles.udItem} ${styles.udLogout}`} onClick={() => router.push('/login')}>
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
