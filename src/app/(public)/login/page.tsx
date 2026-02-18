"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [passcode, setPasscode] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode === "1234") { // Simple mock passcode
            document.cookie = "auth=true; path=/"; // Simple mock auth
            router.push("/catalog");
        } else {
            alert("Invalid Passcode");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f3f4f6" }}>
            <form onSubmit={handleLogin} style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
                <h1 className="text-center mb-4">Enter Passcode</h1>
                <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Passcode (1234)"
                    style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", border: "1px solid #d1d5db", borderRadius: "0.5rem" }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                    Access Catalog
                </button>
                <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                    <a href="/admin" style={{ color: "var(--primary)", textDecoration: "none" }}>Go to Admin Panel</a>
                </div>
            </form>
        </div>
    );
}
