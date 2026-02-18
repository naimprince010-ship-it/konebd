"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ mobile: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            // Store user data (simple localStorage for MVP)
            localStorage.setItem('konebd_user', JSON.stringify(data.user));

            // Redirect to home or dashboard
            router.push('/');
            // Force reload to update UI state
            setTimeout(() => window.location.reload(), 100);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-6 text-primary">লগিন করুন</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-bold">মোবাইল নম্বর</label>
                        <input
                            type="tel"
                            className="w-full p-3 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                            placeholder="017xxxxxxxx"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-bold">পাসওয়ার্ড</label>
                        <input
                            type="password"
                            className="w-full p-3 border rounded"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                            placeholder="********"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'লগিন হচ্ছে...' : 'লগিন'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="mb-2">
                        <Link href="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none' }}>পাসওয়ার্ড ভুলে গেছেন?</Link>
                    </p>
                    <p>
                        একাউন্ট নেই? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>রেজিস্ট্রেশন করুন</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
