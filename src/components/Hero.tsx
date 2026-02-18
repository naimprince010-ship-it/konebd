import Link from 'next/link';

export default function Hero() {
    return (
        <section className="section" style={{ background: 'linear-gradient(to right, #fdf2f8, #eef2ff)', padding: '6rem 0' }}>
            <div className="container text-center">
                <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#111827' }}>
                    আপনার মনের মানুষ খুঁজে নিন <br />
                    <span className="text-primary">কোনো ঝামেলা ছাড়াই</span>
                </h1>
                <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    KoneBD-তে পাবেন ভেরিফাইড প্রোফাইল, সম্পূর্ণ নিরাপত্তা এবং জীবনসঙ্গী খোঁজার এক সহজ অভিজ্ঞতা।
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/catalog" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
                        প্রোফাইল দেখুন
                    </Link>
                    <Link href="#how-it-works" className="btn" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#374151' }}>
                        কিভাবে কাজ করে
                    </Link>
                </div>
            </div>
        </section>
    );
}
