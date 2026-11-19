import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';
import Application from './models/Application.js';

const days = (n) => new Date(Date.now() + n * 86400000);

const jobs = [
  ['Frontend Developer (React)', 'Pathao', 'Dhaka', 'Full-time', 'Software', 'BDT 70,000 - 110,000', true],
  ['MERN Stack Developer', 'Brain Station 23', 'Dhaka', 'Full-time', 'Software', 'BDT 60,000 - 95,000', true],
  ['Node.js Backend Engineer', 'bKash', 'Dhaka', 'Full-time', 'Software', 'BDT 90,000 - 140,000', true],
  ['UI/UX Designer', 'Shohoz', 'Dhaka', 'Full-time', 'Design', 'BDT 50,000 - 80,000', true],
  ['Digital Marketing Executive', 'Daraz Bangladesh', 'Chattogram', 'Full-time', 'Marketing', 'BDT 35,000 - 55,000', true],
  ['Junior Data Analyst', 'Grameenphone', 'Dhaka', 'Full-time', 'Data', 'BDT 45,000 - 70,000', true],
  ['Customer Support Associate', 'Chaldal', 'Dhaka', 'Part-time', 'Support', 'BDT 18,000 - 25,000', false],
  ['Content Writer (Bangla)', 'Prothom Alo', 'Remote', 'Remote', 'Content', 'BDT 25,000 - 40,000', false],
  ['Software Engineering Intern', 'Selise', 'Dhaka', 'Internship', 'Software', 'BDT 12,000 stipend', false],
  ['Accounts Officer', 'BRAC', 'Sylhet', 'Full-time', 'Finance', 'BDT 40,000 - 60,000', false],
  ['DevOps Engineer', 'Kaz Software', 'Dhaka', 'Contract', 'Software', 'BDT 100,000 - 150,000', false],
  ['Graphic Designer', 'Robi Axiata', 'Remote', 'Remote', 'Design', 'BDT 30,000 - 50,000', false],
  ['Sales Executive', 'Walton', 'Rajshahi', 'Full-time', 'Sales', 'BDT 25,000 - 45,000 + commission', false],
  ['QA Engineer', 'Therap BD', 'Dhaka', 'Full-time', 'Software', 'BDT 50,000 - 80,000', false],
];

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany(), Job.deleteMany(), Application.deleteMany()]);

const recruiter = await User.create({
  name: 'Rafiq Ahmed',
  email: 'recruiter@kormohub.com',
  password: 'recruiter123',
  role: 'recruiter',
  companyName: 'KormoHub Demo Co.',
});
await User.create({
  name: 'Suhail Hossain',
  email: 'candidate@kormohub.com',
  password: 'candidate123',
  role: 'candidate',
  skills: ['React', 'Node.js', 'MongoDB', 'Express'],
  bio: 'MERN stack developer looking for my next challenge.',
});

await Job.insertMany(
  jobs.map(([title, company, location, type, category, salary, isFeatured], i) => ({
    title,
    company,
    location,
    type,
    category,
    salary,
    isFeatured,
    deadline: days(20 + i),
    description: `${company} is hiring a ${title} to join its team in ${location}. You will work with cross-functional teammates, own your deliverables end to end, and help us ship improvements that reach thousands of users every week.`,
    requirements: [
      'Relevant degree or equivalent practical experience',
      'Strong communication and teamwork skills',
      'Ability to meet deadlines in a fast-moving environment',
      'Prior experience in a similar role is a plus',
    ],
    postedBy: recruiter._id,
  }))
);

console.log('Seeded.\n  Recruiter: recruiter@kormohub.com / recruiter123\n  Candidate: candidate@kormohub.com / candidate123');
await mongoose.disconnect();
