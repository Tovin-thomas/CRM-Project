/**
 * LeadForm component.
 * Create or edit a lead.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import crmService from '../../services/crmService';

const LeadForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        status: 'new',
        source: 'website',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            loadLead();
        }
    }, [id]);

    const loadLead = async () => {
        try {
            const response = await crmService.getLead(id);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to load lead');
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
                await crmService.updateLead(id, formData);
            } else {
                await crmService.createLead(formData);
            }
            navigate('/leads');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="mb-20">{isEdit ? 'Edit Lead' : 'Create New Lead'}</h1>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Company</label>
                            <input
                                type="text"
                                name="company"
                                className="form-control"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Website</label>
                            <input
                                type="url"
                                name="website"
                                className="form-control"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://"
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                className="form-control"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="lost">Lost</option>
                                <option value="converted">Converted</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Source</label>
                            <select
                                name="source"
                                className="form-control"
                                value={formData.source}
                                onChange={handleChange}
                            >
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="social_media">Social Media</option>
                                <option value="email_campaign">Email Campaign</option>
                                <option value="cold_call">Cold Call</option>
                                <option value="other">Other</option>
                            </select>
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
                            placeholder="Additional notes about this lead..."
                        />
                    </div>

                    <div className="flex gap-10">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/leads')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;
