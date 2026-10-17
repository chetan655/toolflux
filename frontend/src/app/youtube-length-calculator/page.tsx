import type { Metadata } from 'next'
import YoutubeCalculator from '@/components/tools/youtube/YoutubeCalculator'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'YouTube Playlist Length Calculator — Total Duration of Any Playlist',
  description:
    'Calculate the total length of any YouTube playlist or multiple videos instantly. See watch times at 1x, 1.25x, 1.5x, 1.75x, and 2x speeds. Free, fast, no sign-up required.',
  keywords: [
    'youtube playlist length',
    'youtube playlist duration calculator',
    'how long is a youtube playlist',
    'youtube video length calculator',
    'total youtube playlist time',
    'youtube watch time calculator',
    'youtube playlist timer',
  ],
  openGraph: {
    title: 'YouTube Playlist Length Calculator — ToolFlux',
    description:
      'Calculate the total duration of any YouTube playlist instantly. See estimated watch times at different playback speeds.',
    url: 'https://toolflux.io/youtube-length-calculator',
    type: 'website',
  },
  alternates: {
    canonical: 'https://toolflux.io/youtube-length-calculator',
  },
}

const FAQ = [
  {
    q: 'How does the YouTube playlist length calculator work?',
    a: 'Enter a YouTube playlist URL or paste multiple video URLs. Our tool uses the YouTube Data API to fetch each video\'s duration and sums them up to give you the total watch time.',
  },
  {
    q: 'Is this YouTube length calculator free?',
    a: 'Yes, completely free. No sign-up, no subscription, no ads.',
  },
  {
    q: 'Can I calculate the length of a private playlist?',
    a: 'No. We can only access public playlists via the YouTube Data API. Private or unlisted playlists are not accessible.',
  },
  {
    q: 'Why are playback speed estimates useful?',
    a: 'Many students and professionals watch YouTube at 1.25x or 1.5x speed to save time. These estimates help you plan how long a playlist will actually take you to watch.',
  },
  {
    q: 'How accurate is the duration calculation?',
    a: 'Very accurate — it reads the exact duration of every video directly from YouTube\'s official API, so results are precise to the second.',
  },
  {
    q: 'Can I calculate the total time of multiple separate videos?',
    a: 'Yes! Switch to the "Multiple Videos" tab and paste one YouTube URL per line. We\'ll calculate the combined duration.',
  },
]

export default function YoutubeCalculatorPage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'YouTube Playlist Length Calculator',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            url: 'https://toolflux.io/youtube-length-calculator',
            description:
              'Calculate the total duration of YouTube playlists and videos. See watch times at various playback speeds.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            provider: { '@type': 'Organization', name: 'ToolFlux' },
          }),
        }}
      />

      {/* Page hero */}
      <section className={styles.pageHero}>
        <div className={`container ${styles.pageHeroInner}`}>
          <div className={styles.breadcrumb}>
            <a href="/">Home</a>
            <span>/</span>
            <span>YouTube Length Calculator</span>
          </div>
          <div className={styles.toolIconWrap}>
            <span className={styles.toolIcon}>▶</span>
          </div>
          <h1 className={styles.pageTitle}>
            YouTube Playlist Length{' '}
            <span className="gradient-text">Calculator</span>
          </h1>
          <p className={styles.pageSubtitle}>
            Find out exactly how long any YouTube playlist or set of videos will take to watch —
            including estimates at 1.25×, 1.5×, 1.75×, and 2× speed.
          </p>
          <div className={styles.quickStats}>
            <span>⚡ Instant results</span>
            <span>🔒 No sign-up</span>
            <span>📋 Playlist & video support</span>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className={styles.toolSection}>
        <div className="container">
          <YoutubeCalculator />
        </div>
      </section>

      {/* SEO Content */}
      <section className={styles.seoSection}>
        <div className={`container ${styles.seoInner}`}>
          <div className={styles.seoContent}>
            <h2>How to Calculate YouTube Playlist Duration</h2>
            <p>
              Ever started watching a YouTube playlist and wondered, <em>"How long will this actually take?"</em>{' '}
              Whether you're planning a study session, a workout, or just bingeing your favorite creator —
              knowing the total length upfront saves time and helps you plan better.
            </p>
            <p>
              ToolFlux's YouTube Playlist Length Calculator connects directly to YouTube's official API to fetch
              the exact duration of every video in a playlist — even playlists with hundreds of videos.
              You get the total time in seconds, plus a clear breakdown per video.
            </p>

            <h2>Why Watch Speed Estimates Matter</h2>
            <p>
              Watching at 1.5× speed is one of the most popular productivity tricks. A 10-hour playlist
              becomes just 6 hours and 40 minutes. At 2× speed, you finish in 5 hours. Our calculator
              shows you exactly how much time you save at every speed, so you can choose the right pace
              for the content.
            </p>

            <h2>Calculate Duration for Multiple Videos</h2>
            <p>
              Not everything is in a playlist. Paste URLs of individual videos (one per line) to calculate
              the combined total. Great for curated lists, homework assignments, or course modules spread
              across different channels.
            </p>
          </div>

          {/* FAQ */}
          <div className={styles.faqSection}>
            <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {FAQ.map((item, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{item.q}</summary>
                  <p className={styles.faqAnswer}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
