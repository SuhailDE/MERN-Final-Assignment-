import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler, HttpError } from '../middleware/auth.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone,
  location: u.location,
  bio: u.bio,
  skills: u.skills,
  resumeLink: u.resumeLink,
  companyName: u.companyName,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, companyName } = req.body;
  if (!name || !email || !password) throw new HttpError(400, 'Name, email and password are required');
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  const safeRole = role === 'recruiter' ? 'recruiter' : 'candidate';
  const user = await User.create({
    name,
    email,
    password,
    role: safeRole,
    companyName: safeRole === 'recruiter' ? companyName || '' : '',
  });
  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, 'Email and password are required');
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new HttpError(401, 'Incorrect email or password');
  res.json({ token: signToken(user._id), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'location', 'bio', 'resumeLink', 'companyName'];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  });
  if (req.body.skills !== undefined) {
    req.user.skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : String(req.body.skills).split(',').map((s) => s.trim()).filter(Boolean);
  }
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});
