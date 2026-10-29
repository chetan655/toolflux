import { NextRequest, NextResponse } from 'next/server'
import {
  ApiError,
  buildResult,
  errorResponse,
  extractPlaylistId,
  fetchPlaylistVideoIds,
  fetchVideoDetails,
  getApiKey,
} from '../yt'

export async function GET(req: NextRequest) {
  try {
    const apiKey = getApiKey()
    const url = req.nextUrl.searchParams.get('url') ?? ''
    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
      throw new ApiError(400, 'Could not extract playlist ID from URL.')
    }
    const videoIds = await fetchPlaylistVideoIds(playlistId, apiKey)
    if (videoIds.length === 0) {
      throw new ApiError(404, 'No videos found in playlist.')
    }
    const videos = await fetchVideoDetails(videoIds, apiKey)
    return NextResponse.json(buildResult(videos))
  } catch (err) {
    return errorResponse(err)
  }
}
