import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import * as auth from '../controllers/authController.js';
import * as jobs from '../controllers/jobController.js';
import * as apps from '../controllers/applicationController.js';
import { sendMessage } from '../controllers/contactController.js';

const r = Router();

// Auth & profile
r.post('/auth/register', auth.register);
r.post('/auth/login', auth.login);
r.get('/auth/me', protect, auth.me);
r.put('/users/profile', protect, auth.updateProfile);

// Jobs (static paths before /:id)
r.get('/jobs', jobs.getJobs);
r.get('/jobs/featured', jobs.getFeaturedJobs);
r.get('/jobs/categories', jobs.getCategories);
r.get('/jobs/mine', protect, authorize('recruiter'), jobs.getMyJobs);
r.get('/jobs/:id', jobs.getJob);
r.post('/jobs', protect, authorize('recruiter'), jobs.createJob);
r.put('/jobs/:id', protect, authorize('recruiter'), jobs.updateJob);
r.delete('/jobs/:id', protect, authorize('recruiter'), jobs.deleteJob);

// Applications
r.post('/jobs/:id/apply', protect, authorize('candidate'), apps.applyToJob);
r.get('/jobs/:id/applications', protect, authorize('recruiter'), apps.getJobApplications);
r.get('/applications/my', protect, authorize('candidate'), apps.getMyApplications);
r.patch('/applications/:id/status', protect, authorize('recruiter'), apps.updateApplicationStatus);

// Contact
r.post('/contact', sendMessage);

export default r;
