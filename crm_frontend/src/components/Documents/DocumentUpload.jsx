import React, { useState } from 'react';
import crmService from '../../services/crmService';
import './Documents.css';

const DocumentUpload = ({ onClose, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        document_type: 'other',
        category: '',
        tags: '',
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Auto-fill title if empty
            if (!formData.title) {
                setFormData({
                    ...formData,
                    title: selectedFile.name
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setLoading(true);
        setError('');

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description);
        uploadData.append('document_type', formData.document_type);
        if (formData.tags) {
            uploadData.append('tags', formData.tags);
        }

        try {
            await crmService.uploadDocument(uploadData);
            onUploadSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    const getFileSize = () => {
        if (!file) return '';
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        return `${sizeInMB} MB`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Upload Document</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select File *</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="form-control"
                            required
                        />
                        {file && (
                            <div className="file-info-display">
                                📄 {file.name} ({getFileSize()})
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Document Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Contract Agreement"
                        />
                    </div>

                    <div className="form-group">
                        <label>Document Type</label>
                        <select
                            name="document_type"
                            className="form-control"
                            value={formData.document_type}
                            onChange={handleChange}
                        >
                            <option value="contract">Contract</option>
                            <option value="proposal">Proposal</option>
                            <option value="invoice">Invoice</option>
                            <option value="receipt">Receipt</option>
                            <option value="presentation">Presentation</option>
                            <option value="report">Report</option>
                            <option value="image">Image</option>
                            <option value="spreadsheet">Spreadsheet</option>
                            <option value="pdf">PDF Document</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Brief description of the document..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <input
                            type="text"
                            name="tags"
                            className="form-control"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g., important, client, 2024"
                        />
                        <small>Separate tags with commas</small>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Uploading...' : '⬆️ Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentUpload;
