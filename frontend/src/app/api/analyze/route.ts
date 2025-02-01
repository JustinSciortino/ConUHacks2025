import { NextResponse } from "next/server";
import { google } from "googleapis";

// Initialize the YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// Mock function for sentiment analysis (replace this with your actual AI model)
function analyzeSentiment(comment: string) {
  // This is a placeholder implementation. Replace it with your actual AI model.
  return {
    IsToxic: Math.random() * 100,
    IsAbusive: Math.random() * 100,
    IsThreat: Math.random() * 100,
    IsProvocative: Math.random() * 100,
    IsObscene: Math.random() * 100,
    IsHatespeech: Math.random() * 100,
    IsRacist: Math.random() * 100,
    IsNationalist: Math.random() * 100,
    IsSexist: Math.random() * 100,
    IsHomophobic: Math.random() * 100,
    IsReligiousHate: Math.random() * 100,
    IsRadicalism: Math.random() * 100,
  };
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const videoId = new URL(url).searchParams.get("v");

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch comments from YouTube API
    const response = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId: videoId,
      maxResults: 100, // Adjust as needed
    });

    const comments =
      response.data.items?.map(
        (item) => item.snippet?.topLevelComment?.snippet?.textDisplay
      ) || [];

    // Analyze comments
    const results = comments.reduce((acc, comment) => {
      const analysis = analyzeSentiment(comment || "");
      Object.entries(analysis).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {} as Record<string, number>);

    // Calculate average percentages
    const commentCount = comments.length;
    Object.keys(results).forEach((key) => {
      results[key] = results[key] / commentCount;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error analyzing comments:", error);
    return NextResponse.json(
      { error: "An error occurred while analyzing comments" },
      { status: 500 }
    );
  }
}
