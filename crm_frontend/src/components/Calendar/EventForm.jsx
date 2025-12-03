import React, { useState } from 'react';
import crmService from '../../services/crmService';
import './Calendar.css';

const EventForm = ({ onClose, onEventCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'meeting',
        start_time: '',
        end_time: '',
        location: '',
        meeting_link: '',
        priority: 'medium',
        all_day: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await crmService.createEvent(formData);
            onEventCreated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Event</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Team Meeting"
                        />
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label>Event Type</label>
                            <select
                                name="event_type"
                                className="form-control"
                                value={formData.event_type}
                                onChange={handleChange}
                            >
                                <option value="meeting">Meeting</option>
                                <option value="call">Phone Call</option>
                                <option value="email">Email</option>
                                <option value="task">Task</option>
                                <option value="deadline">Deadline</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                name="priority"
                                className="form-control"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label>Start Time *</label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                className="form-control"
                                value={formData.start_time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Time *</label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                className="form-control"
                                value={formData.end_time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="all_day"
                                checked={formData.all_day}
                                onChange={handleChange}
                            />
                            {' '}All Day Event
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            className="form-control"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Conference Room A"
                        />
                    </div>

                    <div className="form-group">
                        <label>Meeting Link</label>
                        <input
                            type="url"
                            name="meeting_link"
                            className="form-control"
                            value={formData.meeting_link}
                            onChange={handleChange}
                            placeholder="https://zoom.us/..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Event details..."
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
