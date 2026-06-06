"use client";
import React, { useMemo, useState, useEffect } from 'react';
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
import { supabase } from '@/utils/supabase';
import styles from './Sidebar.module.css';


const navItems = [
  // Admin Sections
  { section: 'HAUPTMENÜ', roles: ['admin'], items: [{ name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }] },
  { section: 'BENUTZERVERWALTUNG', roles: ['admin'], items: [{ name: 'Benutzer & Rollen', path: '/users', icon: Users, badge: '12' }, { name: 'Rollen & Berechtigungen', path: '/settings', icon: Shield }] },
  { section: 'UNTERNEHMEN', roles: ['admin'], items: [{ name: 'Unternehmen', path: '/companies', icon: Building2 }, { name: 'Modul-Manager', path: '/admin/modules', icon: Layers }] },
  { section: 'STAMMDATEN', roles: ['admin'], items: [{ name: 'Kunden', path: '/customers', icon: Users }, { name: 'Lieferanten', path: '/suppliers', icon: Boxes }, { name: 'Materialien', path: '/materials', icon: PackageSearch }, { name: 'Leistungen', path: '/services', icon: ClipboardList }] },
  { section: 'BERICHTE & EINSTELLUNGEN', roles: ['admin'], items: [{ name: 'Berichte', path: '/admin/reports', icon: BarChart2 }, { name: 'Einstellungen', path: '/settings', icon: Settings }] },
  { section: 'SYSTEM', roles: ['admin'], items: [{ name: 'Aktivitätsprotokoll', path: '/audit-logs', icon: FileText }, { name: 'Backup & Daten', path: '/backup', icon: HardDrive }] },

  // Manager Sections
  { section: 'ÜBERSICHT', roles: ['manager'], items: [{ name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard }] },
  { section: 'AUFTRÄGE', roles: ['manager'], items: [{ name: 'Alle Aufträge', path: '/manager/orders', icon: ScrollText, badge: '21' }, { name: 'Reklamationen', path: '/manager/complaints', icon: AlertCircle, badge: '3' }] },
  { section: 'PLANUNG', roles: ['manager'], items: [{ name: 'Terminplanung', path: '/manager/scheduling', icon: CalendarDays }, { name: 'Mitarbeiterverwaltung', path: '/manager/crew-management', icon: Users }, { name: 'Kapazitätsplanung', path: '/manager/capacity-planning', icon: BarChart2 }] },
  { section: 'ANALYSE', roles: ['manager'], items: [{ name: 'Kennzahlen', path: '/manager/key-figures', icon: LineChart }] },
  // Finance Sections
  { section: 'ÜBERSICHT', roles: ['finance'], items: [{ name: 'Dashboard', path: '/finance/dashboard', icon: LayoutDashboard }] },
  { section: 'FINANZEN', roles: ['finance'], items: [{ name: 'Rechnungen', path: '/finance/invoices', icon: CreditCard, badge: '2 überfällig' }, { name: 'Ist-Kosten', path: '/finance/actual-costs', icon: TrendingUp }, { name: 'Nachkalkulation', path: '/finance/post-calculation', icon: Calculator }, { name: 'Abrechnungen', path: '/finance/crew-settlements', icon: Users }] },
  // Sales Sections
  { section: 'ÜBERSICHT', roles: ['sales'], items: [{ name: 'Dashboard', path: '/sales/dashboard', icon: LayoutDashboard }] },
  { section: 'VERTRIEB', roles: ['sales'], items: [{ name: 'Angebote', path: '/sales/offers', icon: FileText, badge: '8' }, { name: 'Rechnungen', path: '/sales/invoices', icon: CreditCard }, { name: 'Förderungsrechner', path: '/sales/subsidy', icon: Calculator }] },
  { section: 'KUNDEN', roles: ['sales'], items: [{ name: 'Meine Kunden', path: '/sales/customers', icon: Users }] },
  // Crew Sections
  { section: 'MEINE ARBEIT', roles: ['crew'], items: [{ name: 'Mein Dashboard', path: '/crew/dashboard', icon: LayoutDashboard }, { name: 'Meine Aufträge', path: '/crew/my-orders', icon: ScrollText }, { name: 'Mein Zeitplan', path: '/crew/my-schedule', icon: CalendarDays }, { name: 'Fertigstellungsmeldungen', path: '/crew/completion-reports', icon: FileText }] }
];


export default function Sidebar() {
  const pathname = usePathname();
  const [companyName, setCompanyName] = useState('Heiz Werke Süddeutschland');

  useEffect(() => {
    async function loadCompany() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();
      if (profile?.company_id) {
        const { data: company } = await supabase
          .from('companies')
          .select('name')
          .eq('id', profile.company_id)
          .single();
        if (company?.name) {
          setCompanyName(company.name);
        }
      }
    }
    loadCompany();
  }, []);

  const currentRole = useMemo(() => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/manager')) return 'manager';
    if (pathname.startsWith('/sales')) return 'sales';
    if (pathname.startsWith('/finance')) return 'finance';
    if (pathname.startsWith('/crew')) return 'crew';
    return 'admin'; // fallback
  }, [pathname]);

  const panelTitles = {
    admin: 'Administrator-Panel',
    manager: 'Manager-Panel',
    sales: 'Vertriebs-Panel',
    finance: 'Finanz-Panel',
    crew: 'Mitarbeiter-Portal'
  };

  const filteredNavItems = useMemo(() => {
    return navItems.filter(section => section.roles.includes(currentRole));
  }, [currentRole]);

  const themeClass = currentRole === 'finance' ? styles.sidebarFinance : currentRole === 'crew' ? styles.sidebarCrew : currentRole === 'sales' ? styles.sidebarSales : '';

  return (
    <aside className={`${styles.sidebar} ${themeClass}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon} style={{ background: 'transparent', width: 'auto', height: 'auto', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" className={styles.logoImage} />
        </div>
        <div className={styles.logoText}>
          <h2>ProCRM</h2>
          <span>{panelTitles[currentRole]}</span>
        </div>
      </div>

      {/* Company selector */}
      <div className={styles.companySelector}>
        <div className={styles.companyDot}></div>
        <span>{companyName}</span>
      </div>

      <div className={navItems.length > 0 ? styles.navContainer : ''}>
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
          Abmelden
        </Link>
      </div>
    </aside>
  );
}

