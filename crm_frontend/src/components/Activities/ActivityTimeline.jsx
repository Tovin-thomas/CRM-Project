/**
 * ActivityTimeline component - displays chronological activity feed
 */
import React, { useState, useEffect } from 'react';
import crmService from '../../services/crmService';

const ActivityTimeline = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const response = await crmService.getActivities();
            setActivities(response.data.results || response.data);
        } catch (err) {
            setError('Failed to load activities');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        const icons = {
            call: '📞',
            email: '📧',
            meeting: '🤝',
            note: '📝',
            task: '✅',
            other: '📌',
        };
        return icons[type] || icons.other;
    };

    const getActivityColor = (type) => {
        const colors = {
            call: '#2196F3',
            email: '#4CAF50',
            meeting: '#FF9800',
            note: '#9C27B0',
            task: '#00BCD4',
            other: '#757575',
        };
        return colors[type] || colors.other;
    };

    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(a => a.activity_type === filter);

    if (loading) return <div className="loading">Loading activities...</div>;

    return (
        <div className="container">
            <h1 className="mb-20">Activity Timeline</h1>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Filter Bar */}
            <div className="card mb-20">
                <div className="flex gap-10">
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All Activities
                    </button>
                    <button
                        className={`btn ${filter === 'call' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('call')}
                    >
                        📞 Calls
                    </button>
                    <button
                        className={`btn ${filter === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('email')}
                    >
                        📧 Emails
                    </button>
                    <button
                        className={`btn ${filter === 'meeting' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('meeting')}
                    >
                        🤝 Meetings
                    </button>
                    <button
                        className={`btn ${filter === 'note' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('note')}
                    >
                        📝 Notes
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="card">
                {filteredActivities.length === 0 ? (
                    <p className="text-center" style={{ padding: '40px', color: '#666' }}>
                        No activities found.
                    </p>
                ) : (
                    <div>
                        {filteredActivities.map((activity, index) => (
                            <div
                                key={activity.id}
                                style={{
                                    padding: '20px',
                                    borderBottom: index < filteredActivities.length - 1 ? '1px solid #eee' : 'none',
                                    position: 'relative',
                                    paddingLeft: '60px',
                                }}
                            >
                                {/* Icon */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '20px',
                                        top: '20px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: getActivityColor(activity.activity_type),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '20px',
                                    }}
                                >
                                    {getActivityIcon(activity.activity_type)}
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="flex-between mb-10">
                                        <div>
                                            <strong style={{ textTransform: 'capitalize' }}>
                                                {activity.activity_type.replace('_', ' ')}
                                            </strong>
                                            {activity.lead_name && (
                                                <span style={{ color: '#666', marginLeft: '10px' }}>
                                                    • {activity.lead_name}
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ color: '#666', fontSize: '14px' }}>
                                            {new Date(activity.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0 }}>{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            {activities.length > 0 && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3 className="card-header">Activity Summary</h3>
                    <div className="grid grid-4">
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>Total Activities</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>{activities.length}</p>
                        </div>
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>📞 Calls</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>
                                {activities.filter(a => a.activity_type === 'call').length}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>📧 Emails</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>
                                {activities.filter(a => a.activity_type === 'email').length}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: '#666', fontSize: '14px' }}>🤝 Meetings</p>
                            <p style={{ fontSize: '24px', fontWeight: '700' }}>
                                {activities.filter(a => a.activity_type === 'meeting').length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityTimeline;
