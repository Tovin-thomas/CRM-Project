import React, { useState } from 'react';
import crmService from '../../services/crmService';
import './Emails.css';

const EmailComposer = ({ onClose, onEmailSent }) => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        body: '',
        cc: '',
        bcc: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCc, setShowCc] = useState(false);

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
            // In a real app, you might want to validate email addresses here
            await crmService.sendEmail(formData);
            onEmailSent();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content email-composer-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Compose Email</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="composer-form">
                    <div className="form-group">
                        <div className="input-with-actions">
                            <input
                                type="email"
                                name="to"
                                className="form-control"
                                value={formData.to}
                                onChange={handleChange}
                                placeholder="To"
                                required
                            />
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setShowCc(!showCc)}
                            >
                                Cc/Bcc
                            </button>
                        </div>
                    </div>

                    {showCc && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="cc"
                                    className="form-control"
                                    value={formData.cc}
                                    onChange={handleChange}
                                    placeholder="Cc"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="bcc"
                                    className="form-control"
                                    value={formData.bcc}
                                    onChange={handleChange}
                                    placeholder="Bcc"
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <input
                            type="text"
                            name="subject"
                            className="form-control"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            required
                        />
                    </div>

                    <div className="form-group flex-grow">
                        <textarea
                            name="body"
                            className="form-control composer-body"
                            value={formData.body}
                            onChange={handleChange}
                            placeholder="Write your message here..."
                            required
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Discard
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : '📨 Send Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailComposer;
