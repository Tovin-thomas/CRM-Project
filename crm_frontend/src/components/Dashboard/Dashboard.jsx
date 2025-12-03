/**
 * Enhanced Dashboard with Premium UI/UX
 * Modern design with gradient cards, animations, and better visual hierarchy
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import crmService from '../../services/crmService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [clientStats, setClientStats] = useState({ total_clients: 0, active_clients: 0 });
    const [emailStats, setEmailStats] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            const [leadResponse, clientResponse, emailResponse, eventsResponse] = await Promise.all([
                crmService.getLeadStatistics(),
                crmService.getClientStatistics(),
                crmService.getEmailStatistics().catch(() => ({ data: null })),
                crmService.getUpcomingEvents().catch(() => ({ data: [] }))
            ]);

            setStats(leadResponse.data);
            setClientStats(clientResponse.data);
            setEmailStats(emailResponse.data);
            setUpcomingEvents(eventsResponse.data || []);

        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    // Calculate conversion rate
    const conversionRate = stats?.total > 0
        ? ((stats?.converted || 0) / stats?.total * 100).toFixed(1)
        : 0;

    // Chart Data Configuration with enhanced styling
    const statusChartData = {
        labels: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
        datasets: [
            {
                label: 'Leads by Status',
                data: [
                    stats?.new || 0,
                    stats?.contacted || 0,
                    stats?.qualified || 0,
                    stats?.lost || 0,
                    stats?.converted || 0
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                    'rgb(16, 185, 129)',
                ],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const aiCategoryChartData = {
        labels: ['Hot Leads 🔥', 'Warm Leads ☀️', 'Cold Leads ❄️'],
        datasets: [
            {
                data: [stats?.hot || 0, stats?.warm || 0, stats?.cold || 0],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.9)',
                    'rgba(245, 158, 11, 0.9)',
                    'rgba(59, 130, 246, 0.9)',
                ],
                borderColor: [
                    'rgb(220, 38, 38)',
                    'rgb(217, 119, 6)',
                    'rgb(37, 99, 235)',
                ],
                borderWidth: 3,
                hoverOffset: 15,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    color: '#94a3b8',
                    font: {
                        size: 12,
                        family: "'Inter', 'Segoe UI', sans-serif"
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8'
                }
            }
        }
    };

    const barChartOptions = {
        ...chartOptions,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Pipeline Distribution',
                color: '#f8fafc',
                font: {
                    size: 14,
                    weight: '600'
                },
                padding: 20
            }
        }
    };

    return (
        <div className="dashboard-container">
            {/* Welcome Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard Overview</h1>
                    <p className="dashboard-subtitle">Welcome back! Here's what's happening with your CRM today.</p>
                </div>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid-enhanced">
                <div className="stat-card-enhanced stat-card-blue">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3 className="stat-label-enhanced">Total Leads</h3>
                        <p className="stat-value-enhanced">{stats?.total || 0}</p>
                        <div className="stat-trend positive">
                            <span className="trend-icon">↗</span>
                            <span className="trend-text">All time</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card-enhanced stat-card-purple">
                    <div className="stat-icon">✨</div>
                    <div className="stat-content">
                        <h3 className="stat-label-enhanced">New Leads</h3>
                        <p className="stat-value-enhanced">{stats?.new || 0}</p>
                        <div className="stat-trend positive">
                            <span className="trend-icon">↗</span>
                            <span className="trend-text">Fresh opportunities</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card-enhanced stat-card-amber">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <h3 className="stat-label-enhanced">Qualified</h3>
                        <p className="stat-value-enhanced">{stats?.qualified || 0}</p>
                        <div className="stat-trend positive">
                            <span className="trend-icon">↗</span>
                            <span className="trend-text">Ready to convert</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card-enhanced stat-card-green">
                    <div className="stat-icon">🎉</div>
                    <div className="stat-content">
                        <h3 className="stat-label-enhanced">Converted</h3>
                        <p className="stat-value-enhanced">{stats?.converted || 0}</p>
                        <div className="stat-trend positive">
                            <span className="trend-icon">↗</span>
                            <span className="trend-text">{conversionRate}% conversion rate</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Statistics Section */}
            <div className="stats-grid-enhanced" style={{ marginBottom: '35px' }}>
                <div className="stat-card-enhanced stat-card-blue" style={{ background: 'var(--bg-card)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>🏢</div>
                    <div className="stat-content">
                        <h3 className="stat-label-enhanced">Total Clients</h3>
                        <p className="stat-value-enhanced">{clientStats?.total_clients || 0}</p>
                        <div className="stat-trend positive">
                            <span className="trend-icon">↗</span>
                            <span className="trend-text">Active Portfolio</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card-enhanced stat-card-green" style={{ background: 'var(--bg-card)' }}>
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>✅</div>
                    <div className="stat-content">
                        <h3 className="stat-label-enhanced">Active Clients</h3>
                        <p className="stat-value-enhanced">{clientStats?.active_clients || 0}</p>
                        <div className="stat-trend positive">
                            <span className="trend-icon">↗</span>
                            <span className="trend-text">Currently Engaged</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* AI Categories Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🤖 AI Lead Insights</h3>
                            <p className="chart-subtitle">Smart categorization powered by AI</p>
                        </div>
                    </div>
                    <div className="chart-body">
                        <Doughnut data={aiCategoryChartData} options={chartOptions} />
                    </div>
                    <div className="chart-footer">
                        <div className="insight-badge hot">
                            <span className="badge-dot"></span>
                            {stats?.hot || 0} Hot Leads
                        </div>
                        <div className="insight-badge warm">
                            <span className="badge-dot"></span>
                            {stats?.warm || 0} Warm Leads
                        </div>
                        <div className="insight-badge cold">
                            <span className="badge-dot"></span>
                            {stats?.cold || 0} Cold Leads
                        </div>
                    </div>
                </div>

                {/* Lead Status Chart */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📈 Pipeline Status</h3>
                            <p className="chart-subtitle">Lead distribution across stages</p>
                        </div>
                    </div>
                    <div className="chart-body">
                        <Bar data={statusChartData} options={barChartOptions} />
                    </div>
                </div>
            </div>

            {/* Additional Widgets: Calendar & Email Analytics */}
            <div className="charts-grid" style={{ marginTop: '24px' }}>
                {/* Upcoming Events */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📅 Upcoming Events</h3>
                            <p className="chart-subtitle">Your schedule for the next few days</p>
                        </div>
                        <button
                            className="btn btn-sm"
                            onClick={() => navigate('/calendar')}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                            View All
                        </button>
                    </div>
                    <div className="chart-body" style={{ overflowY: 'auto', maxHeight: '300px' }}>
                        {upcomingEvents && upcomingEvents.length > 0 ? (
                            <div className="events-list">
                                {upcomingEvents.slice(0, 5).map((event, index) => (
                                    <div key={index} className="event-item" style={{
                                        padding: '12px',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <div className="event-date" style={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            color: '#3b82f6',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            minWidth: '50px'
                                        }}>
                                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                                {new Date(event.start_time).getDate()}
                                            </div>
                                            <div style={{ fontSize: '10px' }}>
                                                {new Date(event.start_time).toLocaleString('default', { month: 'short' })}
                                            </div>
                                        </div>
                                        <div className="event-details">
                                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px' }}>{event.title}</h4>
                                            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                                {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
                                <p>No upcoming events</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/calendar')}
                                    style={{ marginTop: '12px' }}
                                >
                                    View Calendar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Analytics */}
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📧 Email Analytics</h3>
                            <p className="chart-subtitle">Campaign performance overview</p>
                        </div>
                        <button
                            className="btn btn-sm"
                            onClick={() => navigate('/emails')}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                            View All
                        </button>
                    </div>
                    <div className="chart-body">
                        {emailStats ? (
                            <div className="email-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="email-stat-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px' }}>Sent</h4>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                                        {emailStats?.sent || 0}
                                    </p>
                                </div>
                                <div className="email-stat-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px' }}>Opened</h4>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                                        {emailStats?.opened || 0}
                                    </p>
                                </div>
                                <div className="email-stat-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px' }}>Clicked</h4>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                                        {emailStats?.clicked || 0}
                                    </p>
                                </div>
                                <div className="email-stat-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 8px' }}>Replied</h4>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                                        {emailStats?.replied || 0}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📧</div>
                                <p>No email data available</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/emails')}
                                    style={{ marginTop: '12px' }}
                                >
                                    Go to Emails
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Module Access Cards */}
            <div className="module-access-section" style={{ marginTop: '32px' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '18px' }}>
                    📦 Quick Module Access
                </h3>
                <div className="quick-actions-grid">
                    <button
                        className="action-btn action-btn-primary"
                        onClick={() => navigate('/calendar')}
                    >
                        <span className="action-icon">📅</span>
                        <div className="action-content">
                            <span className="action-label">Calendar</span>
                            <span className="action-desc">Manage events & schedules</span>
                        </div>
                    </button>
                    <button
                        className="action-btn action-btn-success"
                        onClick={() => navigate('/emails')}
                    >
                        <span className="action-icon">📧</span>
                        <div className="action-content">
                            <span className="action-label">Email Center</span>
                            <span className="action-desc">Send & track emails</span>
                        </div>
                    </button>
                    <button
                        className="action-btn action-btn-info"
                        onClick={() => navigate('/documents')}
                    >
                        <span className="action-icon">📁</span>
                        <div className="action-content">
                            <span className="action-label">Documents</span>
                            <span className="action-desc">Upload & manage files</span>
                        </div>
                    </button>
                    <button
                        className="action-btn action-btn-purple"
                        onClick={() => navigate('/analytics')}
                    >
                        <span className="action-icon">📈</span>
                        <div className="action-content">
                            <span className="action-label">Analytics</span>
                            <span className="action-desc">View detailed insights</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card" style={{ marginTop: '32px' }}>
                <h3 className="quick-actions-title">⚡ Quick Actions</h3>
                <div className="quick-actions-grid">
                    <button
                        className="action-btn action-btn-primary"
                        onClick={() => navigate('/leads')}
                    >
                        <span className="action-icon">👥</span>
                        <div className="action-content">
                            <span className="action-label">View All Leads</span>
                            <span className="action-desc">Manage your pipeline</span>
                        </div>
                    </button>
                    <button
                        className="action-btn action-btn-success"
                        onClick={() => navigate('/leads/new')}
                    >
                        <span className="action-icon">➕</span>
                        <div className="action-content">
                            <span className="action-label">Add New Lead</span>
                            <span className="action-desc">Create opportunity</span>
                        </div>
                    </button>
                    <button
                        className="action-btn action-btn-info"
                        onClick={() => navigate('/deals')}
                    >
                        <span className="action-icon">💼</span>
                        <div className="action-content">
                            <span className="action-label">View Deals</span>
                            <span className="action-desc">Track your deals</span>
                        </div>
                    </button>
                    <button
                        className="action-btn action-btn-purple"
                        onClick={() => navigate('/clients')}
                    >
                        <span className="action-icon">🏢</span>
                        <div className="action-content">
                            <span className="action-label">Manage Clients</span>
                            <span className="action-desc">View client list</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
