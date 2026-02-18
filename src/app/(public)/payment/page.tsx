"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function PaymentContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");
    const price = searchParams.get("price");
    const router = useRouter();

    const [bkashNumber, setBkashNumber] = useState("");
    const [trxId, setTrxId] = useState("");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!bkashNumber || !trxId) {
            alert("Please fill in all fields");
            return;
        }

        setStatus("processing");

        // Simulate API call
        setTimeout(async () => {
            try {
                // Get user from localStorage
                const storedUser = localStorage.getItem('konebd_user');
                const user = storedUser ? JSON.parse(storedUser) : null;

                // Submit payment for verification
                const res = await fetch('/api/payment/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userMobile: user?.mobile || 'Unknown',
                        bkashNumber,
                        trxId,
                        amount: price || '500' // Default if not found
                    }),
                });

                if (res.ok) {
                    setStatus("success");
                } else {
                    const data = await res.json();
                    alert("Payment submission failed: " + data.error);
                    setStatus("error");
                }

            } catch (error) {
                console.error("Payment submission failed", error);
                setStatus("error");
            }
        }, 1500);
    };

    if (status === "success") {
        return (
            <div className="container section text-center" style={{ padding: "4rem 1rem" }}>
                <div style={{
                    background: "white",
                    padding: "3rem",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    maxWidth: "500px",
                    margin: "0 auto"
                }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                    <h2 className="text-primary mb-4">Payment Under Review!</h2>
                    <p className="mb-6">We have received your payment details for <strong>{plan}</strong> package.</p>
                    <p className="text-muted mb-8">Admin will verify your transaction shortly (avg. 30 mins).</p>
                    <Link href="/catalog" className="btn btn-primary">
                        Browse Profiles
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container section" style={{ padding: "4rem 1rem" }}>
            <div style={{
                maxWidth: "500px",
                margin: "0 auto",
                background: "white",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}>
                <div style={{ background: "#e2136e", padding: "1.5rem", color: "white", textAlign: "center" }}>
                    <h2 style={{ margin: 0 }}>Pay with bKash</h2>
                </div>

                <div style={{ padding: "2rem" }}>
                    <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>You are paying for:</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{plan} Package</span>
                            <span style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#e2136e" }}>{price}</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: "2rem", fontSize: "0.9rem", color: "#4b5563" }}>
                        <p>1. Go to your bKash Mobile Menu by dialing *247#</p>
                        <p>2. Choose "Send Money"</p>
                        <p>3. Enter the bKash Account Number: <strong>01700000000</strong></p>
                        <p>4. Enter Amount: <strong>{price && price.replace(' TK', '')}</strong></p>
                        <p>5. Enter Reference: <strong>KoneBd</strong></p>
                        <p>6. Verify your PIN and confirm</p>
                        <p>7. Enter the Transaction ID below</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Your bKash Number</label>
                            <input
                                type="text"
                                placeholder="017xxxxxxxx"
                                className="input" // Assuming you have an input class or use styles
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                                value={bkashNumber}
                                onChange={(e) => setBkashNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Transaction ID (TrxID)</label>
                            <input
                                type="text"
                                placeholder="8N7..."
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={status === "processing"}
                            style={{
                                width: "100%",
                                background: "#e2136e",
                                color: "white",
                                border: "none",
                                padding: "0.75rem",
                                borderRadius: "0.5rem",
                                fontWeight: "bold",
                                cursor: status === "processing" ? "not-allowed" : "pointer",
                                opacity: status === "processing" ? 0.7 : 1
                            }}
                        >
                            {status === "processing" ? "Verifying..." : "Confirm Payment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading payment details...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
