/**
 * ContactList component - displays all contacts in a table
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import crmService from '../../services/crmService';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const response = await crmService.getContacts();
            setContacts(response.data.results || response.data);
        } catch (err) {
            setError('Failed to load contacts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;

        try {
            await crmService.deleteContact(id);
            setContacts(contacts.filter(contact => contact.id !== id));
        } catch (err) {
            alert('Failed to delete contact');
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading contacts...</div>;

    return (
        <div className="container">
            <div className="flex-between mb-20">
                <div>
                    <h1 className="page-title">Contacts</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>Manage your relationships</p>
                </div>
                <Link to="/contacts/new" className="btn btn-primary">
                    + Add Contact
                </Link>
            </div>

            <div className="card mb-20">
                <div className="card-body" style={{ padding: '15px' }}>
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="form-control"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card">
                <div className="data-table">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact Info</th>
                                <th>Position</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center" style={{ padding: '40px' }}>
                                        <div style={{ color: 'var(--gray-500)' }}>
                                            No contacts found matching your search.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <tr key={contact.id} className="table-row-hover">
                                        <td>
                                            <div className="contact-name-cell">
                                                <div className="avatar-circle">
                                                    {getInitials(contact.name)}
                                                </div>
                                                <div>
                                                    <div className="contact-name-text">{contact.name}</div>
                                                    {contact.lead_name && (
                                                        <div style={{ fontSize: '11px', color: 'var(--primary-teal)' }}>
                                                            Lead: {contact.lead_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-email-text">{contact.email}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{contact.phone || '-'}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{contact.position || '-'}</div>
                                        </td>
                                        <td>
                                            {contact.is_primary ? (
                                                <span className="badge badge-success">Primary</span>
                                            ) : (
                                                <span className="badge badge-info">Standard</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex-gap-10">
                                                <Link
                                                    to={`/contacts/${contact.id}`}
                                                    className="action-btn"
                                                    title="View Details"
                                                >
                                                    👁️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="action-btn delete"
                                                    title="Delete Contact"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactList;
