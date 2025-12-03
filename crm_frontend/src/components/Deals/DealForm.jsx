/**
 * DealForm component - create or edit a deal/opportunity
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import crmService from '../../services/crmService';

const DealForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [leads, setLeads] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        lead: '',
        value: '',
        stage: 'prospecting',
        probability: 10,
        expected_close_date: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadLeads();
        if (isEdit) {
            loadDeal();
        }
    }, [id]);

    const loadLeads = async () => {
        try {
            const response = await crmService.getLeads();
            setLeads(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to load leads:', err);
        }
    };

    const loadDeal = async () => {
        try {
            const response = await crmService.getDeal(id);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to load deal');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await crmService.updateDeal(id, formData);
            } else {
                await crmService.createDeal(formData);
            }
            navigate('/deals');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save deal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="mb-20">{isEdit ? 'Edit Deal' : 'Create New Deal'}</h1>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label>Deal Name *</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Q4 Software Package"
                            />
                        </div>

                        <div className="form-group">
                            <label>Lead *</label>
                            <select
                                name="lead"
                                className="form-control"
                                value={formData.lead}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a lead</option>
                                {leads.map((lead) => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.name} - {lead.company || 'No company'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Value ($) *</label>
                            <input
                                type="number"
                                name="value"
                                className="form-control"
                                value={formData.value}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="10000.00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stage</label>
                            <select
                                name="stage"
                                className="form-control"
                                value={formData.stage}
                                onChange={handleChange}
                            >
                                <option value="prospecting">Prospecting</option>
                                <option value="qualification">Qualification</option>
                                <option value="proposal">Proposal</option>
                                <option value="negotiation">Negotiation</option>
                                <option value="closed_won">Closed Won</option>
                                <option value="closed_lost">Closed Lost</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Probability (%) *</label>
                            <input
                                type="number"
                                name="probability"
                                className="form-control"
                                value={formData.probability}
                                onChange={handleChange}
                                required
                                min="0"
                                max="100"
                            />
                            <small style={{ color: '#666' }}>Likelihood of winning this deal (0-100%)</small>
                        </div>

                        <div className="form-group">
                            <label>Expected Close Date</label>
                            <input
                                type="date"
                                name="expected_close_date"
                                className="form-control"
                                value={formData.expected_close_date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Additional details about this deal..."
                        />
                    </div>

                    <div className="flex gap-10">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Deal' : 'Create Deal'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/deals')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DealForm;
