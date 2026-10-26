import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Internship Portal Home">
          <span className="brand-mark">🎓</span>
          <span className="brand-text">
            Intern<span className="brand-accent">Portal</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Internships
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Applications
          </NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/" className="button small primary">
            Explore Roles →
          </Link>
        </div>
      </div>
    </header>
  );
}
