import { NextRequest, NextResponse } from 'next/server'
import {
  ApiError,
  buildResult,
  errorResponse,
  extractVideoId,
  fetchVideoDetails,
  getApiKey,
} from '../yt'

export async function GET(req: NextRequest) {
  try {
    const apiKey = getApiKey()
    const urls = req.nextUrl.searchParams.getAll('urls')
    const videoIds = urls
      .map(extractVideoId)
      .filter((id): id is string => id !== null)
    if (videoIds.length === 0) {
      throw new ApiError(400, 'No valid YouTube video URLs provided.')
    }
    const unique = [...new Set(videoIds)]
    const videos = await fetchVideoDetails(unique, apiKey)
    return NextResponse.json(buildResult(videos))
  } catch (err) {
    return errorResponse(err)
  }
}
