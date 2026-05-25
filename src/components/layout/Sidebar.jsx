"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  Calculator,
  FileText,
  CreditCard,
  LogOut,
  Building2,
  PackageSearch,
  AlertCircle,
  Shield,
  Boxes,
  ClipboardList,
  TrendingUp,
  HardDrive,
  ScrollText,
  BarChart2,
  Layers,
  UserCog,
  LineChart,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  // Admin Sections
  { section: 'MAIN', roles: ['admin'], items: [{ name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }] },
  { section: 'USER MANAGEMENT', roles: ['admin'], items: [{ name: 'Users & Roles', path: '/users', icon: Users, badge: '12' }, { name: 'Role Permissions', path: '/settings', icon: Shield }] },
  { section: 'COMPANY', roles: ['admin'], items: [{ name: 'Companies', path: '/companies', icon: Building2 }, { name: 'Module Manager', path: '/admin/modules', icon: Layers }] },
  { section: 'DATA', roles: ['admin'], items: [{ name: 'Customers', path: '/customers', icon: Users }, { name: 'Suppliers', path: '/suppliers', icon: Boxes }, { name: 'Materials', path: '/materials', icon: PackageSearch }, { name: 'Services', path: '/services', icon: ClipboardList }] },
  { section: 'REPORTS & SETTINGS', roles: ['admin'], items: [{ name: 'Reports', path: '/admin/reports', icon: BarChart2 }, { name: 'Settings', path: '/settings', icon: Settings }] },
  { section: 'SYSTEM', roles: ['admin'], items: [{ name: 'Audit Logs', path: '/audit-logs', icon: FileText }, { name: 'Backup & Data', path: '/backup', icon: HardDrive }] },

  // Manager Sections
  { section: 'OVERVIEW', roles: ['manager'], items: [{ name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard }] },
  { section: 'ORDERS', roles: ['manager'], items: [{ name: 'All Orders', path: '/manager/orders', icon: ScrollText, badge: '21' }, { name: 'Complaints', path: '/manager/complaints', icon: AlertCircle, badge: '3' }] },
  { section: 'PLANNING', roles: ['manager'], items: [{ name: 'Scheduling', path: '/manager/scheduling', icon: CalendarDays }, { name: 'Crew Management', path: '/manager/crew-management', icon: Users }, { name: 'Capacity Planning', path: '/manager/capacity-planning', icon: BarChart2 }] },
  { section: 'ANALYTICS', roles: ['manager'], items: [{ name: 'Key Figures', path: '/manager/key-figures', icon: LineChart }] },
  // Finance Sections
  { section: 'OVERVIEW', roles: ['finance'], items: [{ name: 'Dashboard', path: '/finance/dashboard', icon: LayoutDashboard }] },
  { section: 'FINANCIALS', roles: ['finance'], items: [{ name: 'Invoices', path: '/finance/invoices', icon: CreditCard, badge: '2 overdue' }, { name: 'Actual Costs', path: '/finance/actual-costs', icon: TrendingUp }, { name: 'Post-Calculation', path: '/finance/post-calculation', icon: Calculator }, { name: 'Crew Settlements', path: '/finance/crew-settlements', icon: Users }] },
  // Sales Sections
  { section: 'OVERVIEW', roles: ['sales'], items: [{ name: 'Dashboard', path: '/sales/dashboard', icon: LayoutDashboard }] },
  { section: 'SALES', roles: ['sales'], items: [{ name: 'Offers & Quotes', path: '/sales/offers', icon: FileText, badge: '8' }, { name: 'Invoices', path: '/sales/invoices', icon: CreditCard }, { name: 'Subsidy Calculator', path: '/sales/subsidy', icon: Calculator }] },
  { section: 'CUSTOMERS', roles: ['sales'], items: [{ name: 'My Customers', path: '/sales/customers', icon: Users }] },
  // Crew Sections
  { section: 'MY WORK', roles: ['crew'], items: [{ name: 'My Dashboard', path: '/crew/dashboard', icon: LayoutDashboard }, { name: 'My Orders', path: '/crew/my-orders', icon: ScrollText }, { name: 'My Schedule', path: '/crew/my-schedule', icon: CalendarDays }, { name: 'Completion Reports', path: '/crew/completion-reports', icon: FileText }] }
];

export default function Sidebar() {
  const pathname = usePathname();

  const currentRole = useMemo(() => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/manager')) return 'manager';
    if (pathname.startsWith('/sales')) return 'sales';
    if (pathname.startsWith('/finance')) return 'finance';
    if (pathname.startsWith('/crew')) return 'crew';
    return 'admin'; // fallback
  }, [pathname]);

  const panelTitles = {
    admin: 'Administrator Panel',
    manager: 'Manager Panel',
    sales: 'Sales Panel',
    finance: 'Finance Panel',
    crew: 'Crew Portal'
  };

  const filteredNavItems = useMemo(() => {
    return navItems.filter(section => section.roles.includes(currentRole));
  }, [currentRole]);

  const themeClass = currentRole === 'finance' ? styles.sidebarFinance : currentRole === 'crew' ? styles.sidebarCrew : currentRole === 'sales' ? styles.sidebarSales : '';

  return (
    <aside className={`${styles.sidebar} ${themeClass}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <Building2 size={20} color="white" />
        </div>
        <div className={styles.logoText}>
          <h2>ProCRM</h2>
          <span>{panelTitles[currentRole]}</span>
        </div>
      </div>

      {/* Company selector */}
      <div className={styles.companySelector}>
        <div className={styles.companyDot}></div>
        <span>Heating Works S. Germany</span>
      </div>

      <div className={styles.navContainer}>
        {filteredNavItems.map((section, idx) => (
          <div key={idx} className={styles.navSection}>
            <h3 className={styles.sectionTitle}>{section.section}</h3>
            <ul className={styles.navList}>
              {section.items.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                return (
                  <li key={i} className={styles.navItem}>
                    <Link href={item.path} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                      <Icon size={17} className={styles.navIcon} />
                      <span className={styles.navLabel}>{item.name}</span>
                      {item.badge && (
                        <span className={styles.navBadge}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottomNav}>
        <Link href="/login" className={styles.logoutBtn} style={{ textDecoration: 'none' }}>
          <LogOut size={18} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
