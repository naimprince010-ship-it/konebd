export default function Pricing() {
    const plans = [
        { name: 'বেসিক', price: '২০০ টাকা', profiles: '১০ টি প্রোফাইল', features: ['বেসিক সাপোর্ট', '৭ দিন মেয়াদ'] },
        { name: 'স্ট্যান্ডার্ড', price: '৫০০ টাকা', profiles: '৩০ টি প্রোফাইল', features: ['প্রায়োরিটি সাপোর্ট', '১৫ দিন মেয়াদ', 'ভেরিফাইড ব্যাজ'], recommended: true },
        { name: 'প্রিমিয়াম', price: '৮০০ টাকা', profiles: '৫০+ প্রোফাইল', features: ['ডেডিকেটেড ঘটক', '৩০ দিন মেয়াদ', 'ফোন সাপোর্ট'] },
    ];

    return (
        <section id="pricing" className="section">
            <div className="container">
                <h2 className="text-center mb-8" style={{ fontSize: '2.25rem' }}>প্যাকেজ সমূহ</h2>
                <div className="grid grid-cols-1 grid-cols-3-md">
                    {plans.map((plan) => (
                        <div key={plan.name} style={{
                            border: plan.recommended ? '2px solid var(--primary)' : '1px solid #e5e7eb',
                            borderRadius: '1rem', padding: '2rem',
                            position: 'relative', background: 'white'
                        }}>
                            {plan.recommended && (
                                <span style={{
                                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                                    background: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '1rem', fontSize: '0.875rem'
                                }}>
                                    জনপ্রিয়
                                </span>
                            )}
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>
                                {plan.price}
                            </div>
                            <p style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>{plan.profiles}</p>
                            <ul style={{ listStyle: 'none', marginBottom: '2rem', textAlign: 'left' }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ color: 'green', marginRight: '0.5rem' }}>✔</span> {feature}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={`/payment?plan=${plan.name}&price=${plan.price}`}
                                className={`btn ${plan.recommended ? 'btn-primary' : ''}`}
                                style={{
                                    width: '100%',
                                    display: 'block',
                                    textAlign: 'center',
                                    border: plan.recommended ? 'none' : '1px solid #e5e7eb',
                                    textDecoration: 'none',
                                    backgroundColor: plan.recommended ? 'var(--primary)' : 'white',
                                    color: plan.recommended ? 'white' : 'inherit'
                                }}
                            >
                                বিকাশ পেমেন্ট করুন
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
