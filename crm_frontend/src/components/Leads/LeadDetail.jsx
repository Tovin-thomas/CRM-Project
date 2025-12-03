/**
 * LeadDetail component.
 * Shows detailed information about a lead with AI features.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import crmService from '../../services/crmService';

const LeadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null);
    const [emailContent, setEmailContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLead();
    }, [id]);

    const loadLead = async () => {
        try {
            const response = await crmService.getLead(id);
            setLead(response.data);
        } catch (error) {
            console.error('Error loading lead:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConvert = async () => {
        if (!window.confirm('Are you sure you want to convert this lead to a client? This will mark the lead as "Converted".')) return;
        try {
            await crmService.updateLead(id, { ...lead, status: 'converted' });
            setLead({ ...lead, status: 'converted' });
            alert('Success! Lead has been converted to a Client.');
        } catch (err) {
            alert('Failed to convert lead');
        }
    };

    const handleGenerateEmail = async (type) => {
        try {
            const context = {
                contact_name: lead.name,
                company_name: lead.company || 'your company',
                sender_name: 'Sales Team',
                value_proposition: 'improve your business operations',
                benefit_area: 'efficiency and productivity',
                topic: 'our previous discussion',
                additional_info: 'I think this could be valuable for your team.',
                goals: 'your business goals',
                proposal_points: '• Benefit 1\n• Benefit 2\n• Benefit 3',
                area: 'sales and marketing',
                next_steps: 'send you more information',
            };

            const response = await crmService.generateEmail(type, context);
            setEmailContent(response.data);
        } catch (error) {
            alert('Failed to generate email');
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            hot: '#ff4444',
            warm: '#ff9800',
            cold: '#2196F3',
        };
        return colors[category] || '#666';
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!lead) return <div className="container">Lead not found</div>;

    const pipelineSteps = ['new', 'contacted', 'qualified', 'converted'];
    const currentStepIndex = pipelineSteps.indexOf(lead.status) > -1 ? pipelineSteps.indexOf(lead.status) : 0;

    return (
        <div className="container">
            {/* Header Area */}
            <div className="flex-between mb-20">
                <div>
                    <div className="flex gap-10" style={{ alignItems: 'center' }}>
                        <h1 style={{ fontSize: '28px' }}>{lead.name}</h1>
                        {lead.status === 'converted' && (
                            <span className="badge badge-success" style={{ fontSize: '14px', padding: '6px 12px' }}>
                                ✅ CLIENT
                            </span>
                        )}
                    </div>
                    <p style={{ color: 'var(--gray-500)', fontSize: '16px', marginTop: '5px' }}>
                        {lead.company ? `🏢 ${lead.company}` : ''} {lead.company && '•'} 📧 {lead.email}
                    </p>
                </div>
                <div className="flex gap-10">
                    {lead.status !== 'converted' && (
                        <button onClick={handleConvert} className="btn btn-success" style={{ padding: '10px 20px', fontSize: '15px' }}>
                            🚀 Convert to Client
                        </button>
                    )}
                    <Link to={`/leads/${id}/edit`} className="btn btn-secondary">
                        ✏️ Edit
                    </Link>
                    <button onClick={() => navigate('/leads')} className="btn btn-secondary">
                        Back
                    </button>
                </div>
            </div>

            {/* Pipeline Visual */}
            <div className="card mb-20" style={{ padding: '30px 20px' }}>
                <div className="pipeline-container">
                    {pipelineSteps.map((step, index) => (
                        <div key={step} className={`pipeline-step ${index <= currentStepIndex ? 'active' : ''}`}>
                            <div className="step-circle">
                                {index < currentStepIndex ? '✓' : index + 1}
                            </div>
                            <div className="step-label">{step.toUpperCase()}</div>
                            {index < pipelineSteps.length - 1 && <div className="step-line" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-3" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {/* Left Col: Details */}
                <div className="card">
                    <h3 className="card-header">📋 Lead Details</h3>
                    <div className="card-body" style={{ lineHeight: '2.2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#666' }}>Phone:</span>
                            <strong>{lead.phone || 'N/A'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#666' }}>Source:</span>
                            <span style={{ textTransform: 'capitalize' }}>{lead.source.replace('_', ' ')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#666' }}>Website:</span>
                            {lead.website ? (
                                <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-teal)' }}>
                                    Visit Link ↗
                                </a>
                            ) : 'N/A'}
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <span style={{ color: '#666', display: 'block', marginBottom: '5px' }}>Description:</span>
                            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#333', background: '#f9f9f9', padding: '10px', borderRadius: '6px' }}>
                                {lead.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Middle Col: AI Insights */}
                <div className="card">
                    <h3 className="card-header">🧠 AI Intelligence</h3>
                    <div className="card-body" style={{ textAlign: 'center', padding: '30px 20px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>CONVERSION PROBABILITY</div>
                            <div style={{ fontSize: '48px', fontWeight: '800', color: getCategoryColor(lead.category), lineHeight: '1' }}>
                                {lead.score}%
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
                            <span className={`badge badge-${lead.category}`} style={{ fontSize: '14px', padding: '5px 15px' }}>
                                {lead.category?.toUpperCase()} LEAD
                            </span>
                        </div>

                        <div style={{ textAlign: 'left', background: '#f0f9ff', padding: '15px', borderRadius: '8px', fontSize: '13px', color: '#0c4a6e' }}>
                            <strong>💡 AI Recommendation:</strong><br />
                            {lead.score > 70 ? 'High priority! Schedule a meeting immediately.' :
                                lead.score > 40 ? 'Nurture this lead with relevant content.' :
                                    'Low priority. Add to automated drip campaign.'}
                        </div>
                    </div>
                </div>

                {/* Right Col: Actions */}
                <div className="card">
                    <h3 className="card-header">⚡ Quick Actions</h3>
                    <div className="card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                            <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>📞 Log Call</button>
                            <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>📅 Meeting</button>
                            <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>📝 Add Note</button>
                            <button className="btn btn-secondary" style={{ justifyContent: 'center' }}>✅ Task</button>
                        </div>

                        <h4 style={{ fontSize: '14px', marginBottom: '10px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                            ✉️ AI Email Generator
                        </h4>
                        <div className="flex gap-10" style={{ flexWrap: 'wrap' }}>
                            <button onClick={() => handleGenerateEmail('cold_outreach')} className="btn btn-sm btn-primary">Cold Outreach</button>
                            <button onClick={() => handleGenerateEmail('follow_up')} className="btn btn-sm btn-primary">Follow Up</button>
                            <button onClick={() => handleGenerateEmail('proposal')} className="btn btn-sm btn-primary">Proposal</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Email Preview */}
            {emailContent && (
                <div className="card mt-20" style={{ marginTop: '20px', border: '2px solid var(--primary-teal)' }}>
                    <div className="card-header" style={{ background: 'var(--primary-teal)', color: 'white' }}>
                        ✨ Generated Email Draft
                    </div>
                    <div className="card-body">
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Subject:</strong> <span style={{ fontSize: '16px' }}>{emailContent.subject}</span>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '14px', color: '#334155' }}>
                                {emailContent.body}
                            </pre>
                        </div>
                        <div className="flex gap-10" style={{ marginTop: '15px', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary">Copy to Clipboard</button>
                            <button className="btn btn-primary">Open in Email Client</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDetail;
