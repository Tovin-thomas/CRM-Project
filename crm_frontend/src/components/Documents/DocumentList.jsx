import React, { useState, useEffect } from 'react';
import crmService from '../../services/crmService';
import DocumentUpload from './DocumentUpload';
import './Documents.css';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [docsResponse, foldersResponse] = await Promise.all([
                crmService.getDocuments(),
                crmService.getFolders()
            ]);
            setDocuments(docsResponse.data.results || docsResponse.data);
            setFolders(foldersResponse.data.results || foldersResponse.data);
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (docId, title) => {
        try {
            const response = await crmService.downloadDocument(docId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', title);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    const getFileIcon = (type) => {
        const icons = {
            pdf: '📄',
            image: '🖼️',
            spreadsheet: '📊',
            presentation: '📽️',
            contract: '📝',
            other: '📁'
        };
        return icons[type] || '📄';
    };

    return (
        <div className="documents-container">
            <div className="documents-header">
                <div>
                    <h1 className="page-title">📂 Documents</h1>
                    <p className="page-subtitle">Manage your files and folders</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            🔲
                        </button>
                        <button
                            className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            ≡
                        </button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                        ⬆️ Upload File
                    </button>
                </div>
            </div>

            <div className="documents-content">
                {/* Folders Section */}
                {folders.length > 0 && (
                    <div className="folders-section">
                        <h3 className="section-title">Folders</h3>
                        <div className="folders-grid">
                            {folders.map(folder => (
                                <div key={folder.id} className="folder-card">
                                    <span className="folder-icon">📁</span>
                                    <span className="folder-name">{folder.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Files Section */}
                <div className="files-section">
                    <h3 className="section-title">Files</h3>
                    {loading ? (
                        <div className="loading">Loading documents...</div>
                    ) : documents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📂</div>
                            <h3>No documents found</h3>
                            <p>Upload your first document to get started</p>
                        </div>
                    ) : (
                        <div className={`files-${viewMode}`}>
                            {documents.map(doc => (
                                <div key={doc.id} className={`file-card ${viewMode}`}>
                                    <div className="file-icon">
                                        {getFileIcon(doc.document_type)}
                                    </div>
                                    <div className="file-info">
                                        <div className="file-name">{doc.title}</div>
                                        <div className="file-meta">
                                            {doc.file_size_mb} MB • {new Date(doc.uploaded_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="file-actions">
                                        <button
                                            className="btn-icon-sm"
                                            onClick={() => handleDownload(doc.id, doc.title)}
                                            title="Download"
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {showUpload && (
                <DocumentUpload
                    onClose={() => setShowUpload(false)}
                    onUploadSuccess={loadData}
                />
            )}
        </div>
    );
};

export default DocumentList;
