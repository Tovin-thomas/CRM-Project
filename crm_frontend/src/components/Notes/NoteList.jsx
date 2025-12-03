/**
 * NoteList component - displays all notes with AI sentiment analysis
 */
import React, { useState, useEffect } from 'react';
import crmService from '../../services/crmService';

const NoteList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newNote, setNewNote] = useState({ content: '', lead: '', contact: '' });
    const [leads, setLeads] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadNotes();
        loadLeads();
        loadContacts();
    }, []);

    const loadNotes = async () => {
        try {
            const response = await crmService.getNotes();
            setNotes(response.data.results || response.data);
        } catch (err) {
            setError('Failed to load notes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadLeads = async () => {
        try {
            const response = await crmService.getLeads();
            setLeads(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to load leads:', err);
        }
    };

    const loadContacts = async () => {
        try {
            const response = await crmService.getContacts();
            setContacts(response.data.results || response.data);
        } catch (err) {
            console.error('Failed to load contacts:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert empty strings to null for lead and contact
            const noteData = {
                content: newNote.content,
                lead: newNote.lead || null,
                contact: newNote.contact || null
            };
            await crmService.createNote(noteData);
            setNewNote({ content: '', lead: '', contact: '' });
            setShowForm(false);
            loadNotes(); // Reload to show new note with AI sentiment
        } catch (err) {
            console.error('Error creating note:', err);
            alert(`Failed to create note: ${JSON.stringify(err.response?.data || err.message)}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await crmService.deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            alert('Failed to delete note');
        }
    };

    const getSentimentBadge = (sentiment) => {
        const styles = {
            positive: { backgroundColor: '#4CAF50', color: 'white' },
            neutral: { backgroundColor: '#9E9E9E', color: 'white' },
            negative: { backgroundColor: '#f44336', color: 'white' },
        };
        return (
            <span className="badge" style={styles[sentiment] || styles.neutral}>
                {sentiment === 'positive' && '😊 Positive'}
                {sentiment === 'neutral' && '😐 Neutral'}
                {sentiment === 'negative' && '😞 Negative'}
            </span>
        );
    };

    if (loading) return <div className="loading">Loading notes...</div>;

    return (
        <div className="container">
            <div className="flex-between mb-20">
                <h1>Notes</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add New Note'}
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Create Note Form */}
            {showForm && (
                <div className="card mb-20">
                    <h3 className="card-header">Create New Note</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Note Content *</label>
                            <textarea
                                className="form-control"
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                rows="4"
                                required
                                placeholder="Write your note here... AI will analyze sentiment automatically!"
                            />
                        </div>

                        <div className="grid grid-2">
                            <div className="form-group">
                                <label>Lead (Optional)</label>
                                <select
                                    className="form-control"
                                    value={newNote.lead}
                                    onChange={(e) => setNewNote({ ...newNote, lead: e.target.value })}
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
                                <label>Contact (Optional)</label>
                                <select
                                    className="form-control"
                                    value={newNote.contact}
                                    onChange={(e) => setNewNote({ ...newNote, contact: e.target.value })}
                                >
                                    <option value="">Select a contact</option>
                                    {contacts.map((contact) => (
                                        <option key={contact.id} value={contact.id}>
                                            {contact.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Create Note (AI will analyze sentiment)
                        </button>
                    </form>
                </div>
            )}

            {/* Notes List */}
            <div className="card">
                <h3 className="card-header">🤖 All Notes (with AI Sentiment Analysis)</h3>
                {notes.length === 0 ? (
                    <p className="text-center" style={{ padding: '40px', color: '#666' }}>
                        No notes yet. Create your first note!
                    </p>
                ) : (
                    <div>
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer'
                                }}
                            >
                                <div className="flex-between mb-10">
                                    <div>
                                        <strong>{note.lead_name || note.contact_name || 'General Note'}</strong>
                                        <span style={{ color: '#666', marginLeft: '10px', fontSize: '14px' }}>
                                            {new Date(note.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-10">
                                        {getSentimentBadge(note.sentiment)}
                                        <button
                                            onClick={() => handleDelete(note.id)}
                                            className="btn btn-danger"
                                            style={{ padding: '5px 10px', fontSize: '12px' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p style={{ marginBottom: '10px' }}>{note.content}</p>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    <strong>AI Analysis:</strong> Polarity: {note.polarity?.toFixed(2) || 'N/A'},
                                    Subjectivity: {note.subjectivity?.toFixed(2) || 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteList;
