export default function Contact() {
    return (
        <section className="section" style={{ padding: '4rem 0', background: '#f9fafb' }}>
            <div className="container">
                <h1 className="text-center mb-8" style={{ fontSize: '2.5rem', color: '#111827' }}>যোগাযোগ করুন</h1>
                <p className="text-center mb-12" style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    আমাদের সাথে যোগাযোগ করতে নিচের ফর্মটি পূরণ করুন অথবা সরাসরি ফোন বা ইমেইল করুন।
                </p>

                <div className="grid grid-cols-1 grid-cols-2-md" style={{ gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                    {/* Contact Info */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111827' }}>আমাদের ঠিকানা</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📍 অফিস</h4>
                            <p style={{ color: 'var(--muted)' }}>বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা-১২০৯</p>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>📞 ফোন</h4>
                            <p style={{ color: 'var(--muted)' }}>+৮৮০ ১৭১১-XXXXXX</p>
                            <p style={{ color: 'var(--muted)' }}>+৮৮০ ১৮১১-XXXXXX</p>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>✉️ ইমেইল</h4>
                            <p style={{ color: 'var(--muted)' }}>info@konebd.com</p>
                            <p style={{ color: 'var(--muted)' }}>support@konebd.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <form>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>আপনার নাম</label>
                                <input type="text" className="form-control" placeholder="আপনার নাম লিখুন" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ইমেইল</label>
                                <input type="email" className="form-control" placeholder="আপনার ইমেইল লিখুন" required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ফোন নম্বর</label>
                                <input type="tel" className="form-control" placeholder="আপনার ফোন নম্বর" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>বার্তা</label>
                                <textarea className="form-control" rows={4} placeholder="আপনার বার্তা লিখুন..." required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}>
                                বার্তা পাঠান
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
