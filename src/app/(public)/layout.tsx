import Navbar from '@/components/Navbar';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <footer style={{ background: '#f8fafc', padding: '2rem 0', textAlign: 'center', borderTop: '1px solid #e2e8f0', marginTop: '2rem' }}>
                <p>&copy; 2026 KoneBd. All rights reserved.</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>"Pochondo apnar, dayitto amader"</p>
            </footer>
        </>
    );
}
