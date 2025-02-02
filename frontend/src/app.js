import { useState, useEffect } from "react";
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import "./index.css";

export default function App() {
  const [link, setLink] = useState("");
  const [commentsData, setCommentsData] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-700 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              How Toxic is Your{" "}
              <span className="text-black [text-shadow:_-1px_-1px_0_white,1px_-1px_0_white,-1px_1px_0_white,1px_1px_0_white,-1px_0px_0_white,1px_0px_0_white,0px_1px_0_white,0px_-1px_0_white]">
                YouTube
              </span>{" "}
              Video?
            </h2>

            <p className="mt-4 text-lg text-red-200">
              Enter a link below to analyze it using our system.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <input
                type="text"
                placeholder="Enter a link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="min-w-0 flex-auto rounded-md bg-white/10 px-3.5 py-2 text-base text-white placeholder:text-red-300 outline-none focus:ring-2 focus:ring-red-300 sm:text-sm/6"
              />
              <button
                onClick={handleFetchComments}
                disabled={loading}
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-300 focus:ring-2 focus:ring-white"
              >
                {loading ? "Loading..." : "Analyze Comments"}
              </button>
              <button
                onClick={handleFetchVideoInfo}
                disabled={loading}
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-300 focus:ring-2 focus:ring-white"
              >
                {loading ? "Loading..." : "Get Video Info"}
              </button>
              {commentsData && (
                <button
                  onClick={handleAnalyzeComments}
                  disabled={loading}
                  className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-300 focus:ring-2 focus:ring-white"
                >
                  {loading ? "Loading..." : "Summarize Comments"}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-yellow-400">{error}</p>}

        {analysis && (
          <div className="mt-6 p-6 bg-white/20 text-white rounded-lg shadow-lg border border-gray-300 backdrop-blur-md">
            <h3 className="text-xl font-semibold mb-3">Comment Analysis:</h3>
            <p className="text-md leading-relaxed">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
}
