"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Profile {
    id: string;
    // ... other fields
    image?: string;
    age: number;
    height: string;
    education: string;
    district: string;
    mobile?: string;
    isLocked: boolean;
}

export default function SharedLinkPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/shared/${token}`);
                if (!res.ok) {
                    if (res.status === 410) throw new Error('Link Expired');
                    throw new Error('Link Not Found');
                }
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchData();
    }, [token]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleUnlock = () => {
        router.push(`/shared/${token}/payment`);
    };

    const handleSubmit = async () => {
        if (selectedIds.length === 0) return alert('Please select profiles');

        const mobile = prompt("Enter your mobile number to contact you:");
        if (!mobile) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/shared/match-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedProfileIds: selectedIds,
                    userMobile: mobile,
                    sharedLinkToken: token
                })
            });

            if (res.ok) {
                alert("Request Submitted! We will contact you.");
                setSelectedIds([]);
            } else {
                alert("Failed to submit.");
            }
        } catch (e) {
            alert("Error submitting request");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    const { profiles, isPaid, freeLimit } = data;

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <header className="mb-6 text-center">
                <h1 className="text-2xl font-bold mb-2">Curated Matches</h1>
                <p className="text-sm text-gray-500">
                    {isPaid ? 'You have full access' : `${freeLimit} profiles unlocked. Pay to view all.`}
                </p>
                {!isPaid && (
                    <button
                        onClick={handleUnlock}
                        className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-pulse"
                    >
                        Unlock All ({profiles.length})
                    </button>
                )}
            </header>

            <div className="space-y-4">
                {profiles.map((profile: Profile) => (
                    <div key={profile.id} className={`bg-white rounded-lg shadow overflow-hidden relative ${profile.isLocked ? 'opacity-75' : ''}`}>
                        <div className="relative h-64 w-full">
                            {profile.image && !profile.isLocked ? (
                                <img
                                    src={profile.image}
                                    alt={profile.id}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 font-bold text-xl">
                                        {profile.isLocked ? 'LOCKED' : 'No Image'}
                                    </span>
                                </div>
                            )}

                            {profile.isLocked && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                    <button onClick={handleUnlock} className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold">
                                        🔒 Unlock to View
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{profile.id}</h3>
                                    <p className="text-gray-600">{profile.age} yrs, {profile.height}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 accent-pink-600"
                                    checked={selectedIds.includes(profile.id)}
                                    onChange={() => toggleSelection(profile.id)}
                                />
                            </div>

                            <div className="text-sm text-gray-700 space-y-1">
                                <p><strong>Education:</strong> {profile.education}</p>
                                <p><strong>District:</strong> {profile.district}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
                <div className="container mx-auto max-w-lg">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || selectedIds.length === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300"
                    >
                        {submitting ? 'Submitting...' : `Submit Selection (${selectedIds.length})`}
                    </button>
                </div>
            </div>
            <div className="h-20"></div> {/* Spacer for fixed footer */}
        </div>
    );
}
