"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem('konebd_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('konebd_user');
        setUser(null);
        router.push('/login');
        router.refresh(); // Refresh to update server components if any
    };

    if (!mounted) {
        // Render a default state (e.g., just the links, no auth button) to avoid hydration mismatch
        // Or render the 'Login' state by default if that's safer
        return (
            <nav style={{ padding: '1rem 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>KoneBd</Link>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>
                        <Link href="/catalog" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Catalog</Link>
                        <Link href="/about" style={{ color: '#374151', textDecoration: 'none' }}>About</Link>
                        <Link href="/contact" style={{ color: '#374151', textDecoration: 'none' }}>Contact</Link>
                    </div>
                    <div style={{ width: '80px' }}></div> {/* Placeholder for auth button */}
                </div>
            </nav>
        );
    }

    return (
        <nav style={{ padding: '1rem 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href={user ? "/catalog" : "/"} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>KoneBd</Link>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {!user && <Link href="/" style={{ color: '#374151', textDecoration: 'none' }}>Home</Link>}
                    <Link href="/catalog" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Catalog</Link>
                    <Link href="/about" style={{ color: '#374151', textDecoration: 'none' }}>About</Link>
                    <Link href="/contact" style={{ color: '#374151', textDecoration: 'none' }}>Contact</Link>
                </div>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                            {user.mobile || 'User'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="btn"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                background: '#f87171',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}>Login</Link>
                )}
            </div>
        </nav>
    );
}
