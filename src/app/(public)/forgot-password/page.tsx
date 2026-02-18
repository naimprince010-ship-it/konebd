"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/auth/security-question?mobile=${mobile}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch details');

            setSecurityQuestion(data.securityQuestion);
            setStep(2);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, securityAnswer, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Reset failed');

            alert("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! এখন লগিন করুন।");
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
                <h2 className="text-center mb-6 text-primary">পাসওয়ার্ড পুনরুদ্ধার</h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', background: '#fee2e2', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleFetchQuestion}>
                        <div className="mb-6">
                            <label className="block mb-2 font-bold">আপনার মোবাইল নম্বর</label>
                            <input
                                type="tel"
                                className="w-full p-2 border rounded"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                                placeholder="017xxxxxxxx"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'যাচাই করা হচ্ছে...' : 'পরবর্তী ধাপ'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4 text-center">
                            <p className="font-bold text-gray-700">security question:</p>
                            <p className="text-lg text-primary">{securityQuestion}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 font-bold">আপনার উত্তর</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                                placeholder="উত্তর লিখুন"
                                value={securityAnswer}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block mb-2 font-bold">নতুন পাসওয়ার্ড</label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}
                                placeholder="********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'পরিবর্তন করা হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm">
                    <p className="mb-2">
                        <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>লগিন পেজে ফিরে যান</Link>
                    </p>
                    <p style={{ marginTop: '1rem', color: '#666' }}>
                        কোনো সমস্যা? কল করুন: <strong>01711223344</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
