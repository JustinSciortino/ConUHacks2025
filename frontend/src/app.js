// src/App.jsx
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

  // Fetch comments data from the backend
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

  // Fetch video info data from the backend
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

  // Calculate positive percentage for the progress bar (if available)
  let positivePercent = 0;
  if (commentsData && commentsData.total_comments) {
    positivePercent =
      (commentsData.num_positive_comments / commentsData.total_comments) * 100;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* === Section 1: YouTube Link Input === */}
      <section className="w-full max-w-screen-xl mx-auto my-8 px-8 bg-red-600 rounded-lg shadow-lg py-12">
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
            disabled={loading} // Disable while loading
            className="flex-1 rounded-md bg-white/10 px-4 py-3 text-base text-white placeholder:text-red-300 outline-none focus:ring-2 focus:ring-red-300"
          />
          <button
            onClick={() => {
              // Fire both endpoints when the button is clicked
              handleFetchComments();
              handleFetchVideoInfo();
            }}
            disabled={loading}
            className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-red-700 shadow hover:bg-red-300 focus:ring-2 focus:ring-white"
          >
            {loading ? "Loading..." : "Analyze Comments"}
          </button>
        </div>
        {error && <p className="mt-4 text-yellow-300">{error}</p>}
      </section>

      {/* === Section 2: Video Info & Comments Breakdown === */}
      {videoInfo && commentsData && (
        <section className="w-full max-w-screen-xl mx-auto my-8 px-8 bg-white rounded-lg shadow-lg py-6">
          {/* Video Info Header */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Left: Video Thumbnail */}
            <div className="md:w-1/3">
              <img
                src={videoInfo.thumbnail_url}
                alt="Video Thumbnail"
                className="w-full h-auto rounded-md object-cover"
              />
            </div>
            {/* Right: Video Title (Channel profile image removed) */}
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold">{videoInfo.video_title}</h2>
              {/* Optionally you can include the channel name here */}
              <p className="text-gray-700 mt-2">{videoInfo.channel_name}</p>
            </div>
          </div>

          {/* Horizontal Bar with Comments Breakdown */}
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">
                Positive comments: {commentsData.num_positive_comments}
              </span>
              <span className="font-semibold">
                Negative comments: {commentsData.num_negative_comments}
              </span>
            </div>
            <div className="w-full bg-gray-300 h-4 rounded">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${positivePercent}%` }}
              ></div>
            </div>
          </div>

          {/* Catalogues for Top Positive & Negative Comments */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Positive Comments */}
            <div>
              <h3 className="font-bold text-xl mb-2">Top Positive Comments</h3>
              {commentsData.positive_comments &&
              commentsData.positive_comments.length > 0 ? (
                <ul className="list-disc ml-4">
                  {commentsData.positive_comments.map((comment, idx) => (
                    <li key={idx} className="mt-1 text-sm text-gray-800">
                      {comment}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No positive comments found.
                </p>
              )}
            </div>

            {/* Top Negative Comments */}
            <div>
              <h3 className="font-bold text-xl mb-2">Top Negative Comments</h3>
              {commentsData.negative_comments &&
              commentsData.negative_comments.length > 0 ? (
                <ul className="list-disc ml-4">
                  {commentsData.negative_comments.map((comment, idx) => (
                    <li key={idx} className="mt-1 text-sm text-gray-800">
                      {comment}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  No negative comments found.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* === Section 3: Data Analytics === */}
      <section className="w-full max-w-screen-xl mx-auto my-8 px-8 bg-gray-100 rounded-lg shadow-lg py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side – Key Insights */}
          <div className="md:w-1/2">
            <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
            <ul className="list-disc pl-5 text-gray-700 text-sm">
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
          {/* Right Side – Correlation Map */}
          <div className="md:w-1/2">
            <h3 className="text-3xl font-semibold mb-4">Correlation Map</h3>
            <div className="bg-white p-4 rounded-lg shadow-inner h-64 flex items-center justify-center">
              <img
                src={correlationMatrix}
                alt="Correlation Matrix"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
