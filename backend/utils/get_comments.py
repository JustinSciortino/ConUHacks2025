import os
import requests
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs
from googleapiclient.discovery import build

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def get_video_id(youtube_url: str) -> str:
    """
    Extract the YouTube video ID from a typical watch URL.
    E.g. "https://www.youtube.com/watch?v=abcdef12345" -> "abcdef12345"
    """
    parsed_url = urlparse(youtube_url)
    query_params = parse_qs(parsed_url.query)
    video_id = query_params.get('v')
    if video_id:
        return video_id[0]
    else:
        raise ValueError("Invalid YouTube URL. Could not extract video ID.")

def fetch_youtube_comments(video_url: str) -> list:
    """
    Fetches all comments (including replies) from a given YouTube video URL
    using the YouTube Data API v3.
    Returns a list of comment strings.
    """
    if not YOUTUBE_API_KEY:
        raise ValueError("YOUTUBE_API_KEY not found. Make sure it's set in the .env file.")

    video_id = get_video_id(video_url)
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY, cache_discovery=False)
    all_comments = []

    request = youtube.commentThreads().list(
        part="snippet,replies",
        videoId=video_id,
        maxResults=100,   
        textFormat="plainText"
    )

    while request is not None:
        response = request.execute()

        for item in response.get('items', []):
            top_comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
            all_comments.append(top_comment)

            if 'replies' in item:
                for reply in item['replies']['comments']:
                    reply_text = reply['snippet']['textDisplay']
                    all_comments.append(reply_text)

        request = youtube.commentThreads().list_next(request, response)

    return all_comments