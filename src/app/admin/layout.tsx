"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const storedAdmin = localStorage.getItem("konebd_admin");
        if (storedAdmin === "true") {
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            setIsAdmin(true);
            localStorage.setItem("konebd_admin", "true");
        } else {
            alert("Invalid Admin Password");
        }
    };

    const handleLogout = () => {
        setIsAdmin(false);
        localStorage.removeItem("konebd_admin");
    };

    if (loading) return null;

    if (!isAdmin) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#111827", color: "white" }}>
                <form onSubmit={handleLogin} style={{ background: "#1f2937", padding: "2rem", borderRadius: "1rem" }}>
                    <h1 className="text-center mb-4">Admin Panel</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Admin Password"
                        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "0.25rem", border: "none" }}
                    />
                    <button className="btn btn-primary" style={{ width: "100%" }}>Login</button>
                    <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                        <Link href="/login" style={{ color: "#9ca3af", textDecoration: "none" }}>Go to User Login</Link>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <div style={{ width: "250px", background: "#1f2937", color: "white", padding: "2rem" }}>
                <h2 className="mb-8">KoneBd Admin</h2>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ marginBottom: "1rem" }}>
                        <Link
                            href="/admin"
                            style={{
                                display: 'block',
                                color: pathname === "/admin" ? "var(--primary)" : "white",
                                fontSize: "1.1rem",
                                textDecoration: "none"
                            }}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        {/* Note: Profile Management is currently a tab inside the Dashboard page. 
                             We link to Dashboard for now, or could split it out ideally. 
                             For now, let's keep the link but maybe add a query param or just rely on the user navigating.
                             Actually, let's remove the specific "Profile Management" link if it's just a tab on Dashboard, 
                             OR link to it if we refactor. 
                             Let's Keep it pointing to /admin for now, as the user can toggle tabs there.
                          */}
                        <Link // Pointing to Admin root where usage of tabs exists
                            href="/admin"
                            style={{
                                display: 'block',
                                color: "white",
                                fontSize: "1.1rem",
                                textDecoration: "none"
                            }}
                        >
                            Profile Management
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        <Link
                            href="/admin/shared-links"
                            style={{
                                display: 'block',
                                color: pathname === "/admin/shared-links" ? "var(--primary)" : "white",
                                fontSize: "1.1rem",
                                textDecoration: "none"
                            }}
                        >
                            Shared Links
                        </Link>
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        <Link
                            href="/admin/payments"
                            style={{
                                display: 'block',
                                color: pathname === "/admin/payments" ? "var(--primary)" : "white",
                                fontSize: "1.1rem",
                                textDecoration: "none"
                            }}
                        >
                            Payments
                        </Link>
                    </li>
                    <li style={{ marginTop: "2rem", borderTop: "1px solid #374151", paddingTop: "1rem" }}>
                        <Link href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "1rem", display: "block", marginBottom: "1rem" }}>
                            ← Back to Home
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem", textAlign: "left", padding: 0 }}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: "2rem", background: "#f3f4f6" }}>
                {children}
            </div>
        </div>
    );
}
