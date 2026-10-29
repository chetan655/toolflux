// Server-side YouTube Data API logic, shared by the playlist and videos routes.
// Ported from backend/routers/youtube.py — response shape is identical.
import { NextResponse } from 'next/server'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export class ApiError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail)
  }
}

export function errorResponse(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ detail: err.detail }, { status: err.status })
  }
  return NextResponse.json({ detail: 'Internal server error' }, { status: 500 })
}

export function getApiKey(): string {
  const key = process.env.YOUTUBE_API_KEY ?? ''
  if (!key) {
    throw new ApiError(503, 'YouTube API key not configured. Please set YOUTUBE_API_KEY.')
  }
  return key
}

export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)
  if (match) return match[1]
  const trimmed = url.trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed
  return null
}

export function extractPlaylistId(url: string): string | null {
  try {
    return new URL(url).searchParams.get('list')
  } catch {
    return null
  }
}

function iso8601ToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const [, h, m, s] = match
  return (parseInt(h ?? '0') || 0) * 3600 + (parseInt(m ?? '0') || 0) * 60 + (parseInt(s ?? '0') || 0)
}

function secondsToHms(total: number) {
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    hours,
    minutes,
    seconds,
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    total_seconds: total,
  }
}

interface VideoInfo {
  id: string
  title: string
  thumbnail: string
  duration_seconds: number
  duration_formatted: string
  channel_title: string
}

async function ytGet(path: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params)
  const resp = await fetch(`${YOUTUBE_API_BASE}/${path}?${qs}`)
  if (!resp.ok) {
    throw new ApiError(resp.status, `YouTube API error: ${await resp.text()}`)
  }
  return resp.json()
}

export async function fetchVideoDetails(videoIds: string[], apiKey: string): Promise<VideoInfo[]> {
  const videos: VideoInfo[] = []
  for (let i = 0; i < videoIds.length; i += 50) {
    const data = await ytGet('videos', {
      part: 'contentDetails,snippet',
      id: videoIds.slice(i, i + 50).join(','),
      key: apiKey,
    })
    for (const item of data.items ?? []) {
      const snippet = item.snippet ?? {}
      const durationSec = iso8601ToSeconds(item.contentDetails?.duration ?? 'PT0S')
      const thumbnails = snippet.thumbnails ?? {}
      videos.push({
        id: item.id,
        title: snippet.title ?? 'Unknown',
        thumbnail: thumbnails.medium?.url ?? thumbnails.default?.url ?? '',
        duration_seconds: durationSec,
        duration_formatted: secondsToHms(durationSec).formatted,
        channel_title: snippet.channelTitle ?? '',
      })
    }
  }
  return videos
}

export async function fetchPlaylistVideoIds(playlistId: string, apiKey: string): Promise<string[]> {
  const videoIds: string[] = []
  let pageToken: string | undefined
  do {
    const params: Record<string, string> = {
      part: 'contentDetails',
      playlistId,
      maxResults: '50',
      key: apiKey,
    }
    if (pageToken) params.pageToken = pageToken
    const data = await ytGet('playlistItems', params)
    for (const item of data.items ?? []) {
      const id = item.contentDetails?.videoId
      if (id) videoIds.push(id)
    }
    pageToken = data.nextPageToken
  } while (pageToken)
  return videoIds
}

export function buildResult(videos: VideoInfo[]) {
  const total = videos.reduce((sum, v) => sum + v.duration_seconds, 0)
  const avg = videos.length ? Math.floor(total / videos.length) : 0
  const speeds: Record<string, ReturnType<typeof secondsToHms>> = {}
  for (const speed of ['1.0', '1.25', '1.5', '1.75', '2.0']) {
    speeds[speed] = secondsToHms(Math.floor(total / parseFloat(speed)))
  }
  return {
    videos,
    total_seconds: total,
    total_formatted: secondsToHms(total).formatted,
    average_seconds: avg,
    average_formatted: secondsToHms(avg).formatted,
    speeds,
  }
}
