import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { asyncHandler, HttpError } from '../middleware/auth.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toList = (v) =>
  Array.isArray(v) ? v.map((s) => String(s).trim()).filter(Boolean) : String(v || '').split('\n').map((s) => s.trim()).filter(Boolean);

const pickJobFields = (body) => {
  const f = {};
  ['title', 'company', 'location', 'type', 'category', 'salary', 'description', 'deadline'].forEach((k) => {
    if (body[k] !== undefined && body[k] !== '') f[k] = body[k];
  });
  if (body.requirements !== undefined) f.requirements = toList(body.requirements);
  return f;
};

export const getJobs = asyncHandler(async (req, res) => {
  const { search, category, type, location } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 50);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { company: rx }, { category: rx }, { location: rx }];
  }
  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
  if (type) filter.type = type;
  if (location) filter.location = new RegExp(escapeRegex(location), 'i');

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Job.countDocuments(filter),
  ]);
  res.json({ jobs, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

export const getFeaturedJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ isFeatured: -1, createdAt: -1 }).limit(6);
  res.json({ jobs });
});

export const getCategories = asyncHandler(async (req, res) => {
  const rows = await Job.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ categories: rows.map((r) => ({ name: r._id, count: r.count })) });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name companyName');
  if (!job) throw new HttpError(404, 'Job not found');
  res.json({ job });
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 }).lean();
  const counts = await Application.aggregate([
    { $match: { job: { $in: jobs.map((j) => j._id) } } },
    { $group: { _id: '$job', count: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  res.json({ jobs: jobs.map((j) => ({ ...j, applicantCount: map[String(j._id)] || 0 })) });
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...pickJobFields(req.body),
    company: req.body.company || req.user.companyName,
    postedBy: req.user._id,
  });
  res.status(201).json({ job });
});

const findOwnedJob = async (id, userId) => {
  const job = await Job.findById(id);
  if (!job) throw new HttpError(404, 'Job not found');
  if (String(job.postedBy) !== String(userId)) throw new HttpError(403, 'You can only change your own job posts');
  return job;
};

export const updateJob = asyncHandler(async (req, res) => {
  const job = await findOwnedJob(req.params.id, req.user._id);
  Object.assign(job, pickJobFields(req.body));
  await job.save();
  res.json({ job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await findOwnedJob(req.params.id, req.user._id);
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ message: 'Job deleted' });
});
