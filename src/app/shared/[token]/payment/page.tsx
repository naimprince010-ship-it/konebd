"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function SharedLinkPaymentPage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [bkashNumber, setBkashNumber] = useState("");
    const [trxId, setTrxId] = useState("");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [merchantNumber, setMerchantNumber] = useState("01700000000"); // Default fallback
    const price = "200";

    useEffect(() => {
        // Fetch dynamic bKash number
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.bkashNumber) {
                    setMerchantNumber(data.bkashNumber);
                }
            })
            .catch(err => console.error("Failed to fetch settings", err));
    }, []);

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
            <div className="min-h-screen flex items-center justify-center bg-[#e2136e]/5 font-sans p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full border-t-8 border-[#e2136e]">
                    <div className="w-20 h-20 bg-[#e2136e] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-lg">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">পেমেন্ট সফল হয়েছে!</h2>
                    <p className="text-gray-500 mb-8">অ্যাডমিন ভেরিফিকেশনের জন্য অপেক্ষা করুন।</p>
                    <button
                        onClick={() => router.push(`/shared/${token}`)}
                        className="w-full bg-[#e2136e] text-white font-bold py-3 rounded shadow hover:bg-[#c2105e] transition"
                    >
                        প্রোফাইল দেখুন
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
            <div className="bg-white w-full max-w-md shadow-2xl overflow-hidden rounded-lg">
                {/* bKash Header */}
                <div className="bg-[#e2136e] p-4 flex items-center justify-between shadow-md relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded">
                            <span className="text-[#e2136e] font-extrabold text-xl px-1">bKash</span>
                        </div>
                        <span className="text-white text-sm opacity-90">Payment Gateway</span>
                    </div>
                    <div className="text-white text-right">
                        <p className="text-xs opacity-75">Merchant</p>
                        <p className="font-bold text-sm">KoneBd.com</p>
                    </div>
                </div>

                {/* Invoice Section */}
                <div className="bg-[#fceef5] p-6 border-b border-pink-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-pink-100 z-10 relative">
                        <span className="text-3xl">🛒</span>
                    </div>
                    <div className="z-10 relative">
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Invoice Amount</p>
                        <p className="text-2xl font-bold text-gray-800">৳ {price}.00</p>
                        <p className="text-xs text-pink-600 font-medium">Link Unlock Fee</p>
                    </div>
                    {/* Decorational Circle */}
                    <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-[#e2136e]/5 rounded-full blur-2xl"></div>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <div className="mb-8 p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-600">
                        <p className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                            <span>Send Money To:</span>
                            <span className="font-bold text-gray-800">{merchantNumber}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Reference:</span>
                            <span className="font-bold text-gray-800">LinkUnlock</span>
                        </p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">আপনার বিকাশ নম্বর</label>
                            <input
                                type="text"
                                className="w-full text-center text-lg p-3 border-b-2 border-gray-300 focus:border-[#e2136e] outline-none transition-colors bg-white placeholder-gray-300 font-medium"
                                placeholder="e.g. 017xxxxxxxx"
                                value={bkashNumber}
                                onChange={(e) => setBkashNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Transaction ID (TrxID)</label>
                            <input
                                type="text"
                                className="w-full text-center text-lg p-3 border-b-2 border-gray-300 focus:border-[#e2136e] outline-none transition-colors bg-white placeholder-gray-300 font-medium uppercase"
                                placeholder="e.g. 8N7..."
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={status === "processing"}
                                className="flex-1 bg-[#e2136e] text-white font-bold py-3 rounded shadow-md hover:shadow-lg hover:bg-[#c2105e] transition disabled:opacity-70 flex justify-center items-center"
                            >
                                {status === "processing" ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-[#e2136e] text-white p-4 text-center">
                    <p className="text-lg font-bold flex items-center justify-center gap-2">
                        <span className="text-2xl">📞</span> 16247
                    </p>
                </div>
            </div>
        </div>
    );
}
