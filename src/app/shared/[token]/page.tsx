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
        if (selectedIds.length === 0) return alert('অনুগ্রহ করে প্রোফাইল নির্বাচন করুন');

        const mobile = prompt("আপনার মোবাইল নম্বরটি লিখুন যাতে আমরা যোগাযোগ করতে পারি:");
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
                alert("অনুরোধ জমা হয়েছে! আমরা আপনার সাথে যোগাযোগ করব।");
                setSelectedIds([]);
            } else {
                alert("জমা দিতে ব্যর্থ হয়েছে।");
            }
        } catch (e) {
            alert("অনুরোধ জমা দিতে ত্রুটি হয়েছে");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center p-10">লোড হচ্ছে...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    const { profiles, isPaid, freeLimit } = data;

    return (

        <div className="min-h-screen bg-gray-50 pb-24 max-w-full overflow-x-hidden font-sans">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-12 px-4 shadow-lg mb-10">
                <div className="container mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">বাছাই করা পাত্রী</h1>
                    <p className="text-pink-100 text-lg opacity-90">
                        {isPaid
                            ? 'আপনি এই প্রোফাইলগুলিতে পূর্ণ অ্যাক্সেস পেয়েছেন।'
                            : `${freeLimit} টি প্রোফাইল আনলক করা আছে। বাকিগুলো আনলক না করা পর্যন্ত গোপন থাকবে।`
                        }
                    </p>
                    {!isPaid && (
                        <button
                            onClick={handleUnlock}
                            className="mt-6 bg-white text-pink-600 px-8 py-3 rounded-full font-bold shadow-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ring-2 ring-white/50"
                        >
                            সবগুলো আনলক করুন ({profiles.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {profiles.map((profile: Profile) => (
                        <div
                            key={profile.id}
                            className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group ${profile.isLocked ? 'grayscale-[50%]' : ''}`}
                        >
                            {/* Image Container */}
                            <div className="relative w-full bg-gray-100 aspect-[3/4] overflow-hidden">
                                {profile.image && !profile.isLocked ? (
                                    <Image
                                        src={profile.image}
                                        alt={profile.id}
                                        width={0}
                                        height={0}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ width: '100%', height: 'auto' }}
                                        className="transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                            <span className="text-4xl">{profile.isLocked ? '🔒' : '👤'}</span>
                                        </div>
                                        <span className="font-medium text-gray-500">
                                            {profile.isLocked ? 'ছবি লক করা' : 'ছবি নেই'}
                                        </span>
                                    </div>
                                )}

                                {profile.isLocked && (
                                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
                                        <div className="bg-white/10 p-4 rounded-full mb-3 backdrop-blur-md border border-white/20">
                                            <span className="text-3xl">🔒</span>
                                        </div>
                                        <h3 className="text-white font-bold text-xl mb-1">প্রোফাইল লক করা</h3>
                                        <p className="text-gray-200 text-sm mb-4">বিস্তারিত দেখতে আনলক করুন</p>
                                        <button
                                            onClick={handleUnlock}
                                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:from-pink-600 hover:to-rose-600 transition transform hover:-translate-y-1"
                                        >
                                            এখনই আনলক করুন
                                        </button>
                                    </div>
                                )}

                                {/* Top Badge for ID */}
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10">
                                    ID: {profile.id}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl font-bold text-gray-800">{profile.age} বছর</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-lg font-medium text-gray-600">{profile.height}</span>
                                        </div>
                                        <div className="h-1 w-12 bg-pink-500 rounded-full mb-3"></div>
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 accent-pink-600 cursor-pointer rounded-lg border-2 border-gray-300 focus:ring-pink-500 transition-all"
                                            checked={selectedIds.includes(profile.id)}
                                            onChange={() => toggleSelection(profile.id)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 mt-auto">
                                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-2 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            🎓
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">শিক্ষা</p>
                                            <p className="font-medium text-sm">{profile.education}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-2 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            📍
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">জেলা</p>
                                            <p className="font-medium text-sm">{profile.district}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-50">
                <div className="container mx-auto max-w-lg">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || selectedIds.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                জমা হচ্ছে...
                            </>
                        ) : (
                            <>
                                পছন্দ জমা দিন
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                                    {selectedIds.length}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
