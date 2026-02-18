import Link from "next/link";

export default function About() {
    return (
        <section className="section" style={{ padding: '4rem 0' }}>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 className="text-center mb-8" style={{ fontSize: '2.5rem', color: '#111827' }}>আমাদের সম্পর্কে</h1>

                    <div style={{ marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--muted)' }}>
                        <p className="mb-4">
                            <strong>KoneBD</strong> হলো বাংলাদেশের একটি নির্ভরযোগ্য এবং নিরাপদ ম্যাট্রিমোনিয়াল প্ল্যাটফর্ম।
                            আমরা বিশ্বাস করি প্রতিটি মানুষের একটি সুন্দর জীবনসঙ্গী পাওয়ার অধিকার রয়েছে। আমাদের লক্ষ্য হলো
                            বিয়ে বা জীবনসঙ্গী খোঁজার এই প্রক্রিয়াকে সহজ, নিরাপদ এবং আনন্দদায়ক করে তোলা।
                        </p>
                        <p>
                            আমাদের প্ল্যাটফর্মে আপনি পাবেন শত শত ভেরিফাইড প্রোফাইল, যা আপনাকে আপনার স্বপ্নের মানুষটি খুঁজে পেতে সাহায্য করবে।
                            আমরা ব্যবহারকারীদের গোপনীয়তা এবং নিরাপত্তাকে সর্বোচ্চ অগ্রাধিকার দিয়ে থাকি।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: '2rem', marginBottom: '4rem' }}>
                        <div style={{ background: 'var(--accent)', padding: '2rem', borderRadius: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>আমাদের লক্ষ্য</h3>
                            <p style={{ color: 'var(--muted)' }}>
                                আমাদের মূল লক্ষ্য হলো বাংলাদেশের প্রতিটি বিবাহযোগ্য মানুষের জন্য একটি বিশ্বস্ত মাধ্যম তৈরি করা,
                                যেখানে তারা কোনো ঝামেলা ছাড়াই তাদের জীবনসঙ্গী খুঁজে পাবেন।
                            </p>
                        </div>
                        <div style={{ background: 'var(--accent)', padding: '2rem', borderRadius: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>কেন আমরা সেরা?</h3>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--muted)' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ ১০০% ভেরিফাইড প্রোফাইল</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ সর্বোচ্চ নিরাপত্তা ও গোপনীয়তা</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ সহজ ও ইউজার-ফ্রেন্ডলি ইন্টারফেস</li>
                                <li>✅ ডেডিকেটেড কাস্টমার সাপোর্ট</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>আপনার জীবনসঙ্গী খোঁজা শুরু করুন আজই</h3>
                        <Link href="/catalog" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                            প্রোফাইল দেখুন
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
