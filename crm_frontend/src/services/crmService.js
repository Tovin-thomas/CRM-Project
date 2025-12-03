/**
 * CRM service for all CRM-related API calls.
 * Handles leads, contacts, deals, tasks, notes, activities.
 */
import api from './api';

const crmService = {
    // ========== LEADS ==========
    getLeads: () => api.get('/leads/'),
    getLead: (id) => api.get(`/leads/${id}/`),
    createLead: (data) => api.post('/leads/', data),
    updateLead: (id, data) => api.put(`/leads/${id}/`, data),
    deleteLead: (id) => api.delete(`/leads/${id}/`),
    getLeadStatistics: () => api.get('/leads/statistics/'),

    // ========== CONTACTS ==========
    getContacts: (leadId = null) => {
        const url = leadId ? `/contacts/?lead_id=${leadId}` : '/contacts/';
        return api.get(url);
    },
    getContact: (id) => api.get(`/contacts/${id}/`),
    createContact: (data) => api.post('/contacts/', data),
    updateContact: (id, data) => api.put(`/contacts/${id}/`, data),
    deleteContact: (id) => api.delete(`/contacts/${id}/`),

    // ========== DEALS ==========
    getDeals: () => api.get('/deals/'),
    getDeal: (id) => api.get(`/deals/${id}/`),
    createDeal: (data) => api.post('/deals/', data),
    updateDeal: (id, data) => api.put(`/deals/${id}/`, data),
    deleteDeal: (id) => api.delete(`/deals/${id}/`),

    // ========== TASKS ==========
    getTasks: (userId = null) => {
        const url = userId ? `/tasks/?user_id=${userId}` : '/tasks/';
        return api.get(url);
    },
    getTask: (id) => api.get(`/tasks/${id}/`),
    createTask: (data) => api.post('/tasks/', data),
    updateTask: (id, data) => api.put(`/tasks/${id}/`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}/`),

    // ========== NOTES ==========
    getNotes: () => api.get('/notes/'),
    getNote: (id) => api.get(`/notes/${id}/`),
    createNote: (data) => api.post('/notes/', data),
    updateNote: (id, data) => api.put(`/notes/${id}/`, data),
    deleteNote: (id) => api.delete(`/notes/${id}/`),

    // ========== ACTIVITIES ==========
    getActivities: () => api.get('/activities/'),
    getActivity: (id) => api.get(`/activities/${id}/`),
    createActivity: (data) => api.post('/activities/', data),

    // ========== AI FEATURES ==========
    scoreLead: (leadId) => api.post('/ai/score-lead/', { lead_id: leadId }),
    categorizeLead: (leadId) => api.post('/ai/categorize-lead/', { lead_id: leadId }),
    updateAllAI: (leadId) => api.post('/ai/update-all/', { lead_id: leadId }),
    generateEmail: (emailType, context) =>
        api.post('/ai/generate-email/', { email_type: emailType, context }),
    analyzeSentiment: (text, detailed = false) =>
        api.post('/ai/analyze-sentiment/', { text, detailed }),

    // ========== CLIENTS ==========
    getClients: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/clients/${queryString ? `?${queryString}` : ''}`);
    },
    getClient: (id) => api.get(`/clients/${id}/`),
    createClient: (data) => api.post('/clients/', data),
    updateClient: (id, data) => api.put(`/clients/${id}/`, data),
    deleteClient: (id) => api.delete(`/clients/${id}/`),
    getClientStatistics: () => api.get('/clients/statistics/'),
    getClientProjects: (clientId) => api.get(`/clients/${clientId}/projects/`),
    getClientInteractions: (clientId) => api.get(`/clients/${clientId}/interactions/`),
    getHighValueClients: () => api.get('/clients/high_value/'),
    getLongTermClients: () => api.get('/clients/long_term/'),

    // ========== CLIENT PROJECTS ==========
    getProjects: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/projects/${queryString ? `?${queryString}` : ''}`);
    },
    getProject: (id) => api.get(`/projects/${id}/`),
    createProject: (data) => api.post('/projects/', data),
    updateProject: (id, data) => api.put(`/projects/${id}/`, data),
    deleteProject: (id) => api.delete(`/projects/${id}/`),

    // ========== CLIENT INTERACTIONS ==========
    getInteractions: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/interactions/${queryString ? `?${queryString}` : ''}`);
    },
    getInteraction: (id) => api.get(`/interactions/${id}/`),
    createInteraction: (data) => api.post('/interactions/', data),
    updateInteraction: (id, data) => api.put(`/interactions/${id}/`, data),
    deleteInteraction: (id) => api.delete(`/interactions/${id}/`),

    // ========== EMAILS ==========
    getEmails: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/emails/emails/${queryString ? `?${queryString}` : ''}`);
    },
    getEmail: (id) => api.get(`/emails/emails/${id}/`),
    sendEmail: (data) => api.post('/emails/emails/send/', data),
    createEmail: (data) => api.post('/emails/emails/', data),
    getEmailTemplates: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/emails/templates/${queryString ? `?${queryString}` : ''}`);
    },
    getEmailCampaigns: () => api.get('/emails/campaigns/'),
    getEmailStatistics: () => api.get('/emails/emails/statistics/'),

    // ========== CALENDAR ==========
    getEvents: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/calendar/events/${queryString ? `?${queryString}` : ''}`);
    },
    getEvent: (id) => api.get(`/calendar/events/${id}/`),
    createEvent: (data) => api.post('/calendar/events/', data),
    updateEvent: (id, data) => api.put(`/calendar/events/${id}/`, data),
    deleteEvent: (id) => api.delete(`/calendar/events/${id}/`),
    getTodayEvents: () => api.get('/calendar/events/today/'),
    getUpcomingEvents: () => api.get('/calendar/events/upcoming/'),
    getMyAvailability: () => api.get('/calendar/availability/my_availability/'),
    updateAvailability: (id, data) => api.put(`/calendar/availability/${id}/`, data),

    // ========== DOCUMENTS ==========
    getDocuments: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/documents/documents/${queryString ? `?${queryString}` : ''}`);
    },
    getDocument: (id) => api.get(`/documents/documents/${id}/`),
    uploadDocument: (data) => {
        // Need to handle multipart/form-data for file uploads
        return api.post('/documents/documents/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    deleteDocument: (id) => api.delete(`/documents/documents/${id}/`),
    downloadDocument: (id) => api.get(`/documents/documents/${id}/download/`, { responseType: 'blob' }),
    getFolders: () => api.get('/documents/folders/'),
    createFolder: (data) => api.post('/documents/folders/', data),
    getMyDocuments: () => api.get('/documents/documents/my_documents/'),
};

export default crmService;
