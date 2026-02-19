"use client";

import { useState, useEffect } from 'react';

export default function AdminSharedLinks() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [generatedLink, setGeneratedLink] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfiles();
        fetchHistory();
    }, []);

    const fetchProfiles = async () => {
        const res = await fetch('/api/profiles');
        const data = await res.json();
        setProfiles(data);
        setLoading(false);
    };

    const fetchHistory = async () => {
        const res = await fetch('/api/admin/shared-links');
        const data = await res.json();
        setHistory(data);
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shared Link Generator</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Generator Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Create New Link</h2>

                    <div className="mb-4 h-96 overflow-y-auto border rounded p-2">
                        {loading ? <p>Loading profiles...</p> : profiles.map(profile => (
                            <div key={profile.id} className="flex items-center p-2 hover:bg-gray-50 border-b">
                                <input
                                    type="checkbox"
                                    className="mr-3 h-5 w-5"
                                    checked={selectedIds.includes(profile.id)}
                                    onChange={() => toggleProfile(profile.id)}
                                />
                                <div>
                                    <p className="font-medium">{profile.id}</p>
                                    <p className="text-xs text-gray-500">{profile.age}y, {profile.district}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{selectedIds.length} selectd</span>
                        <button
                            onClick={handleGenerate}
                            disabled={selectedIds.length === 0}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
                        >
                            Generate Link
                        </button>
                    </div>

                    {generatedLink && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm text-green-800 font-medium mb-2">Link Generated Successfully:</p>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 p-2 border rounded text-sm bg-white"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                                    className="bg-green-600 text-white px-3 rounded text-sm hover:bg-green-700"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Links</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {history.map(link => (
                            <div key={link._id} className="border p-4 rounded hover:shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{link.token}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${link.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {link.isPaid ? 'PAID' : 'FREE'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">Profiles: {link.profileIds.length}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Expires: {new Date(link.expiresAt).toLocaleDateString()}
                                </p>
                                <a
                                    href={`/shared/${link.token}`}
                                    target="_blank"
                                    className="text-blue-600 text-sm hover:underline mt-2 block"
                                >
                                    Open Link →
                                </a>
                            </div>
                        ))}
                        {history.length === 0 && <p className="text-gray-500 text-center">No links generated yet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
