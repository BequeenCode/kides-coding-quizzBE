// src/components/admin/ViewResults.jsx
import React, { useState, useEffect } from 'react';
import { resultsAPI } from '../../utils/api';

const ViewResults = ({ setLoading }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const resultsData = await resultsAPI.getAll();
      setResults(resultsData);
    } catch (error) {
      alert('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-results">
      <div className="results-header">
        <h3>Quiz Results</h3>
        <button onClick={loadResults} className="btn btn-sm btn-outline">
          Refresh
        </button>
      </div>
      
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>USER</th>
              <th>TOPIC</th>
              <th>SCORE</th>
              <th>PERCENTAGE</th>
              <th>DATE</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result._id}>
                <td>{result.user?.name || 'Unknown'}</td>
                <td>{result.topic}</td>
                <td>{result.score}/{result.total}</td>
                <td>{result.percentage}%</td>
                <td>{new Date(result.completedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewResults;