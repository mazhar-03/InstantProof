"use client";

export default function LogoutButton({onLogout}: { onLogout: () => void }) {
    return (
        <button
            onClick={onLogout}
            className="ml-4 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
        >
            Logout
        </button>
    );
}