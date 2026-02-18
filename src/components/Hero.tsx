import Link from 'next/link';

export default function Hero() {
    return (
        <section className="section hero-section">
            <div className="container text-center">
                <h1 className="hero-title">
                    আপনার মনের মানুষ খুঁজে নিন <br />
                    <span className="text-primary">কোনো ঝামেলা ছাড়াই</span>
                </h1>
                <p className="hero-subtitle">
                    KoneBD-তে পাবেন ভেরিফাইড প্রোফাইল, সম্পূর্ণ নিরাপত্তা এবং জীবনসঙ্গী খোঁজার এক সহজ অভিজ্ঞতা।
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/catalog" className="btn btn-primary" style={{ fontSize: '1.1rem' }}>
                        প্রোফাইল দেখুন
                    </Link>
                    <Link href="#how-it-works" className="btn" style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#374151' }}>
                        কিভাবে কাজ করে
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .hero-section {
                    background: linear-gradient(to right, #fdf2f8, #eef2ff);
                    padding: 3rem 0;
                }
                .hero-title {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: #111827;
                    line-height: 1.2;
                }
                .hero-subtitle {
                    font-size: 1rem;
                    margin-bottom: 2rem;
                    color: var(--muted);
                    max-width: 600px;
                    margin-left: auto; 
                    margin-right: auto;
                }

                @media (min-width: 768px) {
                    .hero-section { padding: 6rem 0; }
                    .hero-title { font-size: 3rem; margin-bottom: 1.5rem; }
                    .hero-subtitle { font-size: 1.25rem; margin-bottom: 2.5rem; }
                }
            `}</style>
        </section>
    );
}
