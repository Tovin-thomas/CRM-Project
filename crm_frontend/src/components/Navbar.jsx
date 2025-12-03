/**
 * Navbar component for navigation.
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                    CRM System
                </Link>
            </div>

            <div className="navbar-menu">
                <Link to="/dashboard" className="navbar-link">
                    Dashboard
                </Link>
                <Link to="/leads" className="navbar-link">
                    Leads
                </Link>
                <Link to="/contacts" className="navbar-link">
                    Contacts
                </Link>
                <Link to="/deals" className="navbar-link">
                    Deals
                </Link>
                <Link to="/tasks" className="navbar-link">
                    Tasks
                </Link>
                <Link to="/notes" className="navbar-link">
                    Notes
                </Link>
                <Link to="/activities" className="navbar-link">
                    Activities
                </Link>
                <span className="navbar-link" style={{ cursor: 'default', opacity: 0.7 }}>
                    {user.email}
                </span>
                <button onClick={handleLogout} className="navbar-link" style={{ border: 'none', background: 'none' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
