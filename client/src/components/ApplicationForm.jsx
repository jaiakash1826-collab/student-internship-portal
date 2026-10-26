import { useState } from 'react';
import { api } from '../api';

export default function ApplicationForm({ internship, onApplicationSuccess }) {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    rollNumber: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const validate = () => {
    const errors = {};
    const name = formData.studentName.trim();
    const email = formData.email.trim();
    const roll = formData.rollNumber.trim();

    if (!name) {
      errors.studentName = 'Student name is required.';
    } else if (name.length < 2) {
      errors.studentName = 'Student name must be at least 2 characters.';
    } else if (name.length > 100) {
      errors.studentName = 'Student name cannot exceed 100 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    } else if (email.length > 254) {
      errors.email = 'Email address cannot exceed 254 characters.';
    }

    if (!roll) {
      errors.rollNumber = 'Roll number is required.';
    } else if (roll.length > 40) {
      errors.rollNumber = 'Roll number cannot exceed 40 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessInfo(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const payload = {
      studentName: formData.studentName.trim(),
      email: formData.email.trim().toLowerCase(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      internshipId: internship.id,
      internship: internship.id, // For backend compatibility
    };

    try {
      const response = await api.submitApplication(payload);

      setSuccessInfo({
        message: response.message || 'Application submitted successfully!',
        applicationId: response.applicationId || response.application?._id,
      });

      // Clear the form fields
      setFormData({
        studentName: '',
        email: '',
        rollNumber: '',
      });

      if (onApplicationSuccess) {
        onApplicationSuccess(response);
      }
    } catch (err) {
      setServerError(
        err.message || 'Unable to submit application. Please check your network and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="application-form-card">
      <div className="form-header">
        <span className="eyebrow">APPLICATION FORM</span>
        <h2 className="form-title">Apply for {internship.title}</h2>
        <p className="form-subtitle">
          Submit your candidate details below to apply directly to{' '}
          <strong>{internship.company}</strong>.
        </p>
      </div>

      {successInfo && (
        <div className="alert alert-success" role="alert">
          <div className="alert-icon">✓</div>
          <div className="alert-content">
            <h4 className="alert-heading">{successInfo.message}</h4>
            <p className="alert-id">
              Application Reference ID:{' '}
              <code>{successInfo.applicationId}</code>
            </p>
            <p className="alert-subtext">
              Your application has been stored in MongoDB. You can track it on the Applications page.
            </p>
          </div>
        </div>
      )}

      {serverError && (
        <div className="alert alert-error" role="alert">
          <div className="alert-icon">⚠</div>
          <div className="alert-content">
            <h4 className="alert-heading">Submission Error</h4>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="form-body">
        <div className="form-group">
          <label htmlFor="studentName" className="form-label">
            Full Name <span className="required-star">*</span>
          </label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            className={`form-input ${validationErrors.studentName ? 'input-error' : ''}`}
            placeholder="e.g. Shankar Prakasam"
            value={formData.studentName}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="name"
            maxLength={100}
            required
          />
          {validationErrors.studentName && (
            <span className="field-error-text" role="alert">
              {validationErrors.studentName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required-star">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
            placeholder="e.g. shankar@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={submitting}
            autoComplete="email"
            maxLength={254}
            required
          />
          {validationErrors.email && (
            <span className="field-error-text" role="alert">
              {validationErrors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rollNumber" className="form-label">
            Roll / Student Number <span className="required-star">*</span>
          </label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            className={`form-input ${validationErrors.rollNumber ? 'input-error' : ''}`}
            placeholder="e.g. 21CS042"
            value={formData.rollNumber}
            onChange={handleChange}
            disabled={submitting}
            maxLength={40}
            required
          />
          {validationErrors.rollNumber && (
            <span className="field-error-text" role="alert">
              {validationErrors.rollNumber}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="selectedInternship" className="form-label">
            Selected Internship (Position)
          </label>
          <input
            id="selectedInternship"
            name="selectedInternship"
            type="text"
            className="form-input input-readonly"
            value={`${internship.title} — ${internship.company}`}
            readOnly
            disabled
          />
        </div>

        <button
          type="submit"
          className="button primary submit-button"
          disabled={submitting}
        >
          {submitting ? (
            <span className="button-spinner-wrap">
              <span className="spinner-dot" /> Submitting Application...
            </span>
          ) : (
            'Submit Application →'
          )}
        </button>
      </form>
    </div>
  );
}
