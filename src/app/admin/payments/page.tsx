"use client";
import { useState, useEffect } from 'react';



export default function AdminPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            const res = await fetch('/api/admin/payments');
            const data = await res.json();
            setPayments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        if (!confirm(`Are you sure you want to ${status} this payment?`)) return;

        try {
            const res = await fetch('/api/admin/payments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });

            if (res.ok) {
                alert(`Payment ${status} successfully!`);
                fetchPayments(); // Refresh list
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;


    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Payment Verification</h1>

            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem' }}>User Mobile</th>
                            <th style={{ padding: '0.75rem' }}>Bkash Number</th>
                            <th style={{ padding: '0.75rem' }}>TrxID</th>
                            <th style={{ padding: '0.75rem' }}>Amount</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                            <th style={{ padding: '0.75rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-4">No payments found</td></tr>
                        ) : (
                            payments.map((payment) => (
                                <tr key={payment._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{payment.userMobile}</td>
                                    <td style={{ padding: '0.75rem' }}>{payment.bkashNumber}</td>
                                    <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{payment.trxId}</td>
                                    <td style={{ padding: '0.75rem' }}>{payment.amount}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold',
                                            background: payment.status === 'approved' ? '#dcfce7' : payment.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                            color: payment.status === 'approved' ? '#166534' : payment.status === 'rejected' ? '#991b1b' : '#854d0e'
                                        }}>
                                            {payment.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {payment.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => updateStatus(payment._id, 'approved')}
                                                    style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(payment._id, 'rejected')}
                                                    style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.25rem' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
