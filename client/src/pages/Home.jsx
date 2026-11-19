import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

const steps = [
  ['Create your account', 'Sign up as a candidate or a recruiter in under a minute.'],
  ['Find or post a role', 'Search by title, company or city. Recruiters publish openings from the dashboard.'],
  ['Apply and track', 'Send a cover letter and resume link, then follow your application status.'],
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    Promise.all([api.get('/jobs/featured'), api.get('/jobs/categories')])
      .then(([f, c]) => {
        setFeatured(f.data.jobs);
        setCategories(c.data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-ink text-white">
        <div className="container-x py-16 sm:py-24">
          <div className="hero-rise max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Your next job is one good search away.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Browse openings from companies across Bangladesh, apply in minutes, and keep every application in one place.
            </p>
            <form onSubmit={search} className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">Search jobs</label>
              <input
                id="hero-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title, company or city"
                className="input flex-1 !py-3"
              />
              <button className="btn bg-signal text-ink hover:bg-amber-400">Search jobs</button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Featured jobs (API) */}
      <section className="container-x pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Featured jobs</h2>
            <p className="mt-1 text-muted">Hand-picked and recently posted openings.</p>
          </div>
          <Link to="/jobs" className="font-semibold text-brand hover:underline">See all jobs</Link>
        </div>
        {loading ? (
          <Spinner />
        ) : featured.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">No jobs have been posted yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((j) => <JobCard key={j._id} job={j} />)}
          </div>
        )}
      </section>

      {/* 3. Categories (API) */}
      {categories.length > 0 && (
        <section className="container-x pt-16">
          <h2 className="text-3xl font-bold">Browse by category</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((c) => (
              <Link
                key={c.name}
                to={`/jobs?category=${encodeURIComponent(c.name)}`}
                className="rounded-full border border-line bg-white px-5 py-2 font-semibold transition-colors hover:border-brand hover:text-brand"
              >
                {c.name} <span className="ml-1 text-muted">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. How it works */}
      <section className="container-x pt-16">
        <h2 className="text-3xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <li key={title} className="rounded-xl border border-line bg-white p-6">
              <span className="font-display text-3xl font-extrabold text-brand">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{title}</h3>
              <p className="mt-1 text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Recruiter CTA */}
      <section className="container-x pt-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-3xl font-bold">Hiring? Post a job today.</h2>
            <p className="mt-2 max-w-lg text-teal-50">Create a recruiter account, publish openings, and review applicants from your dashboard.</p>
          </div>
          <Link to={token ? '/dashboard' : '/register'} className="btn bg-white text-brand-dark hover:bg-brand-soft">
            {token ? 'Go to dashboard' : 'Create recruiter account'}
          </Link>
        </div>
      </section>
    </>
  );
}
