"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
        confirmPassword: '',
        securityQuestion: '',
        securityAnswer: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const securityQuestions = [
        "আপনার ছোটবেলার নাম কী?",
        "আপনার প্রথম স্কুলের নাম কী?",
        "আপনার প্রিয় বন্ধুর নাম কী?"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("পাসওয়ার্ড দুটি মেলেনি");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            alert("সফলভাবে রেজিস্ট্রেশন হয়েছে! এখন লগিন করুন।");
            router.push('/login');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-6 text-primary">নতুন একাউন্ট খুলুন</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold">মোবাইল নম্বর</label>
                        <input
                            type="tel"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            placeholder="017xxxxxxxx"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">পাসওয়ার্ড</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            placeholder="********"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">কনফার্ম পাসওয়ার্ড</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            placeholder="********"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-bold">সিকিউরিটি প্রশ্ন</label>
                        <select
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            value={formData.securityQuestion}
                            onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                            required
                        >
                            <option value="">একটি প্রশ্ন বেছে নিন</option>
                            {securityQuestions.map((q) => (
                                <option key={q} value={q}>{q}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>পাসওয়ার্ড ভুলে গেলে এটি কাজে লাগবে।</p>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-bold">প্রশ্নটির সঠিক উত্তর</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                            placeholder="যেমন: রাজু"
                            value={formData.securityAnswer}
                            onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'রেজিস্ট্রেশন হচ্ছে...' : 'রেজিস্ট্রেশন'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p>
                        আগেই একাউন্ট আছে? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>লগিন করুন</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
