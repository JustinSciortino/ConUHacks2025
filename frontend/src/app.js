import { useState } from "react";

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
      const response = await fetch("https://your-api-endpoint.com/analyze", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });

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
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <input
        type="text"
        placeholder="Enter a link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Submit"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="border p-4 rounded">
          <pre className="text-sm whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
