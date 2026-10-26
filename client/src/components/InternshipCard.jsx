import { Link } from 'react-router-dom';

export default function InternshipCard({ internship }) {
  const { id, title, company, location, duration, stipend, mode, description } =
    internship;

  return (
    <article className="internship-card" data-testid={`internship-card-${id}`}>
      <div className="card-top">
        <div className="company-avatar" aria-hidden="true">
          {company ? company.charAt(0).toUpperCase() : 'I'}
        </div>
        <div className="badge-group">
          <span className="badge badge-accent">Internship</span>
          {mode && <span className="badge badge-muted">{mode}</span>}
        </div>
      </div>

      <h3 className="card-title">{title}</h3>
      <p className="company-name">{company}</p>

      {description && (
        <p className="card-description">
          {description.length > 120
            ? `${description.slice(0, 117)}...`
            : description}
        </p>
      )}

      <div className="card-meta">
        <span className="meta-item">
          <span className="meta-icon" aria-hidden="true">📍</span>
          {location}
        </span>
        <span className="meta-item">
          <span className="meta-icon" aria-hidden="true">⏳</span>
          {duration}
        </span>
      </div>

      <div className="card-bottom">
        <div className="stipend-block">
          <span className="stipend-amount">{stipend}</span>
          <span className="stipend-label">Stipend</span>
        </div>
        <Link
          to={`/internships/${id}`}
          className="button secondary view-details-btn"
          aria-label={`View details for ${title} at ${company}`}
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}
