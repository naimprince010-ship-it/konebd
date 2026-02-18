export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <nav style={{ padding: '1rem 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>KoneBd</a>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</a>
                        <a href="/catalog" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Catalog</a>
                        <a href="/about" style={{ color: '#374151', textDecoration: 'none' }}>About</a>
                        <a href="/contact" style={{ color: '#374151', textDecoration: 'none' }}>Contact</a>
                    </div>
                    <a href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Login</a>
                </div>
            </nav>
            {children}
            <footer style={{ background: '#f8fafc', padding: '2rem 0', textAlign: 'center', borderTop: '1px solid #e2e8f0', marginTop: '2rem' }}>
                <p>&copy; 2026 KoneBd. All rights reserved.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>"Pochondo apnar, dayitto amader"</p>
            </footer>
        </>
    );
}
