"use client";
import { useState, useEffect } from "react";

export default function Catalog() {
    // Define the Profile interface locally for now
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
    const [shortlist, setShortlist] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await fetch('/api/profiles');
                if (!res.ok) throw new Error('Failed to fetch profiles');
                const data = await res.json();

                if (Array.isArray(data)) {
                    setProfiles(data);
                } else {
                    console.error("Data is not an array:", data);
                    setProfiles([]);
                }
            } catch (error) {
                console.error("Failed to fetch profiles", error);
                setProfiles([]); // Ensure profiles is always an array
            } finally {
                setLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    const toggleShortlist = (id: string) => {
        setShortlist((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (shortlist.length === 0) return alert("Please select at least one profile.");

        if (!user || !user.mobile) {
            alert("Please login to submit your selection.");
            return;
        }

        try {
            const res = await fetch('/api/match/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: user.mobile,
                    selectedIds: shortlist
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                alert("Submission failed: " + data.error);
            }
        } catch (error) {
            console.error("Submission error", error);
            alert("Something went wrong. Please try again.");
        }
    };

    if (submitted) {
        return (
            <div className="container section text-center" style={{ padding: "4rem 1rem" }}>
                <div style={{
                    background: "white",
                    padding: "3rem",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    maxWidth: "500px",
                    margin: "0 auto"
                }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                    <h1 className="text-primary mb-4">Request Sent!</h1>
                    <p className="mb-6">We have received your interest in <strong>{shortlist.length}</strong> profiles.</p>
                    <p className="text-muted mb-8">Our team will contact you shortly.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary"
                    >
                        Browse More
                    </button>
                </div>
            </div>
        );
    }

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('konebd_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Sync with server to check for approval
            if (parsedUser.mobile) {
                fetch('/api/auth/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobile: parsedUser.mobile })
                })
                    .then(res => res.json())
                    .then(data => {
                        // Update if status changed
                        if (data.isPremium !== undefined && data.isPremium !== parsedUser.isPremium) {
                            const updatedUser = { ...parsedUser, isPremium: data.isPremium };
                            setUser(updatedUser);
                            localStorage.setItem('konebd_user', JSON.stringify(updatedUser));
                        }
                    })
                    .catch(err => console.error("Failed to sync status", err));
            }
        }
    }, []);

    // ... (rest of useEffect for fetching profiles)

    const isPremium = user?.isPremium;

    return (
        <div className="section" onContextMenu={(e) => e.preventDefault()}> {/* Disable Right Click */}
            <div className="container">
                <h1 className="text-center mb-8">Exclusive Profiles</h1>

                {loading ? (
                    <div className="text-center p-10">Loading profiles...</div>
                ) : (
                    <div className="grid grid-cols-1 grid-cols-3-md">
                        {profiles.map((profile) => (
                            <div key={profile.id} style={{ border: "1px solid #e5e7eb", borderRadius: "1rem", overflow: "hidden", position: "relative" }}>
                                {/* Image Placeholder with Watermark */}
                                <div style={{ height: "250px", background: "#ddd", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                    {profile.image ? (
                                        <>
                                            <img
                                                src={profile.image}
                                                alt={profile.id}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    filter: isPremium ? "none" : "blur(15px)", // Blur if not premium
                                                    transition: "filter 0.3s ease"
                                                }}
                                            />
                                            {!isPremium && (
                                                <div style={{
                                                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    background: "rgba(0,0,0,0.3)", flexDirection: "column"
                                                }}>
                                                    <span style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>🔒 Premium Only</span>
                                                    <a href="/#pricing" className="btn btn-primary" style={{ marginTop: "0.5rem", fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}>Upgrade Now</a>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: "4rem" }}>👩</span>
                                            <div style={{
                                                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-45deg)",
                                                color: "rgba(0,0,0,0.1)", fontSize: "3rem", fontWeight: "bold", pointerEvents: "none", userSelect: "none"
                                            }}>
                                                KoneBD
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div style={{ padding: "1.5rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                        <h3 className="text-primary">{profile.id}</h3>
                                        <button
                                            onClick={() => toggleShortlist(profile.id)}
                                            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: shortlist.includes(profile.id) ? "red" : "gray" }}
                                        >
                                            ♥
                                        </button>
                                    </div>
                                    <p><strong>Age:</strong> {profile.age} | <strong>Height:</strong> {profile.height}</p>
                                    <p><strong>Education:</strong> {profile.education}</p>
                                    <p><strong>Home District:</strong> {profile.district}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ position: "fixed", bottom: "2rem", right: "2rem", background: "white", padding: "1rem", borderRadius: "1rem", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", border: "1px solid #e5e7eb" }}>
                    <p className="mb-2"><strong>Shortlisted:</strong> {shortlist.length}</p>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Submit Selection
                    </button>
                </div>
            </div>
        </div>
    );
}
