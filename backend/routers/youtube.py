"""
YouTube router for ToolFlux API.

Handles:
  - /api/youtube/playlist  — fetch durations for all videos in a playlist
  - /api/youtube/videos    — fetch durations for a list of video IDs / URLs
"""

from __future__ import annotations

import os
import re
from typing import List, Optional
from urllib.parse import parse_qs, urlparse

import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()

YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_api_key() -> str:
    key = os.getenv("YOUTUBE_API_KEY", "")
    if not key:
        raise HTTPException(
            status_code=503,
            detail="YouTube API key not configured. Please set YOUTUBE_API_KEY in the backend .env file.",
        )
    return key


def extract_video_id(url: str) -> Optional[str]:
    """Extract video ID from various YouTube URL formats."""
    patterns = [
        r"(?:v=|youtu\.be/|embed/|shorts/)([A-Za-z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    # Maybe it's already a raw 11-char ID
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", url.strip()):
        return url.strip()
    return None


def extract_playlist_id(url: str) -> Optional[str]:
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    ids = qs.get("list", [])
    return ids[0] if ids else None


def iso8601_to_seconds(duration: str) -> int:
    """Convert ISO 8601 duration (PT1H2M3S) to total seconds."""
    pattern = r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?"
    match = re.match(pattern, duration)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def seconds_to_hms(total: int) -> dict:
    hours = total // 3600
    minutes = (total % 3600) // 60
    seconds = total % 60
    return {
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
        "formatted": f"{hours:02d}:{minutes:02d}:{seconds:02d}",
        "total_seconds": total,
    }


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class VideoInfo(BaseModel):
    id: str
    title: str
    thumbnail: str
    duration_seconds: int
    duration_formatted: str
    channel_title: str


class DurationResult(BaseModel):
    videos: List[VideoInfo]
    total_seconds: int
    total_formatted: str
    average_seconds: int
    average_formatted: str
    speeds: dict  # 1x, 1.25x, 1.5x, 1.75x, 2x


# ---------------------------------------------------------------------------
# Shared fetch logic
# ---------------------------------------------------------------------------

async def fetch_video_details(video_ids: List[str], api_key: str) -> List[VideoInfo]:
    """Fetch video details from YouTube Data API in batches of 50."""
    videos: List[VideoInfo] = []
    batch_size = 50

    async with httpx.AsyncClient(timeout=20.0) as client:
        for i in range(0, len(video_ids), batch_size):
            batch = video_ids[i : i + batch_size]
            ids_param = ",".join(batch)
            resp = await client.get(
                f"{YOUTUBE_API_BASE}/videos",
                params={
                    "part": "contentDetails,snippet",
                    "id": ids_param,
                    "key": api_key,
                },
            )
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"YouTube API error: {resp.text}",
                )
            data = resp.json()
            for item in data.get("items", []):
                vid_id = item["id"]
                snippet = item.get("snippet", {})
                content = item.get("contentDetails", {})
                duration_sec = iso8601_to_seconds(content.get("duration", "PT0S"))
                hms = seconds_to_hms(duration_sec)
                thumbnails = snippet.get("thumbnails", {})
                thumb = (
                    thumbnails.get("medium", {}).get("url")
                    or thumbnails.get("default", {}).get("url")
                    or ""
                )
                videos.append(
                    VideoInfo(
                        id=vid_id,
                        title=snippet.get("title", "Unknown"),
                        thumbnail=thumb,
                        duration_seconds=duration_sec,
                        duration_formatted=hms["formatted"],
                        channel_title=snippet.get("channelTitle", ""),
                    )
                )
    return videos


def build_result(videos: List[VideoInfo]) -> DurationResult:
    total = sum(v.duration_seconds for v in videos)
    avg = total // len(videos) if videos else 0
    speeds = {}
    for speed in [1.0, 1.25, 1.5, 1.75, 2.0]:
        adj = int(total / speed)
        hms = seconds_to_hms(adj)
        speeds[str(speed)] = hms
    return DurationResult(
        videos=videos,
        total_seconds=total,
        total_formatted=seconds_to_hms(total)["formatted"],
        average_seconds=avg,
        average_formatted=seconds_to_hms(avg)["formatted"],
        speeds=speeds,
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/playlist", response_model=DurationResult, summary="Get total duration of a YouTube playlist")
async def get_playlist_duration(
    url: str = Query(..., description="Full YouTube playlist URL"),
):
    """
    Given a YouTube playlist URL, returns the total and per-video duration.
    Also includes watch-time estimates at 1x, 1.25x, 1.5x, 1.75x, and 2x speeds.
    """
    api_key = get_api_key()
    playlist_id = extract_playlist_id(url)
    if not playlist_id:
        raise HTTPException(status_code=400, detail="Could not extract playlist ID from URL.")

    video_ids: List[str] = []
    next_page_token: Optional[str] = None

    async with httpx.AsyncClient(timeout=20.0) as client:
        while True:
            params = {
                "part": "contentDetails",
                "playlistId": playlist_id,
                "maxResults": 50,
                "key": api_key,
            }
            if next_page_token:
                params["pageToken"] = next_page_token

            resp = await client.get(f"{YOUTUBE_API_BASE}/playlistItems", params=params)
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=resp.status_code,
                    detail=f"YouTube API error: {resp.text}",
                )
            data = resp.json()
            for item in data.get("items", []):
                vid_id = item["contentDetails"].get("videoId")
                if vid_id:
                    video_ids.append(vid_id)

            next_page_token = data.get("nextPageToken")
            if not next_page_token:
                break

    if not video_ids:
        raise HTTPException(status_code=404, detail="No videos found in playlist.")

    videos = await fetch_video_details(video_ids, api_key)
    return build_result(videos)


@router.get("/videos", response_model=DurationResult, summary="Get total duration of multiple YouTube videos")
async def get_videos_duration(
    urls: List[str] = Query(..., description="List of YouTube video URLs or video IDs"),
):
    """
    Given a list of YouTube video URLs (or IDs), returns the total and per-video duration.
    """
    api_key = get_api_key()
    video_ids: List[str] = []
    for url in urls:
        vid_id = extract_video_id(url)
        if vid_id:
            video_ids.append(vid_id)

    if not video_ids:
        raise HTTPException(status_code=400, detail="No valid YouTube video URLs provided.")

    video_ids = list(dict.fromkeys(video_ids))  # deduplicate while preserving order
    videos = await fetch_video_details(video_ids, api_key)
    return build_result(videos)
