import { useState } from "react"; 
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import "./index.css";

export default function App() {
  const [link, setLink] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!link) return;
    setLoading(true);
    setError(null);
    setVideoData(null);
    setCommentData(null);

    try {
      // Fetch video details (title, channel, thumbnail)
      const videoResponse = await fetch(
        `http://localhost:8000/video-info?link=${encodeURIComponent(link)}`
      );
      if (!videoResponse.ok) throw new Error("Error fetching video details");
      const videoDetails = await videoResponse.json();
      setVideoData(videoDetails);

      // Fetch comment sentiment analysis
      const commentResponse = await fetch(
        `http://localhost:8000/comments?link=${encodeURIComponent(link)}`
      );
      if (!commentResponse.ok) throw new Error("Error fetching comments");
      const commentDetails = await commentResponse.json();
      setCommentData(commentDetails);

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
              How Toxic is Your {" "}
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
                onClick={handleSubmit}
                disabled={loading}
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-300 focus:ring-2 focus:ring-white"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-yellow-400">{error}</p>}

        {videoData && commentData && (
          <div className="mt-6 border p-4 rounded bg-white text-black">
            {/* Comment Sentiment */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold">Comment Sentiment:</h3>
              <p className="text-lg">
                Negative: {commentData.num_negative_comments}% | Positive: {commentData.num_positive_comments}%
              </p>
            </div>

            {/* Centered Thumbnail with Red Background */}
            <div className="flex justify-center items-center bg-red-600 p-4 rounded-md my-8">
              <img src={videoData.thumbnail_url} alt="Thumbnail" className="w-40 h-40 rounded-md" />
            </div>

            {/* Video Info */}
            <div className="text-center mt-24">
              <h3 className="text-lg font-semibold">{videoData.video_title}</h3>
              <p className="text-sm text-red-300">{videoData.channel_name}</p>
            </div>

            {/* Load Detailed Analytics Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Detailed Analytics</h3>

              {/* Negative Comments */}
              <div className="mt-4">
                <h4 className="text-md font-semibold text-red-300">Negative Comments:</h4>
                {commentData.negative_comments.map((comment, index) => (
                  <div key={index} className="text-sm text-black">
                    <p>{comment}</p>
                  </div>
                ))}
              </div>

              {/* Positive Comments */}
              <div className="mt-4">
                <h4 className="text-md font-semibold text-red-300">Positive Comments:</h4>
                {commentData.positive_comments.map((comment, index) => (
                  <div key={index} className="text-sm text-black">
                    <p>{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
