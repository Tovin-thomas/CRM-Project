/**
 * Main App component with new sidebar layout
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import LeadList from './components/Leads/LeadList';
import LeadForm from './components/Leads/LeadForm';
import LeadDetail from './components/Leads/LeadDetail';
import ContactList from './components/Contacts/ContactList';
import ContactForm from './components/Contacts/ContactForm';
import DealList from './components/Deals/DealList';
import DealForm from './components/Deals/DealForm';
import NoteList from './components/Notes/NoteList';
import ActivityTimeline from './components/Activities/ActivityTimeline';
import Tasks from './components/Tasks/Tasks';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import Profile from './components/Profile/Profile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ClientList from './components/Clients/ClientList';
import EmailList from './components/Emails/EmailList';
import CalendarView from './components/Calendar/CalendarView';
import DocumentList from './components/Documents/DocumentList';

// Protected Route wrapper with new layout
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="app-content">
                <Header />
                <div className="container">{children}</div>
            </div>
        </div>
    );
};

// Public Route wrapper
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    if (isAuthenticated) return <Navigate to="/dashboard" />;

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/leads" element={<ProtectedRoute><LeadList /></ProtectedRoute>} />
                    <Route path="/leads/new" element={<ProtectedRoute><LeadForm /></ProtectedRoute>} />
                    <Route path="/leads/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
                    <Route path="/leads/:id/edit" element={<ProtectedRoute><LeadForm /></ProtectedRoute>} />
                    <Route path="/contacts" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
                    <Route path="/contacts/new" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
                    <Route path="/contacts/:id/edit" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
                    <Route path="/deals" element={<ProtectedRoute><DealList /></ProtectedRoute>} />
                    <Route path="/deals/new" element={<ProtectedRoute><DealForm /></ProtectedRoute>} />
                    <Route path="/deals/:id/edit" element={<ProtectedRoute><DealForm /></ProtectedRoute>} />
                    <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                    <Route path="/notes" element={<ProtectedRoute><NoteList /></ProtectedRoute>} />
                    <Route path="/activities" element={<ProtectedRoute><ActivityTimeline /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                    <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
                    <Route path="/emails" element={<ProtectedRoute><EmailList /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><DocumentList /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
