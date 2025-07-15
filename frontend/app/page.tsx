'use client';

import { useState } from "react";
import LoginForm from "@/app/components/Auth/LoginForm";
import RegisterForm from "@/app/components/Auth/RegisterForm";
import LogoutButton from "@/app/components/Auth/LogoutButton";
import FileUploader from "@/app/components/OCR/FileUploader";
import ResultDisplay from "@/app/components/OCR/ResultDisplay";
import { useAuth } from "@/app/hooks/useAuth";

export default function Home() {
    const { token, login, logout } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [showRegister, setShowRegister] = useState(false);

    const handleSubmit = async () => {
        if (!file || !token) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:5156/api/ocr/analyze", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to analyze");

            const data = await res.json();
            setResult(data);
        } catch (e: any) {
            setResult({ error: e.message || "Unknown error" });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
          <main className="min-h-screen flex flex-col items-center justify-center bg-gray-300 p-4">
              {showRegister ? (
                <RegisterForm onRegister={login} />
              ) : (
                <LoginForm onLogin={login} />
              )}
              <button
                onClick={() => setShowRegister(!showRegister)}
                className="mt-4 text-sm text-blue-800 hover:underline cursor-pointer"
              >
                  {showRegister
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
              </button>
          </main>
        );
    }

    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-300 p-4">
          <div className="bg-red-400 p-8 rounded-2xl shadow-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-center text-white flex-1">
                      Instant OCR Proof
                  </h1>
                  <LogoutButton onLogout={logout} />
              </div>

              <FileUploader
                onFileChange={(f) => {
                    setFile(f);
                    setResult(null);
                }}
              />

              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50 mt-4"
              >
                  {loading ? "Analyzing..." : "Upload & Analyze"}
              </button>

              <ResultDisplay result={result} token={token} />
          </div>
      </main>
    );
}
