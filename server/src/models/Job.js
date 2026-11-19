import mongoose from 'mongoose';

export const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    company: { type: String, required: [true, 'Company is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    type: { type: String, enum: JOB_TYPES, default: 'Full-time' },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    salary: { type: String, trim: true, default: 'Negotiable' },
    description: { type: String, required: [true, 'Description is required'] },
    requirements: { type: [String], default: [] },
    deadline: { type: Date },
    isFeatured: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
