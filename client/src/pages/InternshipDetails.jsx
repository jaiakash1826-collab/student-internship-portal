import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import { api } from '../api';

export default function InternshipDetails() {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getInternshipById(id);
      setInternship(data);
    } catch (err) {
      setError(err.message || 'Failed to load internship details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return (
      <main className="page details-page">
        <div className="state-container loading-state">
          <div className="loading-spinner" aria-hidden="true" />
          <p className="state-text">Loading internship details...</p>
        </div>
      </main>
    );
  }

  if (error || !internship) {
    return (
      <main className="page details-page">
        <div className="state-container error-state">
          <div className="state-icon" aria-hidden="true">⚠️</div>
          <h3 className="state-title">Internship Not Found</h3>
          <p className="state-text">{error || 'The requested internship could not be located.'}</p>
          <Link to="/" className="button secondary">
            ← Return to Internship List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page details-page">
      <div className="back-nav">
        <Link to="/" className="back-link">
          ← Back to All Internships
        </Link>
      </div>

      <div className="details-layout">
        {/* Left column: Comprehensive Internship Details */}
        <section className="details-overview-panel">
          <div className="details-card">
            <div className="company-badge-header">
              <div className="company-avatar large" aria-hidden="true">
                {internship.company ? internship.company.charAt(0).toUpperCase() : 'I'}
              </div>
              <div>
                <span className="eyebrow">{internship.company}</span>
                <h1 className="details-title">{internship.title}</h1>
              </div>
            </div>

            <p className="details-description">{internship.description}</p>

            <div className="details-facts-grid">
              <div className="fact-box">
                <span className="fact-label">Location</span>
                <span className="fact-value">📍 {internship.location}</span>
              </div>
              <div className="fact-box">
                <span className="fact-label">Duration</span>
                <span className="fact-value">⏳ {internship.duration}</span>
              </div>
              <div className="fact-box">
                <span className="fact-label">Stipend</span>
                <span className="fact-value highlight">💰 {internship.stipend}</span>
              </div>
              {internship.mode && (
                <div className="fact-box">
                  <span className="fact-label">Work Mode</span>
                  <span className="fact-value">🏢 {internship.mode}</span>
                </div>
              )}
            </div>

            {internship.skills && internship.skills.length > 0 && (
              <div className="details-skills-section">
                <h3 className="section-subtitle">Required Skills & Technologies</h3>
                <div className="skills-tag-list">
                  {internship.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right column: Interactive Application Form */}
        <section className="details-form-panel">
          <ApplicationForm internship={internship} />
        </section>
      </div>
    </main>
  );
}
