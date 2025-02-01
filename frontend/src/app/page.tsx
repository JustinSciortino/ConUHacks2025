"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ToxicityResult from "@/components/ToxicityResult";

// Mock function to simulate analysis
const mockAnalyze = () => {
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
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<null | {
    [key: string]: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    // Simulate API call
    setTimeout(() => {
      setResults(mockAnalyze());
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto mt-10">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Youtube className="w-10 h-10 text-red-500 mr-2" />
              <CardTitle className="text-3xl font-bold">
                YouTube Toxicity Detector
              </CardTitle>
            </div>
            <CardDescription>
              Enter a YouTube video URL to analyze the toxicity of its comments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter YouTube video URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="flex-grow"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {loading && (
              <div className="mt-8 text-center">
                <Progress value={33} className="w-full mb-2" />
                <p>Analyzing comments...</p>
              </div>
            )}

            {results && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results).map(([criterion, value]) => (
                    <ToxicityResult
                      key={criterion}
                      criterion={criterion}
                      value={value}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
