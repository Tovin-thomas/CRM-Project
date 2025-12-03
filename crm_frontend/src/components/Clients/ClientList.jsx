/**
 * Client List Component
 * Displays all clients with filtering and search capabilities
 * Enhanced with Premium Dark Theme UI
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import crmService from '../../services/crmService';
import './Clients.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadClients();
    }, [filter]);

    const loadClients = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter !== 'all') {
                params.status = filter;
            }
            const response = await crmService.getClients(params);
            setClients(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const badges = {
            active: 'badge-success',
            inactive: 'badge-warning',
            past: 'badge-info',
            potential: 'badge-secondary'
        };
        return badges[status.toLowerCase()] || 'badge-secondary';
    };

    const getIndustryIcon = (industry) => {
        const icons = {
            technology: '💻',
            finance: '💰',
            healthcare: '🏥',
            retail: '🛍️',
            manufacturing: '🏭',
            education: '🎓',
            real_estate: '🏢',
            consulting: '💼',
            other: '📊'
        };
        return icons[industry?.toLowerCase()] || '📊';
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading clients...</p>
            </div>
        );
    }

    return (
        <div className="client-list-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">💼 Client Management</h1>
                    <p className="page-subtitle">Manage your active and past clients</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/clients/new')}
                >
                    <span className="btn-icon">➕</span> Add New Client
                </button>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Clients ({clients.length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        ✅ Active
                    </button>
                    <button
                        className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        📋 Past Clients
                    </button>
                    <button
                        className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
                        onClick={() => setFilter('inactive')}
                    >
                        ⏸️ Inactive
                    </button>
                </div>

                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search clients, contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Client Cards Grid */}
            <div className="clients-grid">
                {filteredClients.map((client) => (
                    <div
                        key={client.id}
                        className="client-card"
                        onClick={() => navigate(`/clients/${client.id}`)}
                    >
                        <div className="client-card-header">
                            <div className="client-icon-wrapper">
                                {getIndustryIcon(client.industry_type)}
                            </div>
                            <span className={`status-badge ${getStatusBadge(client.status)}`}>
                                <span className="badge-dot"></span>
                                {client.status}
                            </span>
                        </div>

                        <h3 className="client-company-name">{client.company_name}</h3>
                        <p className="client-contact-person">👤 {client.contact_person}</p>

                        <div className="client-details">
                            <div className="client-detail-item">
                                <span className="detail-icon">📧</span>
                                <span className="detail-value">{client.email}</span>
                            </div>
                            {client.phone && (
                                <div className="client-detail-item">
                                    <span className="detail-icon">📞</span>
                                    <span className="detail-value">{client.phone}</span>
                                </div>
                            )}
                            <div className="client-detail-item">
                                <span className="detail-icon">🏢</span>
                                <span className="detail-value">
                                    {client.industry_type?.replace('_', ' ')}
                                </span>
                            </div>
                            {client.contract_value && (
                                <div className="client-detail-item highlight">
                                    <span className="detail-icon">💰</span>
                                    <span className="detail-value contract-value">
                                        ${parseFloat(client.contract_value).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="client-card-footer">
                            <div className="client-meta">
                                <span className="meta-item">📊 {client.project_count || 0} Projects</span>
                            </div>
                            {client.account_manager_name && (
                                <div className="client-manager">
                                    <span className="manager-avatar">👨‍💼</span>
                                    {client.account_manager_name}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredClients.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No clients found</h3>
                    <p>Try adjusting your filters or add a new client to get started.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/clients/new')}
                    >
                        Add Your First Client
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientList;
