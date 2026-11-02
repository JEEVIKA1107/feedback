import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [feedback, setFeedback] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation to ensure required fields are not empty
    if (
      !feedback.q1.trim() ||
      !feedback.q2.trim() ||
      !feedback.q3.trim() ||
      !feedback.q4.trim() ||
      !feedback.q5.trim()
    ) {
      setError('Please fill in all the required fields before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const response = await axios.post(`${API_BASE_URL}/api/feedback`, feedback);

      // Display success message and clear the form
      setMessage(response.data.message || 'Feedback submitted successfully!');
      setFeedback({
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: ''
      });
    } catch (err) {
      // Useful error message display
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(`Submission failed: ${err.message}. Please check if the backend server is running.`);
      } else {
        setError('An unexpected error occurred while submitting feedback.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Online Survey & Feedback</h1>
        <p className="subtitle">Please share your valuable feedback for the session.</p>

        <nav className="nav-links">
          <Link to="/getAllData" className="nav-btn">
            View All Feedback &rarr;
          </Link>
        </nav>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="q1">Name</label>
            <input
              type="text"
              id="q1"
              name="q1"
              value={feedback.q1}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="q2">Department</label>
            <input
              type="text"
              id="q2"
              name="q2"
              value={feedback.q2}
              onChange={handleChange}
              placeholder="Enter your department (e.g. Computer Science)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="q3">Session title</label>
            <input
              type="text"
              id="q3"
              name="q3"
              value={feedback.q3}
              onChange={handleChange}
              placeholder="Enter the session or seminar title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="q4">Feedback</label>
            <textarea
              id="q4"
              name="q4"
              rows="4"
              value={feedback.q4}
              onChange={handleChange}
              placeholder="Share your feedback about the session..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="q5">Suggestions</label>
            <textarea
              id="q5"
              name="q5"
              rows="3"
              value={feedback.q5}
              onChange={handleChange}
              placeholder="Any suggestions or improvements for future sessions?"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
