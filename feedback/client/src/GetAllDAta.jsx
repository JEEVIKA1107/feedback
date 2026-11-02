import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

export function GetAllDAta() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
        const response = await axios.get(`${API_BASE_URL}/api/getfeedback`);
        setFeedbacks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(`Error fetching records: ${err.message}. Please check if the backend server is running.`);
        } else {
          setError('Failed to fetch feedback records.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date not available';
    }
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header-bar">
          <h1 className="title">Feedback List</h1>
          <Link to="/" className="nav-btn">
            &larr; Back to Survey Form
          </Link>
        </div>

        {loading && <div className="loading-state">Loading...</div>}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && feedbacks.length === 0 && (
          <div className="empty-state">
            <p>No feedback has been submitted yet.</p>
            <Link to="/" className="primary-link">
              Submit the first feedback response
            </Link>
          </div>
        )}

        {!loading && !error && feedbacks.length > 0 && (
          <div className="feedback-list">
            {feedbacks.map((item) => (
              <div key={item._id} className="feedback-item">
                <div className="feedback-header">
                  <h3 className="feedback-name">Q1: Name: <span>{item.q1}</span></h3>
                  <span className="timestamp">
                    Submitted At: {formatDate(item.submittedAt)}
                  </span>
                </div>
                <div className="feedback-details">
                  <p><strong>Q2: Department:</strong> {item.q2}</p>
                  <p><strong>Q3: Session title:</strong> {item.q3}</p>
                  <div className="feedback-text-block">
                    <p><strong>Q4: Feedback:</strong></p>
                    <p className="block-content">{item.q4}</p>
                  </div>
                  <div className="feedback-text-block">
                    <p><strong>Q5: Suggestions:</strong></p>
                    <p className="block-content">{item.q5}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GetAllDAta;
