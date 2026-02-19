"use client";
import { useState, useEffect } from "react";

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'profiles'
    const [matchRequests, setMatchRequests] = useState([]);

    useEffect(() => {
        fetchMatchRequests();
    }, [activeTab]);

    const fetchMatchRequests = async () => {
        try {
            const res = await fetch('/api/admin/match-requests');
            const data = await res.json();
            setMatchRequests(data);
        } catch (error) {
            console.error("Failed to fetch match requests", error);
        }
    };

    const updateMatchStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/admin/match-requests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                fetchMatchRequests();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div>
            {/* Sub-Navigation for Dashboard vs Profile Management */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    Dashboard Stats
                </button>
                <button
                    onClick={() => setActiveTab('profiles')}
                    className={`px-4 py-2 rounded ${activeTab === 'profiles' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                    Manage Profiles
                </button>
            </div>

            {activeTab === "dashboard" && (
                <>
                    <h1 className="mb-8 font-bold text-3xl">Admin Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                    <h2 className="mb-4 font-bold text-xl">Recent Match Requests</h2>
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
                                {matchRequests.map((sub: any) => (
                                    <tr key={sub._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ padding: "1rem" }}>{sub.userMobile}</td>
                                        <td style={{ padding: "1rem" }} title={sub.selectedProfileIds.join(", ")}>
                                            {sub.selectedProfileIds.length > 3
                                                ? `${sub.selectedProfileIds.slice(0, 3).join(", ")} +${sub.selectedProfileIds.length - 3} more`
                                                : sub.selectedProfileIds.join(", ")
                                            }
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            <span style={{
                                                background: sub.status === "pending" ? "#fef3c7" : (sub.status === "contacted" ? "#d1fae5" : "#e5e7eb"),
                                                color: sub.status === "pending" ? "#d97706" : (sub.status === "contacted" ? "#059669" : "#374151"),
                                                padding: "0.25rem 0.5rem", borderRadius: "1rem", fontSize: "0.875rem"
                                            }}>
                                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                            </span>
                                        </td>
                                        <td style={{ padding: "1rem" }}>
                                            {sub.status === 'pending' && (
                                                <button
                                                    onClick={() => updateMatchStatus(sub._id, 'contacted')}
                                                    className="btn"
                                                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem", border: "1px solid #d1d5db", background: "#f3f4f6", cursor: 'pointer' }}
                                                >
                                                    Mark Contacted
                                                </button>
                                            )}
                                            {sub.status === 'contacted' && (
                                                <button
                                                    onClick={() => updateMatchStatus(sub._id, 'resolved')}
                                                    className="btn"
                                                    style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem", border: "1px solid #d1d5db", background: "#f3f4f6", cursor: 'pointer' }}
                                                >
                                                    Mark Resolved
                                                </button>
                                            )}
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
        maritalStatus?: string;
        children?: string;
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
                } else {
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to create");
                }
            }
        } catch (error: any) {
            console.error("Error saving profile", error);
            alert("Failed to save profile: " + error.message);
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
                        <label className="block mb-2">Marital Status</label>
                        <select
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.maritalStatus || 'Unmarried'}
                            onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                        >
                            <option value="Unmarried">Unmarried</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                    {formData.maritalStatus && formData.maritalStatus !== 'Unmarried' && (
                        <div className="mb-4">
                            <label className="block mb-2">Children (Details)</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                value={formData.children || ''}
                                onChange={e => setFormData({ ...formData, children: e.target.value })}
                                placeholder="e.g. 1 Son, 2 Daughters"
                            />
                        </div>
                    )}
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
                                <th style={{ padding: "1rem", borderBottom: "1px solid #e5e7eb" }}>Status</th>
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
                                    <td style={{ padding: "1rem" }}>{profile.maritalStatus || 'Unmarried'}</td>
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
