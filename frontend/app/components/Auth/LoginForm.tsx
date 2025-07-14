import {useState} from "react";

export default function LoginForm({onLogin}: { onLogin: (token: string) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        if (!username || !password) {
            setError("Enter username and password.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5156/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            const data = await res.json();
            localStorage.setItem("token", data.token);
            onLogin(data.token);
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-red-400 p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Login</h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mb-4 rounded border"
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full p-2 mb-4 rounded border"
                disabled={loading}
            />
            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            {error && <p className="mt-4 text-red-100">{error}</p>}
        </div>
    );
}
