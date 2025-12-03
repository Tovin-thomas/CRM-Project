/**
 * Login Component
 * 
 * Provides user authentication interface with a modern split-screen layout.
 * Handles login form submission and error display.
 * 
 * @component
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side - Branding & Welcome */}
            <div className="auth-left">
                <div className="auth-brand">
                    <span>🚀</span> T&T CRM
                </div>
                <h1 className="auth-welcome-text">Enterprise IT Solutions</h1>
                <p className="auth-description">
                    Empowering your IT business with intelligent lead tracking, deal management, and automated workflows.
                </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <h2 className="auth-title">Sign In</h2>
                    <p className="auth-subtitle">Enter your credentials to access your account</p>

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

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            Sign In
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
