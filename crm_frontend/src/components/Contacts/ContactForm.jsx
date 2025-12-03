/**
 * ContactForm component - create or edit a contact
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import crmService from '../../services/crmService';

const ContactForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [leads, setLeads] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        lead: '',
        is_primary: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadLeads();
        if (isEdit) {
            loadContact();
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

    const loadContact = async () => {
        try {
            const response = await crmService.getContact(id);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to load contact');
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await crmService.updateContact(id, formData);
            } else {
                await crmService.createContact(formData);
            }
            navigate('/contacts');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="mb-20">{isEdit ? 'Edit Contact' : 'Create New Contact'}</h1>

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
                            <label>Position</label>
                            <input
                                type="text"
                                name="position"
                                className="form-control"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="e.g., CEO, Manager"
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
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="is_primary"
                                    checked={formData.is_primary}
                                    onChange={handleChange}
                                />
                                <span>Primary Contact</span>
                            </label>
                            <small style={{ color: '#666' }}>Mark this as the main contact for the lead</small>
                        </div>
                    </div>

                    <div className="flex gap-10">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/contacts')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
