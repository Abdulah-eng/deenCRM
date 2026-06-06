import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'ProCRM — Intelligentes Betriebsmanagement',
  description: 'Die All-in-One CRM-Plattform für die Verwaltung von Aufträgen, Teams, Finanzen und Vertrieb — entwickelt für moderne Außendienstunternehmen.',
};

export default function HomePage() {
  return (
    <main className={styles.main}>

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <div className={styles.navLogo} style={{ background: 'transparent', width: 'auto', height: 'auto', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="ProCRM Logo" style={{ maxHeight: '28px', objectFit: 'contain' }} />
          </div>
          <span className={styles.navBrandName}>ProCRM</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Funktionen</a>
          <a href="#roles" className={styles.navLink}>Rollen</a>
          <a href="#about" className={styles.navLink}>Über uns</a>
        </div>
        <Link href="/login" className={styles.navCta}>
          Anmelden →
        </Link>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgeDot}></span>
          Multi-Rollen Betriebsplattform
        </div>
        <h1 className={styles.heroTitle}>
          Verwalten Sie Ihr Geschäft<br />
          <span className={styles.heroGradient}>Von einem einzigen Dashboard</span>
        </h1>
        <p className={styles.heroDesc}>
          ProCRM bietet jeder Rolle — Admins, Managern, Finanzen, Vertrieb und Teams — ein maßgeschneidertes Dashboard. Behalten Sie die Kontrolle über Aufträge, Teams, Rechnungen und Kapazitäten in Echtzeit.
        </p>
        <div className={styles.heroActions}>
          <Link href="/login" className={styles.heroPrimary}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Zum Dashboard
          </Link>
          <a href="#features" className={styles.heroSecondary}>
            Funktionen ansehen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </a>
        </div>

        {/* Floating stat cards */}
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span className={styles.statNum}>5</span>
            <span className={styles.statLabel}>Rollen-Panels</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>30+</span>
            <span className={styles.statLabel}>Seiten & Ansichten</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLabel}>Maßgeschneidert</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW STRIP */}
      <section className={styles.previewStrip}>
        <div className={styles.previewCard} style={{'--accent': '#7239ea'}}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} style={{background:'#7239ea'}}></div>
            <span>Admin-Panel</span>
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
            <span>Manager-Panel</span>
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
            <span>Finanz-Panel</span>
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
            <span>Vertriebs-Panel</span>
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
            <span>Mitarbeiter-Portal</span>
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
        <h2 className={styles.sectionTitle}>Alles, was Ihr Team braucht</h2>
        <p className={styles.sectionDesc}>Eine Plattform, perfekt zugeschnitten auf jede Rolle in Ihrem Unternehmen.</p>
        <div className={styles.featureGrid}>
          {[
            { icon: '📋', title: 'Auftragsverwaltung', desc: 'Verfolgen Sie jeden Auftrag von der Erstellung bis zum Abschluss mit Statusaktualisierungen und Teamzuweisungen in Echtzeit.' },
            { icon: '👥', title: 'Mitarbeiterverwaltung', desc: 'Verwalten Sie Teammitglieder, Zeitpläne und Kapazitäten. Weisen Sie Aufträge zu und verfolgen Sie die Auslastung pro Team.' },
            { icon: '💰', title: 'Finanzen & Rechnungsstellung', desc: 'Vollständiges Rechnungsmanagement mit USt-Verfolgung, Nachkalkulation und Abrechnung der Teams.' },
            { icon: '📊', title: 'Analysen & Berichte', desc: 'Umsatztrends, Margenanalysen, Kapazitätsplanung und wichtige Leistungskennzahlen auf einen Blick.' },
            { icon: '🗓️', title: 'Intelligente Terminplanung', desc: 'Visuelle Wochenplanung mit Konflikterkennung und Planwerkzeugen für die Verfügbarkeit der Teams.' },
            { icon: '💼', title: 'Vertriebs-Pipeline', desc: 'Verwalten Sie Angebote, Kostenvoranschläge und Vertriebstrichter. Verfolgen Sie Ihre Pipeline vom Erstkontakt bis zum Abschluss.' },
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
        <h2 className={styles.sectionTitle}>Für jede Rolle entwickelt</h2>
        <p className={styles.sectionDesc}>Jeder Benutzer erhält ein Dashboard, das speziell für seine Aufgaben entwickelt wurde.</p>
        <div className={styles.rolesGrid}>
          {[
            { color: '#7239ea', label: 'Administrator', icon: '🛡️', perks: ['Vollständiger Systemzugriff', 'Benutzer- & Rollenverwaltung', 'Unternehmens- & Moduleinstellungen', 'System-Aktivitätsprotokolle'] },
            { color: '#009ef7', label: 'Manager', icon: '📌', perks: ['Echtzeit-Betriebsübersicht', 'Auftrags- & Terminplanung', 'Kapazitätsplanung', 'Leistungsanalysen'] },
            { color: '#c92a42', label: 'Finanzen', icon: '🧾', perks: ['Rechnungsverwaltung', 'Ist-Kosten-Verfolgung', 'Nachkalkulation', 'Abrechnung der Teams'] },
            { color: '#10b981', label: 'Vertrieb', icon: '📈', perks: ['Angebots-Pipeline', 'Kundenverwaltung', 'Förderungsrechner', 'Rechnungsübersicht'] },
            { color: '#f97316', label: 'Montageteam', icon: '🔧', perks: ['Meine Aufträge & Zeitplan', 'Statusaktualisierungen', 'Fertigstellungsmeldungen', 'Teaminformationen'] },
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
                Zum Dashboard →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow}></div>
        <h2 className={styles.ctaTitle}>Bereit loszulegen?</h2>
        <p className={styles.ctaDesc}>Melden Sie sich an und greifen Sie in Sekundenschnelle auf Ihr persönliches Dashboard zu.</p>
        <Link href="/login" className={styles.ctaBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Zum Login
        </Link>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.navLogo} style={{ width: 'auto', height: 'auto', background: 'transparent', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="ProCRM Logo" style={{ maxHeight: '24px', objectFit: 'contain' }} />
          </div>
          <span className={styles.navBrandName}>ProCRM</span>
        </div>
        <p className={styles.footerText}>© 2024 ProCRM. Alle Rechte vorbehalten.</p>
      </footer>

    </main>
  );
}
