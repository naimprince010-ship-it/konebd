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
        <div className="container mx-auto p-4 pb-24">
            <header className="mb-8 text-center max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">Curated Matches</h1>
                <p className="text-gray-600">
                    {isPaid ? 'You have full access to these profiles.' : `${freeLimit} profiles are unlocked. The rest are hidden until unlocked.`}
                </p>
                {!isPaid && (
                    <button
                        onClick={handleUnlock}
                        className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-pulse hover:bg-pink-700 transition"
                    >
                        Unlock All ({profiles.length})
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-sm mx-auto sm:max-w-none">
                {profiles.map((profile: Profile) => (
                    <div key={profile.id} className={`bg-white rounded-lg shadow-md overflow-hidden relative border border-gray-100 flex flex-col ${profile.isLocked ? 'opacity-90' : ''}`}>
                        <div className="relative aspect-[4/5] w-full bg-gray-100">
                            {profile.image && !profile.isLocked ? (
                                <img
                                    src={profile.image}
                                    alt={profile.id}
                                    className="object-cover object-top w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                                    <span className="text-4xl mb-2">
                                        {profile.isLocked ? '🔒' : '👤'}
                                    </span>
                                    <span className="font-medium text-sm">
                                        {profile.isLocked ? 'Image Locked' : 'No Image Available'}
                                    </span>
                                </div>
                            )}

                            {profile.isLocked && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                    <button onClick={handleUnlock} className="bg-white/90 text-pink-600 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-white transition">
                                        Unlock to View
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{profile.id}</h3>
                                    <p className="text-sm text-gray-500">{profile.age} yrs • {profile.height}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 accent-pink-600 cursor-pointer"
                                    checked={selectedIds.includes(profile.id)}
                                    onChange={() => toggleSelection(profile.id)}
                                />
                            </div>

                            <div className="text-sm text-gray-700 space-y-1 mt-auto pt-2 border-t border-gray-100">
                                <p><span className="font-semibold text-gray-500">Education:</span> {profile.education}</p>
                                <p><span className="font-semibold text-gray-500">District:</span> {profile.district}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div className="container mx-auto max-w-lg">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || selectedIds.length === 0}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition hover:bg-blue-700 shadow-md transform active:scale-[0.98]"
                    >
                        {submitting ? 'Submitting...' : `Submit Selection (${selectedIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
