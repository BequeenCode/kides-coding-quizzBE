// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import ManageQuestions from './admin/ManageQuestions';
import ViewResults from './admin/ViewResults';
import CustomizeCertificates from './admin/CustomizeCertificates';
import ManageUsers from './admin/ManageUsers';
import './AdminDashboard.css';

const AdminDashboard = ({ user, setLoading }) => {
  const [activeTab, setActiveTab] = useState('manage-questions');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'manage-questions':
        return <ManageQuestions setLoading={setLoading} />;
      case 'view-results':
        return <ViewResults setLoading={setLoading} />;
      case 'customize-certificates':
        return <CustomizeCertificates setLoading={setLoading} />;
      case 'manage-users':
        return <ManageUsers setLoading={setLoading} />;
      default:
        return <ManageQuestions setLoading={setLoading} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li 
            className={activeTab === 'manage-questions' ? 'active' : ''}
            onClick={() => setActiveTab('manage-questions')}
          >
            Manage Questions
          </li>
          <li 
            className={activeTab === 'view-results' ? 'active' : ''}
            onClick={() => setActiveTab('view-results')}
          >
            View Results
          </li>
          <li 
            className={activeTab === 'customize-certificates' ? 'active' : ''}
            onClick={() => setActiveTab('customize-certificates')}
          >
            Customize Certificates
          </li>
          <li 
            className={activeTab === 'manage-users' ? 'active' : ''}
            onClick={() => setActiveTab('manage-users')}
          >
            Manage Users
          </li>
        </ul>
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <h1>Kids Coding Quiz Admin</h1>
          <div className="admin-subheader">
            {activeTab === 'manage-questions' && 'Manage Questions'}
            {activeTab === 'view-results' && 'View Results'}
            {activeTab === 'customize-certificates' && 'Customize Certificates'}
            {activeTab === 'manage-users' && 'Manage Users'}
          </div>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;