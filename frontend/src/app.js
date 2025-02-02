import { useState } from "react";
import "./index.css";
import correlationMatrix from "./correlation_matrix.png";

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
                className="min-w-0 flex-auto rounded-md bg-white/10 px-4 py-3 text-base text-white placeholder:text-red-300 outline-none focus:ring-2 focus:ring-red-300 sm:text-sm/6"
              />
              <button
                onClick={handleFetchComments}
                disabled={loading}
                className="flex-none rounded-md bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow-md hover:bg-red-300 focus:ring-2 focus:ring-white"
              >
                {loading ? "Loading..." : "Analyze Comments"}
              </button>
              {commentsData && (
                <button
                  onClick={handleAnalyzeComments}
                  disabled={loading}
                  className="flex-none rounded-md bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow-md hover:bg-red-300 focus:ring-2 focus:ring-white"
                >
                  {loading ? "Loading..." : "Summarize Comments"}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-yellow-400">{error}</p>}

        {/* Video Thumbnail Section */}
        {videoInfo && videoInfo.thumbnail && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Video Thumbnail:
            </h3>
            <img
              src={videoInfo.thumbnail}
              alt="YouTube Thumbnail"
              className="rounded-md w-full shadow-sm"
            />
          </div>
        )}

        {/* Key Insights & Correlation Map */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Insights */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Key Insights
            </h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
              <li>
                Racism and hate speech have the strongest correlation, meaning
                racist comments are almost always flagged as hateful.
              </li>
              <li>
                If a comment is labeled toxic, there’s a very high chance it’s
                also abusive.
              </li>
              <li>
                YouTube comments containing hate speech are very likely to also
                be racist.
              </li>
              <li>
                Many toxic or provocative YouTube comments also tend to be
                abusive.
              </li>
              <li>
                Abusive comments do not strongly correlate with sexism, meaning
                general abuse and sexist language often appear separately.
              </li>
              <li>
                Obscene YouTube comments have a high likelihood of also being
                toxic and abusive.
              </li>
            </ul>
          </div>

          {/* Correlation Map */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Correlation Map
            </h3>
            <img
              src={correlationMatrix}
              alt="Correlation Matrix"
              className="w-full max-w-md rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
