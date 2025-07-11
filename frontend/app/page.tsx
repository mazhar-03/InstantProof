"use client";

import { useState } from "react";

type OCRResult = {
  extracted_text: string;
  metadata: Record<string, any>;
  filename: string;
  error?: string; // added optional error for catch block
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      console.log("Selected file:", e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log("Upload button clicked");
    if (!file) {
      console.log("No file selected");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    console.log("Sending file:", file);

    try {
      const res = await fetch("http://localhost:5085/api/ocr/analyze", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      const data: OCRResult = await res.json();
      console.log("Response data:", data);
      setResult(data);
    } catch (error) {
      console.error("Upload error (full):", error);

      if (error instanceof Error) {
        setResult({ extracted_text: "", metadata: {}, filename: "", error: error.message });
      } else {
        setResult({ extracted_text: "", metadata: {}, filename: "", error: "Unknown upload error" });
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
      <div className="bg-red-400 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Instant OCR Proof</h1>

        <input type="file" onChange={handleFileChange} />

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50 mt-4"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Result:</h2>
            <pre className="bg-black p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
