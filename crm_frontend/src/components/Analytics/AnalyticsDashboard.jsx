/**
 * Analytics Dashboard Component
 * 
 * Displays key performance indicators (KPIs) and visual charts for the CRM.
 * Uses Chart.js for data visualization with a Premium Dark Theme.
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import crmService from '../../services/crmService';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsDashboard = () => {
    // State for storing dashboard statistics
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches analytics data when the component mounts.
     */
    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            // In a real app, this would fetch aggregated data from the backend
            const response = await crmService.getLeadStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
        </div>
    );

    // --- Chart Data Configuration ---

    // Common Chart Options for Dark Theme
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter' } }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            }
        }
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: [45000, 52000, 48000, 65000, 72000, 85000],
                borderColor: '#14b8a6', // Primary Teal
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(20, 184, 166, 0.5)');
                    gradient.addColorStop(1, 'rgba(20, 184, 166, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#14b8a6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            },
        ],
    };

    const dealStageData = {
        labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
        datasets: [
            {
                label: 'Deals',
                data: [12, 19, 15, 8, 25, 6],
                backgroundColor: [
                    'rgba(20, 184, 166, 0.8)', // Teal
                    'rgba(6, 182, 212, 0.8)',  // Cyan
                    'rgba(59, 130, 246, 0.8)', // Blue
                    'rgba(245, 158, 11, 0.8)', // Amber
                    'rgba(16, 185, 129, 0.8)', // Green
                    'rgba(100, 116, 139, 0.8)', // Slate
                ],
                borderRadius: 6,
                borderWidth: 0
            },
        ],
    };

    const leadSourceData = {
        labels: ['Website', 'Referral', 'Social', 'Email', 'Cold Call'],
        datasets: [
            {
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#14b8a6',
                    '#06b6d4',
                    '#3b82f6',
                    '#f59e0b',
                    '#8b5cf6',
                ],
                borderWidth: 0,
                hoverOffset: 10
            },
        ],
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Analytics Dashboard</h1>
                    <p className="page-subtitle">Real-time insights and performance metrics</p>
                </div>
                <button className="btn btn-primary">
                    <span>📥</span> Export Report
                </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">$367,000</div>
                    <div className="stat-change positive">
                        <span>↗ 23%</span>
                        <span>vs last month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Active Deals</div>
                    <div className="stat-value">54</div>
                    <div className="stat-change positive">
                        <span>↗ 12%</span>
                        <span>vs last month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Conversion Rate</div>
                    <div className="stat-value">28%</div>
                    <div className="stat-change positive">
                        <span>↗ 6%</span>
                        <span>vs last month</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Avg Deal Size</div>
                    <div className="stat-value">$6,796</div>
                    <div className="stat-change negative">
                        <span>↘ 3%</span>
                        <span>vs last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid-2">
                {/* Revenue Chart */}
                <div className="card">
                    <div className="card-header">
                        <span>Revenue Trend</span>
                        <select className="form-control" style={{ width: 'auto', padding: '4px 8px' }}>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="card-body" style={{ height: '300px' }}>
                        <Line data={revenueData} options={commonOptions} />
                    </div>
                </div>

                {/* Deal Stage Chart */}
                <div className="card">
                    <div className="card-header">Deals by Stage</div>
                    <div className="card-body" style={{ height: '300px' }}>
                        <Bar data={dealStageData} options={commonOptions} />
                    </div>
                </div>

                {/* Lead Sources */}
                <div className="card">
                    <div className="card-header">Lead Sources</div>
                    <div className="card-body" style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '300px' }}>
                            <Doughnut data={leadSourceData} options={{
                                ...commonOptions,
                                plugins: {
                                    ...commonOptions.plugins,
                                    legend: { position: 'right', labels: { color: '#94a3b8' } }
                                }
                            }} />
                        </div>
                    </div>
                </div>

                {/* Top Performers Table */}
                <div className="card">
                    <div className="card-header">Top Performing Sales Reps</div>
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rep Name</th>
                                    <th>Deals</th>
                                    <th>Revenue</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JS</div>
                                            <strong>John Smith</strong>
                                        </div>
                                    </td>
                                    <td>15</td>
                                    <td>$125,000</td>
                                    <td><span className="badge badge-success">Excellent</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SJ</div>
                                            <strong>Sarah Johnson</strong>
                                        </div>
                                    </td>
                                    <td>12</td>
                                    <td>$98,000</td>
                                    <td><span className="badge badge-success">Excellent</span></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>MD</div>
                                            <strong>Mike Davis</strong>
                                        </div>
                                    </td>
                                    <td>10</td>
                                    <td>$75,000</td>
                                    <td><span className="badge badge-info">Good</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
