"use client";
import { useState, useEffect } from "react";

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'profiles'
    const [loading, setLoading] = useState(true); // Add loading state to prevent flash

    useEffect(() => {
        // Check local storage on mount
        const storedAdmin = localStorage.getItem("konebd_admin");
        if (storedAdmin === "true") {
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    // Mock User Submissions (In a real app, this would come from a database)
    const submissions = [
        { id: 1, user: "01711223344", selected: ["K-102", "K-105"], status: "Pending" },
        { id: 2, user: "01855667788", selected: ["K-101"], status: "Contacted" },
    ];

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

    if (loading) return null; // Or a loading spinner

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
                        <a href="/login" style={{ color: "#9ca3af", textDecoration: "none" }}>Go to User Login</a>
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
                        <button
                            onClick={() => setActiveTab("dashboard")}
                            style={{ background: "none", border: "none", color: activeTab === "dashboard" ? "var(--primary)" : "white", cursor: "pointer", fontSize: "1.1rem" }}
                        >
                            Dashboard
                        </button>
                    </li>
                    <li style={{ marginBottom: "1rem" }}>
                        <button
                            onClick={() => setActiveTab("profiles")}
                            style={{ background: "none", border: "none", color: activeTab === "profiles" ? "var(--primary)" : "white", cursor: "pointer", fontSize: "1.1rem" }}
                        >
                            Profile Management
                        </button>
                    </button>
                </li>
                <li style={{ marginBottom: "1rem" }}>
                    <a href="/admin/payments" style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1.1rem", textDecoration: "none" }}>
                        Payments
                    </a>
                </li>
                <li style={{ marginTop: "2rem", borderTop: "1px solid #374151", paddingTop: "1rem" }}>
                    <a href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "1rem", display: "block", marginBottom: "1rem" }}>
                        ← Back to Home
                    </a>
                    <button
                        onClick={handleLogout}
                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem", textAlign: "left", padding: 0 }}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>

            {/* Main Content */ }
    <div style={{ flex: 1, padding: "2rem", background: "#f3f4f6" }}>
        {activeTab === "dashboard" && (
            <>
                <h1 className="mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 grid-cols-3-md mb-8">
                    <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                        <h3>Total Users</h3>
                        <p style={{ fontSize: "2rem", color: "var(--primary)", fontWeight: "bold" }}>152</p>
                    </div>
                    <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                        <h3>New Submissions</h3>
                        <p style={{ fontSize: "2rem", color: "var(--primary)", fontWeight: "bold" }}>5</p>
                    </div>
                    <div style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                        <h3>Revenue (This Month)</h3>
                        <p style={{ fontSize: "2rem", color: "var(--primary)", fontWeight: "bold" }}>12,500 TK</p>
                    </div>
                </div>

                <h2 className="mb-4">Recent Match Requests</h2>
                <div style={{ background: "white", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ background: "#f9fafb" }}>
                            <tr>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>User Phone</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Selected IDs</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Status</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: "1rem" }}>{sub.user}</td>
                                    <td style={{ padding: "1rem" }}>{sub.selected.join(", ")}</td>
                                    <td style={{ padding: "1rem" }}>
                                        <span style={{
                                            background: sub.status === "Pending" ? "#fef3c7" : "#d1fae5",
                                            color: sub.status === "Pending" ? "#d97706" : "#059669",
                                            padding: "0.25rem 0.5rem", borderRadius: "1rem", fontSize: "0.875rem"
                                        }}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1rem" }}>
                                        <button className="btn" style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem", border: "1px solid #d1d5db" }}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {activeTab === "profiles" && <ProfileManager />}
    </div>
        </div >
    );
}

function ProfileManager() {
    interface Profile {
        id: string;
        age: number;
        height: string;
        education: string;
        district: string;
        image?: string;
    }

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Profile>>({});

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/profiles');
            const data = await res.json();
            setProfiles(data);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this profile?")) return;

        try {
            const res = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProfiles(prev => prev.filter(p => p.id !== id));
            } else {
                alert("Failed to delete profile");
            }
        } catch (error) {
            console.error("Error deleting profile", error);
        }
    };

    const handleEdit = (profile: Profile) => {
        setEditingProfile(profile);
        setFormData(profile);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingProfile(null);
        setFormData({});
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProfile) {
                // Update
                const res = await fetch(`/api/profiles/${editingProfile.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    const updatedProfile = await res.json();
                    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
                    setIsFormOpen(false);
                }
            } else {
                // Create
                const res = await fetch('/api/profiles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    const newProfile = await res.json();
                    setProfiles(prev => [...prev, newProfile]);
                    setIsFormOpen(false);
                }
            }
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Failed to save profile");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (isFormOpen) {
        return (
            <div style={{ background: "white", padding: "2rem", borderRadius: "1rem" }}>
                <h2 className="mb-4">{editingProfile ? "Edit Profile" : "Add New Profile"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Profile ID (Optional for new)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.id || ''}
                            onChange={e => setFormData({ ...formData, id: e.target.value })}
                            disabled={!!editingProfile}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Age</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.age || ''}
                            onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Height</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.height || ''}
                            onChange={e => setFormData({ ...formData, height: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Education</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.education || ''}
                            onChange={e => setFormData({ ...formData, education: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">District</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.district || ''}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                        />
                        {formData.image && (
                            <div style={{ marginTop: '1rem' }}>
                                <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button type="submit" className="btn btn-primary">Save Profile</button>
                        <button type="button" className="btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Profile Management</h1>
                <button className="btn btn-primary" onClick={handleAddNew}>+ Add Profile</button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ background: "white", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead style={{ background: "#f9fafb" }}>
                            <tr>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>ID</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Image</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Age</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>District</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Education</th>
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (
                                <tr key={profile.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: "1rem", fontWeight: "bold" }}>{profile.id}</td>
                                    <td style={{ padding: "1rem" }}>
                                        {profile.image ? (
                                            <img src={profile.image} alt={profile.id} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                👤
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: "1rem" }}>{profile.age}</td>
                                    <td style={{ padding: "1rem" }}>{profile.district}</td>
                                    <td style={{ padding: "1rem" }}>{profile.education}</td>
                                    <td style={{ padding: "1rem" }}>
                                        <button
                                            onClick={() => handleEdit(profile)}
                                            style={{ marginRight: "0.5rem", color: "blue", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(profile.id)}
                                            style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
