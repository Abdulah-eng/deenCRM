import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'ProCRM — Smart Operations Management',
  description: 'The all-in-one CRM platform for managing orders, crews, finances, and sales — built for modern field service companies.',
};

export default function HomePage() {
  return (
    <main className={styles.main}>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <div className={styles.navLogo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <span className={styles.navBrandName}>ProCRM</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#roles" className={styles.navLink}>Roles</a>
          <a href="#about" className={styles.navLink}>About</a>
        </div>
        <Link href="/login" className={styles.navCta}>
          Sign In →
        </Link>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          Multi-Role Operations Platform
        </div>
        <h1 className={styles.heroTitle}>
          Manage Your Business<br />
          <span className={styles.heroGradient}>From One Dashboard</span>
        </h1>
        <p className={styles.heroDesc}>
          ProCRM gives every role — Admins, Managers, Finance, Sales, and Crew — their own tailored dashboard. Stay in control of orders, crews, invoices, and capacity in real time.
        </p>
        <div className={styles.heroActions}>
          <Link href="/login" className={styles.heroPrimary}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Access Dashboard
          </Link>
          <a href="#features" className={styles.heroSecondary}>
            See Features
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </a>
        </div>

        {/* Floating stat cards */}
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>5</span>
            <span className={styles.statLabel}>Role Panels</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>30+</span>
            <span className={styles.statLabel}>Pages & Views</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLabel}>Custom Built</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW STRIP */}
      <section className={styles.previewStrip}>
        <div className={styles.previewCard} style={{'--accent': '#7239ea'}}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} style={{background:'#7239ea'}}></div>
            <span>Admin Panel</span>
          </div>
          <div className={styles.previewLines}>
            <div className={styles.pLine} style={{width:'80%'}}></div>
            <div className={styles.pLine} style={{width:'60%'}}></div>
            <div className={styles.pLine} style={{width:'90%'}}></div>
          </div>
        </div>
        <div className={styles.previewCard} style={{'--accent': '#009ef7'}}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} style={{background:'#009ef7'}}></div>
            <span>Manager Panel</span>
          </div>
          <div className={styles.previewLines}>
            <div className={styles.pLine} style={{width:'70%'}}></div>
            <div className={styles.pLine} style={{width:'85%'}}></div>
            <div className={styles.pLine} style={{width:'55%'}}></div>
          </div>
        </div>
        <div className={styles.previewCard} style={{'--accent': '#c92a42'}}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} style={{background:'#c92a42'}}></div>
            <span>Finance Panel</span>
          </div>
          <div className={styles.previewLines}>
            <div className={styles.pLine} style={{width:'90%'}}></div>
            <div className={styles.pLine} style={{width:'65%'}}></div>
            <div className={styles.pLine} style={{width:'75%'}}></div>
          </div>
        </div>
        <div className={styles.previewCard} style={{'--accent': '#10b981'}}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} style={{background:'#10b981'}}></div>
            <span>Sales Panel</span>
          </div>
          <div className={styles.previewLines}>
            <div className={styles.pLine} style={{width:'75%'}}></div>
            <div className={styles.pLine} style={{width:'90%'}}></div>
            <div className={styles.pLine} style={{width:'50%'}}></div>
          </div>
        </div>
        <div className={styles.previewCard} style={{'--accent': '#f97316'}}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} style={{background:'#f97316'}}></div>
            <span>Crew Portal</span>
          </div>
          <div className={styles.previewLines}>
            <div className={styles.pLine} style={{width:'60%'}}></div>
            <div className={styles.pLine} style={{width:'80%'}}></div>
            <div className={styles.pLine} style={{width:'70%'}}></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything Your Team Needs</h2>
        <p className={styles.sectionDesc}>One platform, perfectly tailored for every role in your organization.</p>
        <div className={styles.featureGrid}>
          {[
            { icon: '📋', title: 'Order Management', desc: 'Track every order from creation to completion with real-time status updates and crew assignments.' },
            { icon: '👥', title: 'Crew Management', desc: 'Manage team members, schedules, and capacity. Assign jobs and track utilization by team.' },
            { icon: '💰', title: 'Finance & Invoicing', desc: 'Full invoice lifecycle management with VAT tracking, post-calculation, and crew settlements.' },
            { icon: '📊', title: 'Analytics & Reports', desc: 'Revenue trends, margin analysis, capacity planning, and key performance indicators at a glance.' },
            { icon: '🗓️', title: 'Smart Scheduling', desc: 'Visual weekly scheduling with conflict detection and crew availability planning tools.' },
            { icon: '💼', title: 'Sales Pipeline', desc: 'Manage offers, quotes, and conversion funnels. Track your pipeline from first contact to closed deal.' },
          ].map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className={styles.roles}>
        <h2 className={styles.sectionTitle}>Built for Every Role</h2>
        <p className={styles.sectionDesc}>Each user gets a dashboard designed specifically for their responsibilities.</p>
        <div className={styles.rolesGrid}>
          {[
            { color: '#7239ea', label: 'Administrator', icon: '🛡️', perks: ['Full system access', 'User & role management', 'Company & module settings', 'System audit logs'] },
            { color: '#009ef7', label: 'Manager', icon: '📌', perks: ['Live operations overview', 'Order & crew scheduling', 'Capacity planning', 'Key performance analytics'] },
            { color: '#c92a42', label: 'Finance', icon: '🧾', perks: ['Invoice management', 'Actual cost tracking', 'Post-calculation', 'Crew settlements'] },
            { color: '#10b981', label: 'Sales', icon: '📈', perks: ['Offers & quotes pipeline', 'Customer management', 'Subsidy calculator', 'Invoice overview'] },
            { color: '#f97316', label: 'Crew', icon: '🔧', perks: ['My orders & schedule', 'Status updates', 'Completion reports', 'Team info'] },
          ].map((r, i) => (
            <div key={i} className={styles.roleCard} style={{'--rc': r.color}}>
              <div className={styles.roleIconWrap} style={{background:`${r.color}20`}}>
                <span className={styles.roleEmoji}>{r.icon}</span>
              </div>
              <h3 className={styles.roleLabel} style={{color: r.color}}>{r.label}</h3>
              <ul className={styles.rolePerks}>
                {r.perks.map((p, j) => (
                  <li key={j} className={styles.rolePerk}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {p}
                  </li>
                ))}
              </ul>
              <Link href="/login" className={styles.roleBtn} style={{background: r.color}}>
                Enter Dashboard →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow}></div>
        <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
        <p className={styles.ctaDesc}>Sign in and access your personalized dashboard in seconds.</p>
        <Link href="/login" className={styles.ctaBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Go to Login
        </Link>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.navLogo} style={{width:32,height:32,fontSize:14}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <span className={styles.navBrandName}>ProCRM</span>
        </div>
        <p className={styles.footerText}>© 2024 ProCRM. All rights reserved.</p>
      </footer>

    </main>
  );
}
