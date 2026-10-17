import Link from 'next/link'
import styles from './Footer.module.css'

const TOOLS = [
  { href: '/youtube-length-calculator', label: 'YouTube Length Calculator' },
]

const LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span>⚡</span>
            <span>ToolFlux</span>
          </Link>
          <p className={styles.tagline}>
            Powerful, free online tools for creators, developers, and everyone in between.
          </p>
        </div>

        {/* Tools */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Tools</h3>
          <ul className={styles.colList}>
            {TOOLS.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className={styles.colLink}>{t.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Legal</h3>
          <ul className={styles.colList}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={styles.colLink}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {year} ToolFlux. All rights reserved.</p>
        <p>Built with ❤ for the web.</p>
      </div>
    </footer>
  )
}
