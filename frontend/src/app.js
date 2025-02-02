import { useState, useEffect } from "react";
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import "./index.css";

export default function App() {
  const [link, setLink] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!link) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `http://localhost:8000/data?url=${encodeURIComponent(link)}`
      );

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();
      setData(result);
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
            {/* <h2 className="text-4xl font-bold tracking-tight text-white">
              How Toxic is Your{" "}
              <span className="text-white [text-shadow:_-1px_-1px_0_black,1px_-1px_0_black,-1px_1px_0_black,1px_1px_0_black]">
                YouTube#
              </span>{" "}
              Video?
            </h2> */}
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
                onClick={handleSubmit}
                disabled={loading}
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-300 focus:ring-2 focus:ring-white"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/10 p-2 ring-1 ring-white/20">
                <CalendarDaysIcon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">
                Fast Analysis
              </dt>
              <dd className="mt-2 text-base text-red-200">
                Get quick insights from your link within seconds.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/10 p-2 ring-1 ring-white/20">
                <HandRaisedIcon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">
                Reliable Results
              </dt>
              <dd className="mt-2 text-base text-red-200">
                Accurate and detailed analysis with no vulgarity.
              </dd>
            </div>
          </dl>
        </div>

        {error && <p className="mt-4 text-yellow-400">{error}</p>}

        {data && (
          <div className="mt-6 border p-4 rounded bg-white/10 text-white">
            <h3 className="text-lg font-semibold">Response:</h3>
            <pre className="text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
