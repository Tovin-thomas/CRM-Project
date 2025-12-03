/**
 * DealList component - displays all deals/opportunities
 * Supports both List View (Table) and Board View (Kanban)
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import crmService from '../../services/crmService';
import KanbanBoard from './KanbanBoard';

const DealList = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('board'); // 'list' or 'board'

    useEffect(() => {
        loadDeals();
    }, []);

    const loadDeals = async () => {
        try {
            const response = await crmService.getDeals();
            setDeals(response.data.results || response.data);
        } catch (err) {
            setError('Failed to load deals');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this deal?')) return;

        try {
            await crmService.deleteDeal(id);
            setDeals(deals.filter(deal => deal.id !== id));
        } catch (err) {
            alert('Failed to delete deal');
        }
    };

    // Callback when a deal is dragged to a new stage
    const handleDealUpdate = (dealId, newStage) => {
        // Update local state immediately for smooth UI
        setDeals(prevDeals =>
            prevDeals.map(deal =>
                deal.id === dealId ? { ...deal, stage: newStage } : deal
            )
        );

        // TODO: Call API to update backend
        // crmService.updateDeal(dealId, { stage: newStage });
    };

    const getStageColor = (stage) => {
        const colors = {
            prospecting: '#2196F3',
            qualification: '#ff9800',
            proposal: '#9C27B0',
            negotiation: '#FF5722',
            closed_won: '#4CAF50',
            closed_lost: '#757575',
        };
        return colors[stage] || '#666';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading) return <div className="loading">Loading deals...</div>;

    return (
        <div className="container">
            <div className="flex-between mb-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1>Deals & Opportunities</h1>

                    {/* View Toggle */}
                    <div className="view-toggle" style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '6px' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
                            style={{ borderRadius: '4px', border: 'none', background: viewMode === 'list' ? 'var(--primary-teal)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--gray-600)' }}
                        >
                            📋 List
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={`btn btn-sm ${viewMode === 'board' ? 'btn-primary' : ''}`}
                            style={{ borderRadius: '4px', border: 'none', background: viewMode === 'board' ? 'var(--primary-teal)' : 'transparent', color: viewMode === 'board' ? 'white' : 'var(--gray-600)' }}
                        >
                            📊 Board
                        </button>
                    </div>
                </div>

                <Link to="/deals/new" className="btn btn-primary">
                    + Add New Deal
                </Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {viewMode === 'board' ? (
                <KanbanBoard deals={deals} onDealUpdate={handleDealUpdate} />
            ) : (
                <div className="card">
                    <table className="table data-table">
                        <thead>
                            <tr>
                                <th>Deal Name</th>
                                <th>Lead</th>
                                <th>Value</th>
                                <th>Stage</th>
                                <th>Probability</th>
                                <th>Close Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deals.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center" style={{ padding: '20px', textAlign: 'center' }}>
                                        No deals found. Create your first deal!
                                    </td>
                                </tr>
                            ) : (
                                deals.map((deal) => (
                                    <tr key={deal.id}>
                                        <td><strong>{deal.title}</strong></td>
                                        <td>{deal.lead_name || '-'}</td>
                                        <td><strong>{formatCurrency(deal.value)}</strong></td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: getStageColor(deal.stage),
                                                    color: 'white',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {deal.stage.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{deal.probability}%</td>
                                        <td>
                                            {deal.expected_close_date
                                                ? new Date(deal.expected_close_date).toLocaleDateString()
                                                : '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Link
                                                    to={`/deals/${deal.id}`}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '5px 10px', fontSize: '12px' }}
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(deal.id)}
                                                    className="btn btn-danger"
                                                    style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#fed7d7', color: '#742a2a', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Summary Card (Visible in both views) */}
            {deals.length > 0 && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3 className="card-header">Pipeline Summary</h3>
                    <div className="grid-2" style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>Total Deals</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{deals.length}</p>
                        </div>
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>Total Value</p>
                            <p style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
                                {formatCurrency(deals.reduce((sum, deal) => sum + parseFloat(deal.value || 0), 0))}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>Won Deals</p>
                            <p style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
                                {deals.filter(d => d.stage === 'closed_won').length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealList;
