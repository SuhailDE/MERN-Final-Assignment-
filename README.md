# KormoHub – Job Portal & Career Networking Website

Full-stack MERN job portal (MERN 16 final assignment).

- **Frontend:** React (Vite), Tailwind CSS, Zustand, React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt

## Live links
- Frontend: _add Vercel URL_
- Backend API: _add Render URL_

## Test accounts (after running the seed script)
| Role | Email | Password |
| --- | --- | --- |
| Recruiter | recruiter@kormohub.com | recruiter123 |
| Candidate | candidate@kormohub.com | candidate123 |

## Features
- Home page with 5 sections (hero search, top 6 featured jobs from API, categories from API, how it works, recruiter CTA)
- All jobs with search, category and type filters, pagination
- Job details page with apply form (candidates)
- Register (candidate or recruiter) and login with JWT; auth state persisted with Zustand
- Candidate dashboard: edit profile, view applied jobs and their status
- Recruiter dashboard: post, edit, delete own jobs; view applicants and update status
- Contact page (saved to database), responsive header and footer

## Run locally
```bash
# 1. Backend
cd server
cp .env.example .env        # fill in MONGO_URI and JWT_SECRET
npm install
npm run seed                # optional: demo data and test accounts
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

## API
| Method | Endpoint | Access |
| --- | --- | --- |
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| PUT | /api/users/profile | Logged in |
| GET | /api/jobs (search, category, type, page, limit) | Public |
| GET | /api/jobs/featured, /api/jobs/categories, /api/jobs/:id | Public |
| GET | /api/jobs/mine | Recruiter |
| POST | /api/jobs | Recruiter |
| PUT, DELETE | /api/jobs/:id | Recruiter (owner only) |
| POST | /api/jobs/:id/apply | Candidate |
| GET | /api/applications/my | Candidate |
| GET | /api/jobs/:id/applications | Recruiter (owner only) |
| PATCH | /api/applications/:id/status | Recruiter (owner only) |
| POST | /api/contact | Public |

## Deployment
**Backend (Render):** New Web Service, root directory `server`, build `npm install`, start `npm start`.
Environment variables: `MONGO_URI` (MongoDB Atlas), `JWT_SECRET`, `CLIENT_URL` (your Vercel URL, no trailing slash).

**Frontend (Vercel):** Import the repo, root directory `client`, framework Vite.
Environment variable: `VITE_API_URL=https://<your-render-app>.onrender.com/api`.
`client/vercel.json` rewrites all routes to `index.html` so page refreshes work.
