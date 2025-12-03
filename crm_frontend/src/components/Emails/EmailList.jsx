import React, { useState, useEffect } from 'react';
import crmService from '../../services/crmService';
import EmailComposer from './EmailComposer';
import './Emails.css';

const EmailList = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [showComposer, setShowComposer] = useState(false);

    useEffect(() => {
        loadEmails();
        loadStats();
    }, []);

    const loadEmails = async () => {
        try {
            setLoading(true);
            const response = await crmService.getEmails();
            setEmails(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading emails:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await crmService.getEmailStatistics();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            sent: 'badge-success',
            draft: 'badge-secondary',
            failed: 'badge-danger',
            opened: 'badge-info',
            clicked: 'badge-primary'
        };
        return badges[status] || 'badge-secondary';
    };

    const filteredEmails = emails.filter(email => {
        if (activeTab === 'all') return true;
        return email.status === activeTab;
    });

    return (
        <div className="email-container">
            <div className="email-header">
                <div>
                    <h1 className="page-title">📧 Email Center</h1>
                    <p className="page-subtitle">Manage your communications</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowComposer(true)}>
                    ✏️ Compose Email
                </button>
            </div>

            {stats && (
                <div className="stats-grid-enhanced">
                    <div className="stat-card-enhanced stat-card-blue">
                        <div className="stat-icon">📨</div>
                        <div className="stat-content">
                            <div className="stat-label-enhanced">Total Emails</div>
                            <div className="stat-value-enhanced">{stats.total_emails}</div>
                        </div>
                    </div>
                    <div className="stat-card-enhanced stat-card-green">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <div className="stat-label-enhanced">Sent</div>
                            <div className="stat-value-enhanced">{stats.sent_emails}</div>
                        </div>
                    </div>
                    <div className="stat-card-enhanced stat-card-purple">
                        <div className="stat-icon">👁️</div>
                        <div className="stat-content">
                            <div className="stat-label-enhanced">Open Rate</div>
                            <div className="stat-value-enhanced">{stats.open_rate}%</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="email-content">
                <div className="email-sidebar">
                    <div
                        className={`email-nav-item ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        📥 All Emails
                    </div>
                    <div
                        className={`email-nav-item ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        📤 Sent
                    </div>
                    <div
                        className={`email-nav-item ${activeTab === 'draft' ? 'active' : ''}`}
                        onClick={() => setActiveTab('draft')}
                    >
                        📝 Drafts
                    </div>
                </div>

                <div className="email-list">
                    {loading ? (
                        <div className="loading">Loading emails...</div>
                    ) : filteredEmails.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No emails found</h3>
                        </div>
                    ) : (
                        filteredEmails.map(email => (
                            <div key={email.id} className="email-item">
                                <div className="email-item-header">
                                    <span className="email-subject">{email.subject}</span>
                                    <span className={`badge ${getStatusBadge(email.status)}`}>
                                        {email.status}
                                    </span>
                                </div>
                                <div className="email-item-meta">
                                    <span>To: {email.to_email}</span>
                                    <span>{new Date(email.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="email-item-preview">
                                    {email.body.substring(0, 100)}...
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showComposer && (
                <EmailComposer
                    onClose={() => setShowComposer(false)}
                    onEmailSent={() => {
                        loadEmails();
                        loadStats();
                    }}
                />
            )}
        </div>
    );
};

export default EmailList;
