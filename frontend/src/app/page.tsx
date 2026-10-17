import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'ToolFlux — Free Online Tools for Creators & Developers',
  description:
    'ToolFlux is your all-in-one toolkit: calculate YouTube playlist durations, process PDFs, resize images, convert JSON to Pydantic, and much more — all free, fast, and private.',
}

const TOOLS = [
  {
    href: '/youtube-length-calculator',
    icon: '▶',
    iconBg: 'rgba(255, 0, 0, 0.15)',
    iconColor: '#ff4444',
    title: 'YouTube Length Calculator',
    description:
      'Find the total duration of any YouTube playlist or a list of videos. See watch times at 1x, 1.25x, 1.5x, 1.75x & 2x speeds.',
    badge: 'Live',
    tags: ['YouTube', 'Productivity'],
  },
  {
    href: '#',
    icon: '📄',
    iconBg: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#60a5fa',
    title: 'PDF Tools',
    description: 'Merge, split, compress, and convert PDFs instantly in your browser.',
    badge: 'Coming Soon',
    tags: ['PDF', 'Documents'],
  },
  {
    href: '#',
    icon: '🖼',
    iconBg: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#34d399',
    title: 'Image Resizer',
    description: 'Resize, compress, and convert images to any format without quality loss.',
    badge: 'Coming Soon',
    tags: ['Images', 'Design'],
  },
  {
    href: '#',
    icon: '{ }',
    iconBg: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#fbbf24',
    title: 'JSON → Pydantic',
    description: 'Paste JSON and instantly generate type-safe Pydantic models for Python.',
    badge: 'Coming Soon',
    tags: ['Python', 'Developer'],
  },
]

const STATS = [
  { value: '10K+', label: 'Monthly Users' },
  { value: '4', label: 'Powerful Tools' },
  { value: '100%', label: 'Free Forever' },
  { value: '0', label: 'Ads or Tracking' },
]

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ToolFlux',
            url: 'https://toolflux.io',
            description:
              'Free online tools for creators and developers — YouTube calculator, PDF tools, image resizer, and more.',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://toolflux.io/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroGrid} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Free · No signup · No ads
          </div>
          <h1 className={styles.heroTitle}>
            Every tool you need,<br />
            <span className="gradient-text">in one place.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            ToolFlux gives you powerful, free online tools designed for creators, developers, and
            everyone in between. No installs. No paywalls. Just tools that work.
          </p>
          <div className={styles.heroActions}>
            <Link href="/youtube-length-calculator" className="btn btn-primary">
              ▶ Start with YouTube Calculator
            </Link>
            <a href="#tools" className="btn btn-ghost">
              Browse all tools
            </a>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section id="tools" className={styles.toolsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Tools</h2>
            <p className={styles.sectionSubtitle}>
              Every tool runs in your browser — lightning-fast, private, and completely free.
            </p>
          </div>

          <div className={styles.toolsGrid}>
            {TOOLS.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className={`${styles.toolCard} ${tool.badge === 'Coming Soon' ? styles.toolCardDisabled : ''}`}
                aria-disabled={tool.badge === 'Coming Soon'}
                tabIndex={tool.badge === 'Coming Soon' ? -1 : 0}
              >
                <div className={styles.toolCardTop}>
                  <div
                    className={styles.toolIcon}
                    style={{ background: tool.iconBg, color: tool.iconColor }}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`${styles.toolBadge} ${
                      tool.badge === 'Live' ? styles.toolBadgeLive : styles.toolBadgeSoon
                    }`}
                  >
                    {tool.badge === 'Live' && <span className={styles.liveDot} />}
                    {tool.badge}
                  </span>
                </div>
                <h3 className={styles.toolTitle}>{tool.title}</h3>
                <p className={styles.toolDesc}>{tool.description}</p>
                <div className={styles.toolTags}>
                  {tool.tags.map((tag) => (
                    <span key={tag} className={styles.toolTag}>{tag}</span>
                  ))}
                </div>
                {tool.badge === 'Live' && (
                  <div className={styles.toolArrow}>→</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why ToolFlux */}
      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why ToolFlux?</h2>
          </div>
          <div className={styles.whyGrid}>
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Tools run instantly. No loading screens, no server queues.' },
              { icon: '🔒', title: 'Privacy First', desc: 'We don\'t track you, sell your data, or require sign-ups.' },
              { icon: '♾️', title: 'Always Free', desc: 'Core tools are and will always be free. No hidden costs.' },
              { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive on mobile, tablet, and desktop.' },
            ].map((item) => (
              <div key={item.title} className={styles.whyCard}>
                <span className={styles.whyIcon}>{item.icon}</span>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
