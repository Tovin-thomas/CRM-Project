/**
 * Top Header Component
 * 
 * Displays the top navigation bar with search functionality and user profile.
 * Handles user logout action.
 * 
 * @component
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Handles the logout process and redirects to login page.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /**
     * Smart navigation for Add New button - routes to appropriate form based on current page
     */
    const handleAddNew = () => {
        const path = location.pathname;

        if (path.includes('/leads')) {
            navigate('/leads/new');
        } else if (path.includes('/contacts')) {
            navigate('/contacts/new');
        } else if (path.includes('/deals')) {
            navigate('/deals/new');
        } else {
            // Default to leads if on dashboard or other pages
            navigate('/leads/new');
        }
    };

    return (
        <div className="app-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            padding: '16px 24px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Global Search Bar */}
            <div className="header-search" style={{ flex: 1, maxWidth: '400px' }}>
                <div style={{ position: 'relative' }}>
                    <span style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                    }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search leads, contacts, deals..."
                        aria-label="Search"
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 40px',
                            background: 'var(--bg-app)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            {/* User Actions Area */}
            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button
                    className="btn btn-primary"
                    onClick={handleAddNew}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                    <span>+</span> Add New
                </button>

                {/* User Profile Display */}
                <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar" style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: 'white'
                    }}>
                        👤
                    </div>
                    <div className="user-info">
                        <div className="user-email" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {user?.email}
                        </div>
                        <div className="user-role" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {user?.role || 'Admin'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-secondary)',
                        padding: '8px 16px',
                        fontSize: '13px'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Header;
