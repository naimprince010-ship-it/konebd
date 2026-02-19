"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SharedLinkPaymentPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [bkashNumber, setBkashNumber] = useState("");
    const [trxId, setTrxId] = useState("");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const price = "200"; // Fixed price for unlocking link (or make dynamic)

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("processing");

        try {
            const res = await fetch('/api/shared/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bkashNumber,
                    trxId,
                    amount: price,
                    sharedLinkToken: token
                }),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                const data = await res.json();
                alert("Failed: " + data.error);
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="container mx-auto p-8 text-center max-w-md">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Submitted!</h2>
                    <p className="mb-6 text-gray-600">Please wait for admin verification. This usually takes about 30 minutes.</p>
                    <button
                        onClick={() => router.push(`/shared/${token}`)}
                        className="btn btn-primary w-full"
                    >
                        Back into Profiles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-md py-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-pink-600 p-6 text-center text-white">
                    <h1 className="text-2xl font-bold">Unlock Full Access</h1>
                    <p className="opacity-90">Pay {price} TK to view all profiles</p>
                </div>

                <div className="p-6">
                    <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
                        <p>1. Send Money to <strong>01700000000</strong></p>
                        <p>2. Amount: <strong>{price} TK</strong></p>
                        <p>3. Reference: <strong>LinkUnlock</strong></p>
                        <p>4. Enter TrxID below</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Your bKash Number</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="017xxxxxxxx"
                                value={bkashNumber}
                                onChange={(e) => setBkashNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Transaction ID (TrxID)</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                                placeholder="8N7..."
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "processing"}
                            className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
                        >
                            {status === "processing" ? "Verifying..." : "Confirm Payment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
