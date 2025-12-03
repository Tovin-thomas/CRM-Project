/**
 * Register Component
 * 
 * Provides user registration interface with a modern split-screen layout.
 * Handles new user account creation with role selection.
 * 
 * @component
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('bde'); // Default role
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            // Pass user data as an object, including the selected role
            // Using email as username since login uses email
            const response = await register({
                username: email,  // Use email as username
                email,
                password,
                role
            });

            // Check if account requires approval
            if (response?.requiresApproval) {
                setError(''); // Clear any errors
                alert('✅ Registration successful!\n\nYour account is pending admin approval. You will be able to login once an administrator activates your account.');
                navigate('/login');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Failed to create an account. Email may already be in use.');
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side - Branding & Welcome */}
            <div className="auth-left">
                <div className="auth-brand">
                    <span>🚀</span> T&T CRM
                </div>
                <h1 className="auth-welcome-text">Join the Team</h1>
                <p className="auth-description">
                    Collaborate with your IT sales team, track enterprise deals, and close contracts faster with T&T's unified platform.
                </p>
            </div>

            {/* Right Side - Register Form */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Get started with your free account</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-control"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="developer">Developer / Technical Staff</option>
                                <option value="bde">Business Development Exec</option>
                                <option value="account_manager">Account Manager</option>
                                <option value="sales_manager">Sales Manager</option>
                                <option value="pre_sales">Pre-Sales Consultant</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
