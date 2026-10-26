import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || 'Unable to retrieve applications from the database.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <main className="page applications-page">
      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">APPLICATION DATABASE</span>
            <h1 className="section-title">Submitted Applications</h1>
            <p className="section-subtitle">
              Verified student internship applications persisted in MongoDB.
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={loadApplications}
              className="button secondary refresh-button"
              disabled={loading}
            >
              🔄 {loading ? 'Refreshing...' : 'Refresh Records'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-container loading-state">
            <div className="loading-spinner" aria-hidden="true" />
            <p className="state-text">Fetching applications from MongoDB...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="state-container error-state">
            <div className="state-icon" aria-hidden="true">⚠️</div>
            <h3 className="state-title">Failed to Retrieve Applications</h3>
            <p className="state-text">{error}</p>
            <button onClick={loadApplications} className="button secondary">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="state-container empty-state">
            <div className="state-icon" aria-hidden="true">📝</div>
            <h3 className="state-title">No Applications Submitted Yet</h3>
            <p className="state-text">
              No students have submitted applications yet. Browse the open internships to get started!
            </p>
            <Link to="/" className="button primary">
              Browse Internships
            </Link>
          </div>
        )}

        {/* Populated Table */}
        {!loading && !error && applications.length > 0 && (
          <div className="table-responsive-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th scope="col">Student Name</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Roll Number</th>
                  <th scope="col">Internship Position</th>
                  <th scope="col">Company</th>
                  <th scope="col">Application ID</th>
                  <th scope="col">Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="student-cell">
                      <span className="cell-avatar" aria-hidden="true">
                        {app.studentName ? app.studentName.charAt(0).toUpperCase() : 'S'}
                      </span>
                      <strong className="student-name">{app.studentName}</strong>
                    </td>
                    <td>
                      <a href={`mailto:${app.email}`} className="email-link">
                        {app.email}
                      </a>
                    </td>
                    <td>
                      <span className="roll-badge">{app.rollNumber}</span>
                    </td>
                    <td>
                      <strong className="internship-title-cell">
                        {app.internshipTitle || 'Internship Application'}
                      </strong>
                    </td>
                    <td>
                      <span className="company-tag">{app.company || 'Partner'}</span>
                    </td>
                    <td>
                      <code className="app-id-code" title={app._id}>
                        {app._id ? `${app._id.slice(0, 8)}...` : '—'}
                      </code>
                    </td>
                    <td>
                      <time dateTime={app.createdAt}>
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
