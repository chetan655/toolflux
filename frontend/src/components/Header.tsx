'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Header.module.css'

const TOOLS = [
  {
    href: '/youtube-length-calculator',
    label: 'YouTube Length',
    icon: '▶',
    description: 'Calculate playlist & video durations',
  },
  // More tools coming soon…
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="ToolFlux Home">
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>
            Tool<span className={styles.logoAccent}>Flux</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`${styles.navLink} ${pathname === tool.href ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navIcon}>{tool.icon}</span>
              {tool.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className={styles.actions}>
          <Link href="/youtube-length-calculator" className={`btn btn-primary ${styles.ctaBtn}`}>
            Try Tools Free
          </Link>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="navigation" aria-label="Mobile navigation">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.mobileLinkIcon}>{tool.icon}</span>
              <div>
                <div className={styles.mobileLinkLabel}>{tool.label}</div>
                <div className={styles.mobileLinkDesc}>{tool.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
