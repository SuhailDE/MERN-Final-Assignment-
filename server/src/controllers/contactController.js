import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/auth.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  await Contact.create({ name, email, subject, message });
  res.status(201).json({ message: 'Thanks! Your message has been sent.' });
});
