const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email cannot exceed 254 characters'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      uppercase: true,
      maxlength: [40, 'Roll number cannot exceed 40 characters'],
    },
    internshipId: {
      type: String,
      required: [true, 'Internship ID is required'],
      trim: true,
    },
    internshipTitle: {
      type: String,
      required: [true, 'Internship title is required'],
      trim: true,
    },
    // Retain optional legacy field for backwards compatibility
    internship: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
