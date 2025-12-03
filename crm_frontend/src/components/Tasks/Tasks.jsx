/**
 * Tasks component - Enhanced task management interface.
 */
import React, { useState, useEffect } from 'react';
import crmService from '../../services/crmService';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, in_progress, completed

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await crmService.getTasks();
            setTasks(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: '#dc2626',
            high: '#f59e0b',
            medium: '#3b82f6',
            low: '#10b981',
        };
        return colors[priority] || '#666';
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            urgent: '🔥',
            high: '⚠️',
            medium: '📌',
            low: '✅',
        };
        return icons[priority] || '📋';
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'badge-warning',
            in_progress: 'badge-info',
            completed: 'badge-success',
            cancelled: 'badge-danger',
        };
        return classes[status] || 'badge-secondary';
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await crmService.updateTask(taskId, { status: newStatus });
            loadTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const taskStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    if (loading) return <div className="loading">Loading tasks...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 className="page-title">📋 My Tasks</h1>
            </div>

            {/* Task Statistics */}
            <div className="stats-grid" style={{ marginBottom: '30px' }}>
                <div className="stat-card" onClick={() => setFilter('all')} style={{ cursor: 'pointer', opacity: filter === 'all' ? 1 : 0.7 }}>
                    <div className="stat-label">Total Tasks</div>
                    <div className="stat-value">{taskStats.total}</div>
                </div>
                <div className="stat-card" onClick={() => setFilter('pending')} style={{ cursor: 'pointer', opacity: filter === 'pending' ? 1 : 0.7 }}>
                    <div className="stat-label">Pending</div>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>{taskStats.pending}</div>
                </div>
                <div className="stat-card" onClick={() => setFilter('in_progress')} style={{ cursor: 'pointer', opacity: filter === 'in_progress' ? 1 : 0.7 }}>
                    <div className="stat-label">In Progress</div>
                    <div className="stat-value" style={{ color: '#3b82f6' }}>{taskStats.in_progress}</div>
                </div>
                <div className="stat-card" onClick={() => setFilter('completed')} style={{ cursor: 'pointer', opacity: filter === 'completed' ? 1 : 0.7 }}>
                    <div className="stat-label">Completed</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>{taskStats.completed}</div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>
                        {filter === 'all' ? 'All Tasks' : filter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {filteredTasks.length === 0 ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                            <div style={{ fontSize: '16px' }}>No tasks found</div>
                        </div>
                    ) : (
                        <div style={{ padding: '15px' }}>
                            {filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="task-card"
                                    style={{
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginBottom: '12px',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '20px' }}>{getPriorityIcon(task.priority)}</span>
                                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                                                    {task.title}
                                                </h3>
                                            </div>
                                            {task.description && (
                                                <p style={{ margin: '0 0 12px 28px', fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginLeft: '28px' }}>
                                        {/* Status Dropdown */}
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                            className={`badge ${getStatusBadgeClass(task.status)}`}
                                            style={{
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                textTransform: 'capitalize',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        {/* Priority Badge */}
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                backgroundColor: `${getPriorityColor(task.priority)}15`,
                                                color: getPriorityColor(task.priority),
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {task.priority}
                                        </span>

                                        {/* Due Date */}
                                        {task.due_date && (
                                            <span style={{
                                                fontSize: '13px',
                                                color: '#6b7280',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                📅 {new Date(task.due_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
