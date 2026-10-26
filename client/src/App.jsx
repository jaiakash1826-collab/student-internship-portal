import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import InternshipList from './pages/InternshipList';
import InternshipDetails from './pages/InternshipDetails';
import Applications from './pages/Applications';
import './App.css';

function NotFound() {
  return (
    <main className="page empty-state-page">
      <div className="state-container not-found-state">
        <div className="state-icon" aria-hidden="true">🔍</div>
        <h1 className="state-title">404 - Page Not Found</h1>
        <p className="state-text">
          The page you requested does not exist or has been moved.
        </p>
        <Link to="/" className="button primary">
          ← Return to Internships
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-content">
        <Routes>
          <Route path="/" element={<InternshipList />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">🎓</span>
            <span className="brand-text">
              Student Internship <span className="brand-accent">Portal</span>
            </span>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} ByteXL Student Internship Portal. Built with MERN Stack.
          </p>
        </div>
      </footer>
    </div>
  );
}
