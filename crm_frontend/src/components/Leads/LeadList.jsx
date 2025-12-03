/**
 * LeadList component.
 * Displays all leads in a table with AI scores and categories.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import crmService from '../../services/crmService';

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const response = await crmService.getLeads();
            setLeads(response.data.results || response.data);
        } catch (err) {
            setError('Failed to load leads');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;

        try {
            await crmService.deleteLead(id);
            setLeads(leads.filter(lead => lead.id !== id));
        } catch (err) {
            alert('Failed to delete lead');
        }
    };

    const handleUpdateAI = async (id) => {
        try {
            await crmService.updateAllAI(id);
            loadLeads(); // Reload to show updated scores
            alert('AI fields updated successfully!');
        } catch (err) {
            alert('Failed to update AI fields');
        }
    };

    const getCategoryBadge = (category) => {
        const badges = {
            hot: 'badge-danger',
            warm: 'badge-warning',
            cold: 'badge-info',
        };
        return `badge ${badges[category] || 'badge-secondary'}`;
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'var(--success)';
        if (score >= 40) return 'var(--warning)';
        return 'var(--gray-500)';
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const filteredLeads = leads.filter(lead => {
        const term = searchTerm.toLowerCase();
        return (
            (lead.name && lead.name.toLowerCase().includes(term)) ||
            (lead.email && lead.email.toLowerCase().includes(term)) ||
            (lead.company && lead.company.toLowerCase().includes(term))
        );
    });

    if (loading) return <div className="loading">Loading leads...</div>;

    return (
        <div className="container">
            <div className="flex-between mb-20">
                <div>
                    <h1 className="page-title">Leads Management</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Track and score your potential customers</p>
                </div>
                <Link to="/leads/new" className="btn btn-primary">
                    + Add New Lead
                </Link>
            </div>

            <div className="card mb-20">
                <div className="card-body" style={{ padding: '15px' }}>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="form-control"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card">
                <div className="data-table">
                    <table className="table" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <colgroup>
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '18%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '10%' }} />
                            <col style={{ width: '11%' }} />
                            <col style={{ width: '18%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Lead Name</th>
                                <th>Contact Info</th>
                                <th>Status</th>
                                <th>AI Score</th>
                                <th>Category</th>
                                <th>Source</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center" style={{ padding: '40px' }}>
                                        <div style={{ color: 'var(--gray-500)' }}>
                                            No leads found matching your search.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="table-row-hover">
                                        <td>
                                            <div className="contact-name-cell">
                                                <div className="avatar-circle" style={{ backgroundColor: 'var(--primary-teal-light)' }}>
                                                    {getInitials(lead.name)}
                                                </div>
                                                <div>
                                                    <div className="contact-name-text" style={{
                                                        maxWidth: '140px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {lead.name}
                                                    </div>
                                                    {lead.company && (
                                                        <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>
                                                            🏢 {lead.company}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-email-text" style={{
                                                maxWidth: '140px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {lead.email}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
                                                Added: {new Date(lead.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{
                                                textTransform: 'capitalize',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: 'var(--gray-700)'
                                            }}>
                                                {lead.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '4px',
                                                    background: '#eee',
                                                    borderRadius: '2px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${lead.score}%`,
                                                        height: '100%',
                                                        background: getScoreColor(lead.score)
                                                    }} />
                                                </div>
                                                <strong style={{ color: getScoreColor(lead.score) }}>
                                                    {lead.score}
                                                </strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={getCategoryBadge(lead.category)}>
                                                {lead.category?.toUpperCase() || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge" style={{
                                                background: 'var(--gray-100)',
                                                color: 'var(--gray-600)',
                                                maxWidth: '90px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'inline-block',
                                                verticalAlign: 'middle'
                                            }}>
                                                {lead.source.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex-gap-10">
                                                <button
                                                    onClick={() => handleUpdateAI(lead.id)}
                                                    className="action-btn"
                                                    title="Update AI Score"
                                                    style={{ color: 'var(--primary-teal)' }}
                                                >
                                                    🤖
                                                </button>
                                                <Link
                                                    to={`/leads/${lead.id}`}
                                                    className="action-btn"
                                                    title="View Details"
                                                >
                                                    👁️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="action-btn delete"
                                                    title="Delete Lead"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadList;
