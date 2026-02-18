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

    const handleSubmit = () => {
        if (shortlist.length === 0) return alert("Please select at least one profile.");
        setSubmitted(true);
        // Here you would send the data to your backend
        console.log("Submitted IDs:", shortlist);
    };

    if (submitted) {
        return (
            <div className="container section text-center">
                <h1 className="text-primary mb-4">Submission Successful!</h1>
                <p>We have received your preferences. We will contact you shortly.</p>
                <p className="mt-4">Selected IDs: {shortlist.join(", ")}</p>
            </div>
        );
    }

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
                                        <img src={profile.image} alt={profile.id} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
