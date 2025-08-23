// src/components/admin/CustomizeCertificates.jsx
import React, { useState, useEffect } from 'react';
import { certificatesAPI } from '../../utils/api';

const CustomizeCertificates = ({ setLoading }) => {
  const [template, setTemplate] = useState({
    logoUrl: '',
    templateText: 'Congratulations {name}! You scored {score}% in {topic}.',
    signature: 'The Coding Quiz Team'
  });

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    setLoading(true);
    try {
      const templateData = await certificatesAPI.getTemplate();
      setTemplate(templateData);
    } catch (error) {
      alert('Failed to load certificate template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await certificatesAPI.updateTemplate(template);
      alert('Certificate template updated successfully!');
    } catch (error) {
      alert('Failed to update template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value });
  };

  return (
    <div className="customize-certificates">
      <form onSubmit={handleSubmit} className="certificate-form">
        <div className="form-group">
          <label>Logo URL:</label>
          <input
            type="text"
            name="logoUrl"
            value={template.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div className="form-group">
          <label>Template Text:</label>
          <textarea
            name="templateText"
            value={template.templateText}
            onChange={handleChange}
            rows="4"
            placeholder="Certificate text with placeholders like {name}, {topic}, {score}, {date}"
          />
          <small>Available placeholders: {"{name}"}, {"{topic}"}, {"{score}"}, {"{date}"}</small>
        </div>
        
        <div className="form-group">
          <label>Signature:</label>
          <input
            type="text"
            name="signature"
            value={template.signature}
            onChange={handleChange}
            placeholder="The Coding Quiz Team"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Save Template</button>
      </form>
      
      <div className="current-template">
        <h3>Current Template Preview</h3>
        <div className="certificate-preview">
          {template.logoUrl && (
            <div className="certificate-logo">
              <img src={template.logoUrl} alt="Logo" />
            </div>
          )}
          <div className="certificate-text">
            <p>{template.templateText}</p>
            <p className="signature">{template.signature}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeCertificates;