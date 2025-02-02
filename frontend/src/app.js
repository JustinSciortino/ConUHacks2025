// src/App.jsx
import { useState } from "react";
import "./index.css";

export default function App() {
  const [link, setLink] = useState("");
  const [commentsData, setCommentsData] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetches comments and returns early if link is empty.
  const handleFetchComments = async () => {
    if (!link) return;
    setLoading(true);
    setError(null);
    setCommentsData(null);
    setAnalysis(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/comments?link=${encodeURIComponent(link)}`
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      setCommentsData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchVideoInfo = async () => {
    if (!link) return;
    setLoading(true);
    setError(null);
    setVideoInfo(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/video-info?link=${encodeURIComponent(link)}`
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      setVideoInfo(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeComments = async () => {
    if (!commentsData || !commentsData.negative_comments) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentsData.negative_comments.slice(0, 3)),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section 1: YouTube Link Input */}
      <section
        className="w-full max-w-screen-xl mx-auto my-8 
                   px-8 bg-red-600 rounded-lg shadow-lg
                   /* Change vertical spacing here: */
                   py-12" 
      >
        <h2 className="text-4xl font-bold text-white">
          How Toxic is Your{" "}
          <span className="text-black shadow-[1px_1px_0_#fff]">YouTube</span>{" "}
          Video?
        </h2>
        <p className="mt-2 text-xl text-red-200">
          Enter a link below to analyze it using our system.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter a YouTube link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="flex-1 rounded-md bg-white/10 px-4 py-3 text-base text-white placeholder:text-red-300 outline-none focus:ring-2 focus:ring-red-300"
          />
          <button
            onClick={() => {
              handleFetchComments();
              handleFetchVideoInfo();
            }}
            disabled={loading}
            className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow hover:bg-red-300 focus:ring-2 focus:ring-white"
          >
            {loading ? "Loading..." : "Analyze"}
          </button>
          {commentsData && (
            <button
              onClick={handleAnalyzeComments}
              disabled={loading}
              className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow hover:bg-red-300 focus:ring-2 focus:ring-white"
            >
              {loading ? "Loading..." : "Summarize Comments"}
            </button>
          )}
        </div>
        {error && <p className="mt-4 text-yellow-300">{error}</p>}
      </section>

      {/* Section 2: YouTube Thumbnail (hidden until videoInfo exists) */}
      {videoInfo && videoInfo.thumbnail && (
        <section
          className="w-full max-w-screen-xl mx-auto my-8 
                     px-8 bg-white rounded-lg shadow-lg
                     /* Adjust vertical padding with py-6, py-8, etc.: */
                     py-6"
        >
          <h3 className="text-3xl font-semibold mb-4">Video Thumbnail</h3>
          <img
            src={videoInfo.thumbnail}
            alt="YouTube Thumbnail"
            className="w-full rounded-md"
          />
        </section>
      )}

      {/* Section 3: Data Analytics (always visible) */}
      <section
        className="w-full max-w-screen-xl mx-auto my-8 
                   px-8 bg-gray-100 rounded-lg shadow-lg
                   /* Adjust vertical padding as needed: */
                   py-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side – Bullet Points */}
          <div className="md:w-1/2">
            <h3 className="text-3xl font-semibold mb-4">Key Insights</h3>
            <ul className="list-disc pl-5 text-gray-800 text-lg">
              <li>
                Toxicity Score:{" "}
                {analysis ? parseFloat(analysis).toFixed(2) : "N/A"}
              </li>
              <li>
                Positive/Negative Ratio:{" "}
                {commentsData
                  ? commentsData.positive_negative_ratio || "N/A"
                  : "N/A"}
              </li>
              <li>Viewer Engagement: TBD</li>
            </ul>
          </div>
          {/* Right Side – Correlation Map */}
          <div className="md:w-1/2">
            <h3 className="text-3xl font-semibold mb-4">Correlation Map</h3>
            <div className="bg-white p-4 rounded-lg shadow-inner h-64 flex items-center justify-center">
              {/* Replace this placeholder with your correlation map component */}
              <p className="text-gray-500">Correlation Map Placeholder</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
