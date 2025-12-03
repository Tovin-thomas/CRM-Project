import React, { useState, useEffect } from 'react';
import crmService from '../../services/crmService';
import EventForm from './EventForm';
import EventDetail from './EventDetail';
import './Calendar.css';

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        loadEvents();
    }, [currentDate]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const response = await crmService.getEvents();
            setEvents(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.start_time);
                return eventDate.getDate() === day &&
                    eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear();
            });

            const isTodayClass = isToday(day) ? 'today' : '';

            days.push(
                <div key={day} className={`calendar-day ${isTodayClass}`}>
                    <div className="day-number">{day}</div>
                    <div className="day-events">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                className={`event-chip ${event.event_type}`}
                                onClick={() => setSelectedEvent(event)}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await crmService.deleteEvent(eventId);
                setSelectedEvent(null);
                loadEvents();
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div>
                    <h1 className="page-title">📅 Calendar</h1>
                    <p className="page-subtitle">Manage your schedule</p>
                </div>
                <div className="calendar-controls">
                    <button className="btn btn-outline" onClick={() => changeMonth(-1)}>◀</button>
                    <h2 className="current-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button className="btn btn-outline" onClick={() => changeMonth(1)}>▶</button>
                    <button className="btn btn-primary ml-4" onClick={() => setShowModal(true)}>
                        ➕ New Event
                    </button>
                </div>
            </div>

            <div className="calendar-grid">
                <div className="calendar-weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
                <div className="calendar-days">
                    {loading ? <div className="loading">Loading calendar...</div> : renderCalendarDays()}
                </div>
            </div>

            {showModal && (
                <EventForm
                    onClose={() => setShowModal(false)}
                    onEventCreated={loadEvents}
                />
            )}

            {selectedEvent && (
                <EventDetail
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
};

export default CalendarView;
