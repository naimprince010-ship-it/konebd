"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminSharedLinks() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [generatedLink, setGeneratedLink] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProfiles();
        fetchHistory();
    }, []);

    const fetchProfiles = async () => {
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

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/admin/shared-links');
            const data = await res.json();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const handleGenerate = async () => {
        if (selectedIds.length === 0) return alert('Select profiles first');

        try {
            const res = await fetch('/api/admin/shared-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileIds: selectedIds })
            });
            const data = await res.json();

            if (res.ok) {
                const url = `${window.location.origin}/shared/${data.token}`;
                setGeneratedLink(url);
                fetchHistory(); // Refresh list
                setSelectedIds([]); // Reset selection
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('Failed to generate link');
        }
    };

    const toggleProfile = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const filteredProfiles = profiles.filter(profile =>
        profile.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (profile.district && profile.district.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Shared Link Generator</h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Generator Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[800px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-700">Select Profiles</h2>
                        <div className="text-sm font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            {selectedIds.length} Selected
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            placeholder="Search by ID or District..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>

                    {/* Profiles Grid */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {filteredProfiles.map(profile => {
                                    const isSelected = selectedIds.includes(profile.id);
                                    return (
                                        <div
                                            key={profile.id}
                                            onClick={() => toggleProfile(profile.id)}
                                            className={`
                                                relative p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center gap-3
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            {/* Checkbox (Visual only) */}
                                            <div className={`
                                                w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}
                                            `}>
                                                {isSelected && <span className="text-white text-xs">✓</span>}
                                            </div>

                                            {/* Avatar */}
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                {profile.image ? (
                                                    <img src={profile.image} alt={profile.id} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-800 text-sm truncate">{profile.id}</p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {profile.age}y • {profile.district}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredProfiles.length === 0 && (
                                    <p className="text-center text-gray-500 col-span-2 py-4">No profiles found.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Generate Button Wrapper */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleGenerate}
                            disabled={selectedIds.length === 0}
                            className={`
                                w-full py-3 rounded-lg font-bold text-white shadow-md transition-transform active:scale-95
                                ${selectedIds.length > 0
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }
                            `}
                        >
                            Generate Sharable Link ({selectedIds.length})
                        </button>
                    </div>

                    {generatedLink && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in-up">
                            <p className="text-sm text-green-800 font-bold mb-2 flex items-center gap-2">
                                ✅ Link Ready!
                            </p>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 p-2 border border-green-200 rounded text-sm bg-white text-gray-600 focus:outline-none"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        alert("Copied!");
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[800px]">
                    <h2 className="text-xl font-bold text-gray-700 mb-6">Recent Links</h2>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-gray-100">
                                    <th className="font-semibold py-3 pl-2">Created</th>
                                    <th className="font-semibold py-3">Profiles</th>
                                    <th className="font-semibold py-3">Status</th>
                                    <th className="font-semibold py-3">Expires</th>
                                    <th className="font-semibold py-3 text-right pr-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {history.map(link => {
                                    const isExpired = new Date() > new Date(link.expiry);
                                    return (
                                        <tr key={link._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 pl-2 text-gray-600">
                                                {new Date(link.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                <span className="bg-gray-100 text-gray-700 py-1 px-2 rounded text-xs font-bold">
                                                    {link.profileIds?.length || link.allowedProfileIds?.length || 0}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                {link.isPaid ? (
                                                    <span className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-xs font-bold">Paid</span>
                                                ) : (
                                                    <span className="bg-slate-100 text-slate-600 py-1 px-2 rounded-full text-xs font-bold">Free</span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span className={`text-xs ${isExpired ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                                    {new Date(link.expiry || link.expiresAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-3 text-right pr-2">
                                                <a
                                                    href={`/shared/${link.token}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 hover:border-blue-400 px-3 py-1 rounded transition-colors"
                                                >
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-400">
                                            No history found. Generate your first link!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
