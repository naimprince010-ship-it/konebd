"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        router.refresh();
    };

    if (!mounted) {
        return (
            <nav style={{ padding: '1rem 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>KoneBd</Link>
                    <div style={{ width: '24px' }}></div>
                </div>
            </nav>
        );
    }

    return (
        <nav style={{ padding: '1rem 0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', background: 'white', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container">
                <div className="nav-header">
                    <Link href={user ? "/catalog" : "/"} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>KoneBd</Link>

                    {/* Hamburger Button (Mobile Only) */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>

                    {/* Desktop Menu */}
                    <div className="desktop-menu">
                        {!user && <Link href="/" className="nav-link">Home</Link>}
                        <Link href="/catalog" className="nav-link">Catalog</Link>
                        <Link href="/about" className="nav-link">About</Link>
                        <Link href="/contact" className="nav-link">Contact</Link>

                        {user ? (
                            <div className="user-menu">
                                <span className="user-name">
                                    {user.mobile}
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="btn btn-primary login-btn">Login</Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    {!user && <Link href="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>}
                    <Link href="/catalog" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
                    <Link href="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link href="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                    {user ? (
                        <div className="mobile-user">
                            <span className="user-name">{user.mobile}</span>
                            <button onClick={handleLogout} className="btn-logout">Logout</button>
                        </div>
                    ) : (
                        <Link href="/login" className="btn btn-primary mobile-login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    )}
                </div>

                <style jsx>{`
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 1rem;
                    }
                    .nav-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                    }
                    .nav-link {
                        color: #374151;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    .nav-link:hover { color: var(--primary); }
                    
                    /* Desktop Styles */
                    .desktop-menu {
                        display: none;
                    }
                    @media (min-width: 768px) {
                        .desktop-menu {
                            display: flex;
                            align-items: center;
                            gap: 1.5rem;
                        }
                        .mobile-menu-btn { display: none; }
                        .mobile-menu { display: none !important; }
                    }

                    /* Mobile Styles */
                    .mobile-menu-btn {
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 0.5rem;
                        display: block;
                    }
                    .hamburger span {
                        display: block;
                        width: 25px;
                        height: 3px;
                        background: #374151;
                        margin-bottom: 5px;
                        transition: all 0.3s;
                    }
                    .hamburger span:last-child { margin-bottom: 0; }
                    
                    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
                    .hamburger.open span:nth-child(2) { opacity: 0; }
                    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }

                    .mobile-menu {
                        display: none;
                        flex-direction: column;
                        gap: 1rem;
                        margin-top: 1rem;
                        padding-top: 1rem;
                        border-top: 1px solid #f3f4f6;
                        width: 100%;
                    }
                    .mobile-menu.open { display: flex; }
                    
                    .mobile-link {
                        color: #374151;
                        text-decoration: none;
                        font-size: 1.1rem;
                        padding: 0.5rem 0;
                        border-bottom: 1px solid #f9fafb;
                    }
                    
                    .user-menu, .mobile-user {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                    .mobile-user {
                        justify-content: space-between;
                        margin-top: 0.5rem;
                    }
                    .user-name {
                        font-weight: bold;
                        color: var(--primary);
                    }
                    .btn-logout {
                        padding: 0.5rem 1rem;
                        font-size: 0.875rem;
                        background: #f87171;
                        color: white;
                        border: none;
                        border-radius: 0.25rem;
                        cursor: pointer;
                    }
                    .login-btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.875rem;
                        text-decoration: none;
                    }
                    .mobile-login {
                        text-align: center;
                        display: block;
                    }
                `}</style>
            </div>
        </nav>
    );
}
