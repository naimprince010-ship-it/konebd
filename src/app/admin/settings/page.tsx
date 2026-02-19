"use client";

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function SettingsPage() {
    const [bkashNumber, setBkashNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.bkashNumber) {
                    setBkashNumber(data.bkashNumber);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'bkashNumber', value: bkashNumber }),
            });

            if (res.ok) {
                setMessage('bKash Number updated successfully!');
            } else {
                setMessage('Failed to update settings.');
            }
        } catch (error) {
            setMessage('Error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>

                <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Official bKash Number (Personal/Agent)
                            </label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="017xxxxxxxx"
                                value={bkashNumber}
                                onChange={(e) => setBkashNumber(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This number will be displayed on the payment page for users to send money to.
                            </p>
                        </div>

                        {message && (
                            <div className={`mb-4 p-2 rounded text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving || loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center"
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
