"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function DemoProfiles() {
    interface Profile {
        id: string;
        age: number;
        height: string;
        education: string;
        district: string;
        image?: string;
    }

    const [profiles, setProfiles] = useState<Profile[]>([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await fetch('/api/profiles');
                const data = await res.json();
                setProfiles(data.slice(0, 8)); // Valid for now as we just want the first 8
            } catch (error) {
                console.error("Failed to fetch profiles", error);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <section className="section" style={{ background: '#f9fafb' }}>
            <div className="container">
                <h2 className="text-center mb-4" style={{ fontSize: '2.25rem' }}>প্রিমিয়াম প্রোফাইল</h2>
                <p className="text-center mb-8" style={{ color: 'var(--muted)' }}>শত শত ভেরিফাইড প্রোফাইলে অ্যাক্সেস পান।</p>

                <div className="grid grid-cols-1 grid-cols-3-md" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {profiles.map((profile) => (
                        <div key={profile.id} style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <div style={{
                                height: '200px',
                                background: '#ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Simulated blurred image or real image */}
                                {profile.image ? (
                                    <img src={profile.image} alt={profile.id} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px)' }} />
                                ) : (
                                    <span style={{ filter: 'blur(4px)', fontSize: '3rem' }}>👩</span>
                                )}
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                                }}>
                                    শুধুমাত্র সদস্যদের জন্য
                                </div>
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{profile.id}</div>
                                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                    {profile.age} বছর, {profile.height}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.25rem' }}>
                                    {profile.education}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: '2rem' }}>
                    <Link href="#pricing" className="btn btn-primary">সম্পূর্ণ প্রোফাইল দেখতে জয়েন করুন</Link>
                </div>
            </div>
        </section>
    );
}
