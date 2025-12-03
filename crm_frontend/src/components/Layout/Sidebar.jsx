/**
 * Sidebar Navigation Component
 * 
 * Displays the main navigation menu on the left side of the application.
 * Uses the 'active' class to highlight the current page.
 * 
 * @component
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    /**
     * Checks if the current path matches the link path to set active state.
     * @param {string} path - The path to check
     * @returns {boolean} - True if active
     */
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="sidebar">
            {/* Brand Logo Section */}
            <div className="sidebar-header">
                <Link to="/dashboard" className="sidebar-brand">
                    <span className="brand-icon">📊</span>
                    <span>Django CRM</span>
                </Link>
            </div>

            {/* Main Navigation Menu */}
            <nav className="sidebar-nav">

                {/* Home Section */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Home</div>
                    <Link
                        to="/dashboard"
                        className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">🏠</span>
                        <span>Dashboard</span>
                    </Link>
                </div>

                {/* CRM Core Modules */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">CRM</div>
                    <Link
                        to="/leads"
                        className={`sidebar-link ${isActive('/leads') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">🎯</span>
                        <span>Leads</span>
                    </Link>
                    <Link
                        to="/contacts"
                        className={`sidebar-link ${isActive('/contacts') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">👥</span>
                        <span>Contacts</span>
                    </Link>
                    <Link
                        to="/clients"
                        className={`sidebar-link ${isActive('/clients') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">🏢</span>
                        <span>Clients</span>
                    </Link>
                </div>

                {/* Sales Modules */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Sales</div>
                    <Link
                        to="/deals"
                        className={`sidebar-link ${isActive('/deals') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">💼</span>
                        <span>Deals</span>
                    </Link>
                </div>

                {/* Task Management */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Work</div>
                    <Link
                        to="/tasks"
                        className={`sidebar-link ${isActive('/tasks') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">✅</span>
                        <span>Tasks</span>
                    </Link>
                    <Link
                        to="/calendar"
                        className={`sidebar-link ${isActive('/calendar') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">📅</span>
                        <span>Calendar</span>
                    </Link>
                    <Link
                        to="/documents"
                        className={`sidebar-link ${isActive('/documents') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">📁</span>
                        <span>Documents</span>
                    </Link>
                </div>

                {/* Insights */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Insights</div>
                    <Link
                        to="/analytics"
                        className={`sidebar-link ${isActive('/analytics') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">📈</span>
                        <span>Analytics</span>
                    </Link>
                    <Link
                        to="/emails"
                        className={`sidebar-link ${isActive('/emails') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">📧</span>
                        <span>Emails</span>
                    </Link>
                </div>

                {/* Settings */}
                <div className="sidebar-section">
                    <div className="sidebar-section-title">Settings</div>
                    <Link
                        to="/profile"
                        className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">⚙️</span>
                        <span>Profile</span>
                    </Link>
                    {user?.is_staff && (
                        <Link
                            to="/admin"
                            className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}
                        >
                            <span className="sidebar-icon">👑</span>
                            <span>Admin Panel</span>
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
