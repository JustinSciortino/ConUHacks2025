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
    <div className="relative isolate overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text--black">
              How Toxic is This Your Youtube Video?
            </h2>
            <p className="mt-4 text-lg text-black-300">
              Enter a link below to analyze it using our system.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <input
                type="text"
                placeholder="Enter a link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-white-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDaysIcon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </div>
              <dt className="mt-4 text-base font-semibold text-black">
                Fast Analysis
              </dt>
              <dd className="mt-2 text-base/7 text-black-400">
                Get quick insights from your link within seconds.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-black/5 p-2 ring-1 ring-black/10">
                <HandRaisedIcon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </div>
              <dt className="mt-4 text-base font-semibold text-black">
                Reliable Results
              </dt>
              <dd className="mt-2 text-base/7 text-black-400">
                Accurate and detailed analysis with no spam.
              </dd>
            </div>
          </dl>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {data && (
          <div className="mt-6 border p-4 rounded bg-white/5 text-white">
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
