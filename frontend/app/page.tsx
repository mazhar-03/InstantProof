"use client";

import { useState, useEffect } from "react";

type OCRResult = {
  extracted_text: string;
  metadata: Record<string, any>;
  filename: string;
  abuse_flags?: any;
  pdf_path?: string;
  error?: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);

  // Load token from localStorage initially
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    setLoginError("");
    if (!username || !password) {
      setLoginError("Please enter username and password");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("http://localhost:5156/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUsername("");
      setPassword("");
      setLoginError("");
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setResult(null);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file.");
    if (!token) return alert("Please login first.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5156/api/ocr/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data: OCRResult = await res.json();
      setResult(data);
    } catch (error) {
      if (error instanceof Error) {
        setResult({ extracted_text: "", metadata: {}, filename: "", error: error.message });
      } else {
        setResult({ extracted_text: "", metadata: {}, filename: "", error: "Unknown error" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    // Show login form if not logged in
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
        <div className="bg-red-400 p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">🔐 Login</h1>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 rounded border"
            disabled={loginLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 rounded border"
            disabled={loginLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />

          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>

          {loginError && <p className="mt-4 text-red-100">{loginError}</p>}
        </div>
      </main>
    );
  }

  // Logged in UI
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
      <div className="bg-red-400 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center text-white flex-1">Instant OCR Proof</h1>
          <button
            onClick={handleLogout}
            className="ml-4 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>

        <input type="file" onChange={handleFileChange} disabled={loading} />

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
            {result.error ? (
              <div className="text-red-100 bg-red-700 p-4 rounded">{result.error}</div>
            ) : (
              <>
                <pre className="bg-black p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>

                {result.pdf_path && (
                  <a
                    href={`http://localhost:8001/download/${encodeURIComponent(result.pdf_path)}`}
                    download
                    className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    📄 Download PDF Report
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
