/**
 * User Profile & Settings Component
 * 
 * Allows users to update their profile information (name, email)
 * and change their password.
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile form state
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    /**
     * Handle profile form changes
     */
    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle password form changes
     */
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Submit profile update
     */
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('access_token');
            await axios.put(
                'http://localhost:8000/api/auth/profile/update/',
                profileData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Update user in localStorage
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));

        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Submit password change
     */
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                'http://localhost:8000/api/auth/profile/change-password/',
                passwordData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage({ type: 'success', text: 'Password changed successfully!' });

            // Clear password fields
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: '',
            });

        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="page-title">Profile & Settings</h1>

            {/* Success/Error Messages */}
            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid-2">
                {/* Profile Information Card */}
                <div className="card">
                    <div className="card-header">
                        <h2>Profile Information</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleProfileSubmit}>
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={user?.role || 'N/A'}
                                    disabled
                                    style={{ backgroundColor: '#f0f0f0' }}
                                />
                                <small style={{ color: '#666' }}>
                                    Contact admin to change your role
                                </small>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="card">
                    <div className="card-header">
                        <h2>Change Password</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    name="old_password"
                                    className="form-control"
                                    value={passwordData.old_password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    className="form-control"
                                    value={passwordData.new_password}
                                    onChange={handlePasswordChange}
                                    required
                                    minLength={8}
                                />
                                <small style={{ color: '#666' }}>
                                    Minimum 8 characters
                                </small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    className="form-control"
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
