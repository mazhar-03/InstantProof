import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //password validation
  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pw)) return "Password must contain at least one uppercase letter.";
    if (!/\d/.test(pw)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
      return "Password must contain at least one special character.";
    return null; // valid
  }
  const handleRegister = async () => {
    setError("");
    setSuccess("");
    if (!username || !password) {
      setError("Enter username and password.");
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5156/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Registration failed");
      }

      setSuccess("User registered. Please log in.");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-400 p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Register
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        className="w-full p-2 mb-4 rounded border"
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError("");
          setSuccess("");
        }}
        onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        className="w-full p-2 mb-4 rounded border"
        disabled={loading}
      />
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
      >
        {loading ? "Registering..." : "Register"}
      </button>
      {error && <p className="mt-4 text-red-100">{error}</p>}
      {success && <p className="mt-4 text-green-100">{success}</p>}
    </div>
  );
}
