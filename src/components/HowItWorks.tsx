export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "প্যাকেজ নির্বাচন করুন",
            desc: "আপনার প্রয়োজন অনুযায়ী বেসিক, স্ট্যান্ডার্ড বা প্রিমিয়াম প্যাকেজ বেছে নিন।",
        },
        {
            id: 2,
            title: "নিরাপদ পেমেন্ট",
            desc: "বিকাশ এর মাধ্যমে নিরাপদে পেমেন্ট করে এক্সক্লুসিভ প্রাইভেট ক্যাটালগ আনলক করুন।",
        },
        {
            id: 3,
            title: "শর্টলিস্ট ও যোগাযোগ",
            desc: "ভেরিফাইড প্রোফাইল দেখুন, পছন্দের তালিকা তৈরি করুন এবং আপনার পছন্দ জমা দিন।",
        },
    ];

    return (
        <section id="how-it-works" className="section">
            <div className="container">
                <h2 className="text-center mb-8" style={{ fontSize: '2.25rem' }}>কিভাবে কাজ করে</h2>
                <div className="grid grid-cols-1 grid-cols-3-md">
                    {steps.map((step) => (
                        <div key={step.id} style={{ padding: '2rem', borderRadius: '1rem', background: 'var(--accent)', textAlign: 'center' }}>
                            <div style={{
                                width: '3rem', height: '3rem', background: 'var(--primary)', color: 'white',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: 'bold'
                            }}>
                                {step.id}
                            </div>
                            <h3 className="mb-4">{step.title}</h3>
                            <p style={{ color: 'var(--muted)' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
