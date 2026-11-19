import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { asyncHandler, HttpError } from '../middleware/auth.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (job.deadline && job.deadline < new Date()) throw new HttpError(400, 'The deadline for this job has passed');

  const coverLetter = req.body.coverLetter;
  const resumeLink = req.body.resumeLink || req.user.resumeLink;
  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    coverLetter,
    resumeLink,
  });
  res.status(201).json({ application });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .sort({ createdAt: -1 })
    .populate('job', 'title company location type');
  res.json({ applications });
});

export const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.postedBy) !== String(req.user._id)) throw new HttpError(403, 'Not your job post');
  const applications = await Application.find({ job: job._id })
    .sort({ createdAt: -1 })
    .populate('applicant', 'name email phone skills');
  res.json({ job, applications });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('job');
  if (!application) throw new HttpError(404, 'Application not found');
  if (String(application.job.postedBy) !== String(req.user._id)) throw new HttpError(403, 'Not your job post');
  application.status = req.body.status;
  await application.save();
  res.json({ application });
});
