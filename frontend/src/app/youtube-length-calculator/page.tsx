import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
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
    url: `${SITE_URL}/youtube-length-calculator`,
    type: 'website',
  },
  alternates: {
    canonical: `${SITE_URL}/youtube-length-calculator`,
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
  {
    q: 'How do I check a YouTube playlist\'s length without installing an extension?',
    a: 'You don\'t need a browser extension. Just paste the playlist URL into this page and click Calculate — it works on any device, including mobile.',
  },
  {
    q: 'Is there a limit on how many videos a playlist can have?',
    a: 'No practical limit. The calculator pages through the entire playlist via the YouTube API, so playlists with hundreds or thousands of videos work fine.',
  },
  {
    q: 'Does it work with YouTube Shorts and regular video links?',
    a: 'Yes. It accepts standard watch URLs, youtu.be short links, embed links, and Shorts URLs — as well as raw 11-character video IDs.',
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
            url: `${SITE_URL}/youtube-length-calculator`,
            description:
              'Calculate the total duration of YouTube playlists and videos. See watch times at various playback speeds.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            provider: { '@type': 'Organization', name: 'ToolFlux', url: SITE_URL },
          }),
        }}
      />
      {/* FAQPage schema — no longer a Google rich result, but heavily cited by AI search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'YouTube Playlist Length Calculator',
                item: `${SITE_URL}/youtube-length-calculator`,
              },
            ],
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
            <h2>How do you calculate the total length of a YouTube playlist?</h2>
            <p>
              Paste the playlist URL into the calculator above and press Calculate. The tool reads the
              exact duration of every video directly from the official YouTube Data API and adds them up,
              giving you the total watch time to the second — even for playlists with hundreds of videos.
            </p>
            <p>
              Ever started watching a YouTube playlist and wondered, <em>"How long will this actually take?"</em>{' '}
              Whether you're planning a study session, a workout, or just bingeing your favorite creator —
              knowing the total length upfront helps you plan better. You also get a per-video breakdown
              and the average video length.
            </p>

            <h2>How much time do you save at faster playback speeds?</h2>
            <p>
              Watching at 1.5× speed turns a 10-hour playlist into 6 hours and 40 minutes; at 2× you finish
              in 5 hours. The calculator shows the adjusted watch time at every speed YouTube supports, so
              you can choose the right pace for the content. Here's what a 10-hour playlist takes:
            </p>
            <table className={styles.speedTable}>
              <thead>
                <tr>
                  <th>Playback speed</th>
                  <th>Actual watch time</th>
                  <th>Time saved</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1× (normal)</td><td>10h 00m</td><td>—</td></tr>
                <tr><td>1.25×</td><td>8h 00m</td><td>2h 00m</td></tr>
                <tr><td>1.5×</td><td>6h 40m</td><td>3h 20m</td></tr>
                <tr><td>1.75×</td><td>5h 43m</td><td>4h 17m</td></tr>
                <tr><td>2×</td><td>5h 00m</td><td>5h 00m</td></tr>
              </tbody>
            </table>

            <h2>Can you add up the length of separate videos too?</h2>
            <p>
              Yes — not everything is in a playlist. Switch to the "Multiple Videos" tab and paste URLs of
              individual videos (one per line) to calculate the combined total. Great for curated lists,
              homework assignments, or course modules spread across different channels.
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
