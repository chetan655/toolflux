'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './YoutubeCalculator.module.css'

// ── Types ──────────────────────────────────────────────────────────────────

interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration_seconds: number
  duration_formatted: string
  channel_title: string
}

interface SpeedEntry {
  hours: number
  minutes: number
  seconds: number
  formatted: string
  total_seconds: number
}

interface DurationResult {
  videos: VideoInfo[]
  total_seconds: number
  total_formatted: string
  average_seconds: number
  average_formatted: string
  speeds: Record<string, SpeedEntry>
}

type Tab = 'playlist' | 'videos'
type ResultTab = 'summary' | 'breakdown'

// API routes live in this same Next.js app (src/app/api/youtube/*)
const API_BASE = ''

const SPEEDS: Array<{ key: string; label: string }> = [
  { key: '1.0', label: '1×' },
  { key: '1.25', label: '1.25×' },
  { key: '1.5', label: '1.5×' },
  { key: '1.75', label: '1.75×' },
  { key: '2.0', label: '2×' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function fmtCompact(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [
    h > 0 ? `${h}h` : null,
    m > 0 ? `${m}m` : null,
    `${s}s`,
  ]
    .filter(Boolean)
    .join(' ')
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function YoutubeCalculator() {
  const [tab, setTab] = useState<Tab>('playlist')
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [videosText, setVideosText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DurationResult | null>(null)
  const [resultTab, setResultTab] = useState<ResultTab>('summary')
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [result])

  const calculate = useCallback(async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      let url: string
      if (tab === 'playlist') {
        if (!playlistUrl.trim()) throw new Error('Please enter a YouTube playlist URL.')
        url = `${API_BASE}/api/youtube/playlist?url=${encodeURIComponent(playlistUrl.trim())}`
      } else {
        const lines = videosText
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
        if (lines.length === 0) throw new Error('Please enter at least one YouTube video URL.')
        const params = lines.map((l) => `urls=${encodeURIComponent(l)}`).join('&')
        url = `${API_BASE}/api/youtube/videos?${params}`
      }

      const res = await fetch(url)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail ?? `Request failed (${res.status})`)
      }
      const data: DurationResult = await res.json()
      setResult(data)
      setResultTab('summary')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }, [tab, playlistUrl, videosText])

  const reset = () => {
    setResult(null)
    setError(null)
    setPlaylistUrl('')
    setVideosText('')
  }

  return (
    <div className={styles.wrapper}>
      {/* Input card */}
      <div className={styles.inputCard}>
        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'playlist'}
            className={`${styles.tab} ${tab === 'playlist' ? styles.tabActive : ''}`}
            onClick={() => { setTab('playlist'); setResult(null); setError(null) }}
          >
            Playlist URL
          </button>
          <button
            role="tab"
            aria-selected={tab === 'videos'}
            className={`${styles.tab} ${tab === 'videos' ? styles.tabActive : ''}`}
            onClick={() => { setTab('videos'); setResult(null); setError(null) }}
          >
            Multiple Videos
          </button>
        </div>

        {/* Input area */}
        <div className={styles.inputArea}>
          {tab === 'playlist' ? (
            <div className={styles.inputGroup}>
              <label htmlFor="playlist-url" className={styles.label}>
                YouTube Playlist URL
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="playlist-url"
                  type="url"
                  className={styles.input}
                  placeholder="https://www.youtube.com/playlist?list=PLxxxxxxxx"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && calculate()}
                  aria-label="YouTube playlist URL"
                />
              </div>
              <p className={styles.hint}>
                Paste any public YouTube playlist link — we'll calculate the total duration of all videos.
              </p>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label htmlFor="video-urls" className={styles.label}>
                YouTube Video URLs{' '}
                <span className={styles.labelCount}>
                  ({videosText.split('\n').filter((l) => l.trim()).length} video{videosText.split('\n').filter((l) => l.trim()).length !== 1 ? 's' : ''})
                </span>
              </label>
              <textarea
                id="video-urls"
                className={styles.textarea}
                placeholder={`https://www.youtube.com/watch?v=abc123\nhttps://www.youtube.com/watch?v=def456\nhttps://youtu.be/ghi789`}
                value={videosText}
                onChange={(e) => setVideosText(e.target.value)}
                rows={6}
                aria-label="YouTube video URLs, one per line"
              />
              <p className={styles.hint}>One URL per line. Supports youtube.com, youtu.be, and Shorts URLs.</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox} role="alert">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.actions}>
            {result && (
              <button className="btn btn-ghost" onClick={reset}>
                Reset
              </button>
            )}
            <button
              id="calculate-btn"
              className={`btn btn-primary ${styles.calcBtn}`}
              onClick={calculate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Calculating…
                </>
              ) : (
                'Calculate'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div ref={resultsRef} className={styles.results} aria-live="polite">
          {/* Result tabs */}
          <div className={styles.resultTabs}>
            <button
              className={`${styles.resultTab} ${resultTab === 'summary' ? styles.resultTabActive : ''}`}
              onClick={() => setResultTab('summary')}
            >
              Summary
            </button>
            <button
              className={`${styles.resultTab} ${resultTab === 'breakdown' ? styles.resultTabActive : ''}`}
              onClick={() => setResultTab('breakdown')}
            >
              Video Breakdown ({result.videos.length})
            </button>
          </div>

          {resultTab === 'summary' && (
            <div className={styles.summary}>
              {/* Total */}
              <div className={styles.totalCard}>
                <div className={styles.totalLabel}>Total Duration</div>
                <div className={styles.totalValue}>{fmtDuration(result.total_seconds)}</div>
                <div className={styles.totalMeta}>
                  {result.videos.length} video{result.videos.length !== 1 ? 's' : ''} ·{' '}
                  Avg. {fmtCompact(result.average_seconds)} per video
                </div>
              </div>

              {/* Speed breakdown */}
              <div className={styles.speedGrid}>
                {SPEEDS.map(({ key, label }) => {
                  const entry = result.speeds[key]
                  if (!entry) return null
                  const isNormal = key === '1.0'
                  return (
                    <div
                      key={key}
                      className={`${styles.speedCard} ${isNormal ? styles.speedCardNormal : ''}`}
                    >
                      <div className={styles.speedLabel}>{label} speed</div>
                      <div className={styles.speedValue}>{fmtDuration(entry.total_seconds)}</div>
                      {!isNormal && (
                        <div className={styles.speedSave}>
                          Save {fmtCompact(result.total_seconds - entry.total_seconds)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {resultTab === 'breakdown' && (
            <div className={styles.breakdown}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thNum}>#</th>
                      <th>Video</th>
                      <th className={styles.thDur}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.videos.map((video, i) => (
                      <tr key={video.id} className={styles.tableRow}>
                        <td className={styles.tdNum}>{i + 1}</td>
                        <td>
                          <div className={styles.videoCell}>
                            {video.thumbnail && (
                              <div className={styles.thumbWrap}>
                                <Image
                                  src={video.thumbnail}
                                  alt={video.title}
                                  width={80}
                                  height={45}
                                  className={styles.thumb}
                                  unoptimized
                                />
                              </div>
                            )}
                            <div className={styles.videoInfo}>
                              <a
                                href={`https://www.youtube.com/watch?v=${video.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.videoTitle}
                              >
                                {video.title}
                              </a>
                              <span className={styles.channelName}>{video.channel_title}</span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.tdDur}>
                          <span className={styles.durationBadge}>{video.duration_formatted}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
