/**
 * Admin Dashboard Component
 * 
 * Admin-only page for managing users and viewing system statistics.
 * Includes user management table and system overview cards.
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        due_date: ''
    });

    useEffect(() => {
        // Check if user is admin
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = { Authorization: `Bearer ${token}` };

            // Load users and stats
            const [usersRes, statsRes] = await Promise.all([
                axios.get('http://localhost:8000/api/auth/admin/users/', { headers }),
                axios.get('http://localhost:8000/api/auth/admin/stats/', { headers })
            ]);

            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error('Failed to load admin data:', err);
            setMessage({ type: 'error', text: 'Failed to load data. Please refresh.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(
                `http://localhost:8000/api/auth/admin/users/${userId}/`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: 'User role updated successfully!' });
            loadData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update user role' });
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(
                `http://localhost:8000/api/auth/admin/users/${userId}/`,
                { is_active: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully!` });
            loadData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update user status' });
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (!window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(
                `http://localhost:8000/api/auth/admin/users/${userId}/delete/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: 'User deleted successfully!' });
            loadData();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to delete user' });
        }
    };

    const openTaskModal = (user) => {
        setSelectedUser(user);
        setTaskData({ title: '', description: '', priority: 'medium', due_date: '' });
        setShowTaskModal(true);
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        if (!taskData.title) {
            alert('Please enter a task title');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                'http://localhost:8000/api/tasks/',
                { ...taskData, assigned_to: selectedUser.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: `Task assigned to ${selectedUser.email}!` });
            setShowTaskModal(false);
        } catch (err) {
            console.error(err);
            alert('Failed to assign task');
        }
    };

    if (loading) {
        return <div className="loading">Loading admin panel...</div>;
    }

    return (
        <div className="container">
            <h1 className="page-title">Admin Panel</h1>

            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                    {message.text}
                </div>
            )}

            {/* System Overview Stats */}
            {stats && (
                <div className="stats-grid" style={{ marginBottom: '30px' }}>
                    <div className="stat-card">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{stats.total_users}</div>
                        <div className="stat-change positive">
                            {stats.active_users} active
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Leads</div>
                        <div className="stat-value">{stats.total_leads}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Contacts</div>
                        <div className="stat-value">{stats.total_contacts}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Deals</div>
                        <div className="stat-value">{stats.total_deals}</div>
                    </div>
                </div>
            )}

            {/* User Management Table */}
            <div className="card">
                <div className="card-header">
                    <h2>User Management</h2>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <div className="data-table">
                        <table style={{ tableLayout: 'fixed', width: '100%' }}>
                            <colgroup>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '25%' }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td style={{ verticalAlign: 'middle' }}>{u.id}</td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <div style={{
                                                maxWidth: '100%',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }} title={u.email}>
                                                {u.email}
                                            </div>
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <div style={{
                                                maxWidth: '100%',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {`${u.first_name || ''} ${u.last_name || ''}`.trim() || '-'}
                                            </div>
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="form-control"
                                                style={{
                                                    width: '100%',
                                                    padding: '4px 8px',
                                                    fontSize: '13px',
                                                    height: '32px'
                                                }}
                                                disabled={u.id === user.id}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="sales_manager">Sales Manager</option>
                                                <option value="account_manager">Account Manager</option>
                                                <option value="bde">BDE</option>
                                                <option value="pre_sales">Pre-Sales</option>
                                                <option value="developer">Developer</option>
                                            </select>
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {u.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ verticalAlign: 'middle', fontSize: '13px' }}>
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                <button
                                                    onClick={() => openTaskModal(u)}
                                                    className="btn btn-sm btn-primary"
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    title="Assign Task"
                                                >
                                                    📋 Assign
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(u.id, u.is_active)}
                                                    className={`btn btn-sm ${u.is_active ? 'btn-secondary' : 'btn-success'}`}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '12px',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                    disabled={u.id === user.id}
                                                >
                                                    {u.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, u.email)}
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: '#e53e3e',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        fontSize: '12px'
                                                    }}
                                                    disabled={u.id === user.id}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Task Assignment Modal */}
            {showTaskModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', padding: '20px' }}>
                        <h3 style={{ marginBottom: '15px' }}>Assign Task to {selectedUser?.first_name || selectedUser?.email}</h3>
                        <form onSubmit={handleTaskSubmit}>
                            <div className="form-group">
                                <label>Task Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={taskData.title}
                                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select
                                    className="form-control"
                                    value={taskData.priority}
                                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={taskData.due_date}
                                    onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-10" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Assign Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
