const express = require('express');
const mongoose = require('mongoose');
const Application = require('../models/Application');

const router = express.Router();

const internships = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Intern',
    company: 'ByteWorks Technologies',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹12,000/month',
    mode: 'Remote',
    description: 'Build modern, responsive, and accessible user interfaces using React, HTML5, CSS3, and JavaScript. Collaborate with backend teams to integrate RESTful APIs and optimize web performance.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST APIs'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer Intern',
    company: 'CloudNova Solutions',
    location: 'Bengaluru / Hybrid',
    duration: '6 months',
    stipend: '₹15,000/month',
    mode: 'Hybrid',
    description: 'Design and develop scalable RESTful APIs, manage MongoDB databases, implement server-side Express logic, and ensure robust security and error handling.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST APIs', 'Postman'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst Intern',
    company: 'InsightLabs',
    location: 'Hyderabad / Remote',
    duration: '3 months',
    stipend: '₹10,000/month',
    mode: 'Remote',
    description: 'Extract, clean, and analyze complex datasets to uncover trends and actionable business insights. Create interactive dashboards and visualize key performance indicators.',
    skills: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Data Visualization', 'Excel'],
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Developer Intern',
    company: 'NextGen Digital',
    location: 'Chennai / On-site',
    duration: '6 months',
    stipend: '₹18,000/month',
    mode: 'On-site',
    description: 'Develop end-to-end full-stack web applications using the MERN stack. Implement responsive frontend layouts, robust backend architecture, and cloud deployment pipelines.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Vite', 'Tailwind CSS'],
  },
  // Legacy alias IDs for backward compatibility
  {
    id: 'web-development',
    title: 'Web Development Intern',
    company: 'ByteWorks Technologies',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹8,000/month',
    mode: 'Remote',
    description: 'Build responsive web applications and work with modern frontend and backend technologies.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Intern',
    company: 'InsightLabs',
    location: 'Chennai',
    duration: '2 months',
    stipend: '₹7,000/month',
    mode: 'Remote',
    description: 'Analyze datasets, prepare reports, and discover useful business insights.',
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization'],
  },
  {
    id: 'backend-development',
    title: 'Backend Development Intern',
    company: 'CloudNova Solutions',
    location: 'Hybrid',
    duration: '3 months',
    stipend: '₹10,000/month',
    mode: 'Hybrid',
    description: 'Develop REST APIs and work with databases and server-side applications.',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    company: 'PixelWorks',
    location: 'Remote',
    duration: '2 months',
    stipend: '₹6,000/month',
    mode: 'Remote',
    description: 'Design user-friendly interfaces and improve digital product experiences.',
    skills: ['Figma', 'Wireframing', 'Prototyping', 'UI Design'],
  },
];

// Helper to check DB readiness
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

// GET /api/health
router.get('/health', (req, res) => {
  const dbConnected = isDbConnected();
  if (dbConnected) {
    return res.status(200).json({
      status: 'OK',
      database: 'connected',
      message: 'Student Internship Portal API is healthy and connected to MongoDB',
      timestamp: new Date().toISOString(),
    });
  }
  return res.status(503).json({
    status: 'Service Unavailable',
    database: 'disconnected',
    message: 'Database connection is not ready',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/internships - list all available internships
router.get('/internships', (req, res) => {
  res.status(200).json(internships);
});

// GET /api/internships/:id - get single internship or 404
router.get('/internships/:id', (req, res) => {
  const internshipId = req.params.id;
  const found = internships.find((item) => item.id === internshipId);

  if (!found) {
    return res.status(404).json({
      error: `Internship with ID '${internshipId}' not found.`,
    });
  }

  return res.status(200).json(found);
});

// POST /api/applications - submit internship application
router.post('/applications', async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        error: 'Database connection is temporarily unavailable. Please try again later.',
      });
    }

    const { studentName, email, rollNumber, internshipId, internship } = req.body;
    const selectedId = (internshipId || internship || '').trim();

    // Frontend & Backend field validation
    if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
      return res.status(400).json({
        error: 'Student name is required and must be at least 2 characters long.',
      });
    }

    if (studentName.trim().length > 100) {
      return res.status(400).json({
        error: 'Student name cannot exceed 100 characters.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: 'A valid email address is required.',
      });
    }

    if (email.trim().length > 254) {
      return res.status(400).json({
        error: 'Email address cannot exceed 254 characters.',
      });
    }

    if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length === 0) {
      return res.status(400).json({
        error: 'Roll number is required.',
      });
    }

    if (rollNumber.trim().length > 40) {
      return res.status(400).json({
        error: 'Roll number cannot exceed 40 characters.',
      });
    }

    if (!selectedId) {
      return res.status(400).json({
        error: 'Please select an internship to apply for.',
      });
    }

    const foundInternship = internships.find((item) => item.id === selectedId);
    if (!foundInternship) {
      return res.status(404).json({
        error: `Selected internship ID '${selectedId}' is not valid or no longer exists.`,
      });
    }

    // Persist document to MongoDB
    const application = await Application.create({
      studentName: studentName.trim(),
      email: email.trim().toLowerCase(),
      rollNumber: rollNumber.trim().toUpperCase(),
      internshipId: foundInternship.id,
      internshipTitle: foundInternship.title,
      internship: foundInternship.id,
    });

    return res.status(201).json({
      message: 'Application submitted successfully!',
      applicationId: application._id,
      application: {
        _id: application._id,
        studentName: application.studentName,
        email: application.email,
        rollNumber: application.rollNumber,
        internshipId: application.internshipId,
        internshipTitle: application.internshipTitle,
        company: foundInternship.company,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map((e) => e.message).join(', '),
      });
    }
    return next(error);
  }
});

// GET /api/applications - retrieve saved applications sorted newest first
router.get('/applications', async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        error: 'Database connection is temporarily unavailable. Please try again later.',
      });
    }

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    const formattedApplications = applications.map((item) => {
      const match = internships.find(
        (i) => i.id === item.internshipId || i.id === item.internship
      );

      return {
        _id: item._id,
        studentName: item.studentName,
        email: item.email,
        rollNumber: item.rollNumber,
        internshipId: item.internshipId || item.internship || (match ? match.id : 'unknown'),
        internshipTitle: item.internshipTitle || match?.title || 'Internship Application',
        company: match?.company || 'Partner Organization',
        createdAt: item.createdAt,
      };
    });

    return res.status(200).json(formattedApplications);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
