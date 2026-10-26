import { useEffect, useState } from 'react';
import InternshipCard from '../components/InternshipCard';
import { api } from '../api';

export default function InternshipList() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInternships = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getInternships();
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load internships.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <main className="page internship-list-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">STUDENT INTERNSHIP PORTAL</span>
          <h1 className="hero-title">
            Kickstart Your Tech Career With <span>Real-World Internships</span>
          </h1>
          <p className="hero-subtitle">
            Browse verified internship roles from top engineering teams. Select an
            opportunity, view comprehensive position details, and submit your application online.
          </p>
          <div className="hero-actions">
            <a href="#internships-section" className="button primary">
              Browse Available Roles ↓
            </a>
          </div>
        </div>
      </section>

      {/* Internships Catalogue */}
      <section className="section" id="internships-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">CURATED OPPORTUNITIES</span>
            <h2 className="section-title">Available Internships</h2>
          </div>
          {!loading && !error && (
            <span className="count-pill">
              {internships.length} {internships.length === 1 ? 'Role' : 'Roles'} Available
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-container loading-state">
            <div className="loading-spinner" aria-hidden="true" />
            <p className="state-text">Loading verified internship listings...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="state-container error-state">
            <div className="state-icon" aria-hidden="true">⚠️</div>
            <h3 className="state-title">Unable to Load Internships</h3>
            <p className="state-text">{error}</p>
            <button onClick={fetchInternships} className="button secondary">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && internships.length === 0 && (
          <div className="state-container empty-state">
            <div className="state-icon" aria-hidden="true">📋</div>
            <h3 className="state-title">No Internships Found</h3>
            <p className="state-text">There are currently no active internships posted. Check back soon!</p>
          </div>
        )}

        {/* Success Grid */}
        {!loading && !error && internships.length > 0 && (
          <div className="internship-grid">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
