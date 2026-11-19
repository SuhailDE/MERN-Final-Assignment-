import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
    subject: { type: String, trim: true, default: '' },
    message: { type: String, required: [true, 'Message is required'], maxlength: 2000 },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
