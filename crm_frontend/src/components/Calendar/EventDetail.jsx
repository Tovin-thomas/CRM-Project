import React from 'react';
import './Calendar.css';

const EventDetail = ({ event, onClose, onDelete }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeColor = (type) => {
        const colors = {
            meeting: '#3b82f6',
            call: '#f59e0b',
            task: '#10b981',
            deadline: '#ef4444',
            email: '#8b5cf6',
            other: '#6b7280'
        };
        return colors[type] || colors.other;
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            low: 'badge-secondary',
            medium: 'badge-info',
            high: 'badge-primary',
            urgent: 'badge-danger'
        };
        return badges[priority] || 'badge-secondary';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content event-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>{event.title}</h2>
                        <div className="event-meta">
                            <span className={`badge ${getPriorityBadge(event.priority)}`}>
                                {event.priority?.toUpperCase()}
                            </span>
                            <span className="event-type-badge" style={{ background: getEventTypeColor(event.event_type) }}>
                                {event.event_type?.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="event-detail-content">
                    <div className="detail-section">
                        <div className="detail-icon">🕐</div>
                        <div className="detail-info">
                            <div className="detail-label">Time</div>
                            <div className="detail-value">
                                <strong>Start:</strong> {formatDateTime(event.start_time)}
                            </div>
                            <div className="detail-value">
                                <strong>End:</strong> {formatDateTime(event.end_time)}
                            </div>
                            {event.all_day && (
                                <div className="detail-value">
                                    <span className="badge badge-info">All Day Event</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {event.location && (
                        <div className="detail-section">
                            <div className="detail-icon">📍</div>
                            <div className="detail-info">
                                <div className="detail-label">Location</div>
                                <div className="detail-value">{event.location}</div>
                            </div>
                        </div>
                    )}

                    {event.meeting_link && (
                        <div className="detail-section">
                            <div className="detail-icon">🔗</div>
                            <div className="detail-info">
                                <div className="detail-label">Meeting Link</div>
                                <div className="detail-value">
                                    <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                                        {event.meeting_link}
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {event.description && (
                        <div className="detail-section">
                            <div className="detail-icon">📝</div>
                            <div className="detail-info">
                                <div className="detail-label">Description</div>
                                <div className="detail-value">{event.description}</div>
                            </div>
                        </div>
                    )}

                    <div className="detail-section">
                        <div className="detail-icon">👤</div>
                        <div className="detail-info">
                            <div className="detail-label">Organizer</div>
                            <div className="detail-value">{event.organizer_name || 'You'}</div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <div className="detail-icon">📊</div>
                        <div className="detail-info">
                            <div className="detail-label">Status</div>
                            <div className="detail-value">
                                <span className={`badge ${event.status === 'completed' ? 'badge-success' :
                                        event.status === 'cancelled' ? 'badge-danger' :
                                            'badge-info'
                                    }`}>
                                    {event.status?.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-danger" onClick={() => onDelete(event.id)}>
                        🗑️ Delete Event
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
