import { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import Spinner from '../components/Spinner';
import { formatDate } from '../components/JobCard';
import { useAuthStore } from '../store/authStore';

export default function JobDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { token, user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ coverLetter: '', resumeLink: user?.resumeLink || '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((r) => setJob(r.data.job)).catch((e) => setError(errMsg(e)));
  }, [id]);

  useEffect(() => {
    if (token && user?.role === 'candidate') {
      api.get('/applications/my')
        .then((r) => setApplied(r.data.applications.some((a) => a.job?._id === id)))
        .catch(() => {});
    }
  }, [token, user, id]);

  const apply = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post(`/jobs/${id}/apply`, form);
      setApplied(true);
      toast.success('Application submitted');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSending(false);
    }
  };

  if (error) return <div className="container-x py-16 text-center"><p className="text-red-700">{error}</p><Link to="/jobs" className="btn-ghost mt-4">Back to jobs</Link></div>;
  if (!job) return <Spinner />;

  const expired = job.deadline && new Date(job.deadline) < new Date();

  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
      <article className="rounded-xl border border-line bg-white p-6 sm:p-8">
        <Link to="/jobs" className="text-sm font-semibold text-brand hover:underline">All jobs</Link>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{job.title}</h1>
        <p className="mt-1 text-lg text-muted">{job.company}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="tag">{job.type}</span>
          <span className="tag">{job.category}</span>
          <span className="tag">{job.location}</span>
        </div>

        <h2 className="mt-8 text-xl font-bold">About the role</h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed">{job.description}</p>

        {job.requirements?.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-bold">Requirements</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </>
        )}
      </article>

      <aside className="space-y-6">
        <div className="rounded-xl border border-line bg-white p-6">
          <dl className="space-y-3">
            <div><dt className="text-sm text-muted">Salary</dt><dd className="font-semibold">{job.salary}</dd></div>
            <div><dt className="text-sm text-muted">Location</dt><dd className="font-semibold">{job.location}</dd></div>
            <div><dt className="text-sm text-muted">Apply by</dt><dd className="font-semibold">{formatDate(job.deadline)}</dd></div>
            <div><dt className="text-sm text-muted">Posted</dt><dd className="font-semibold">{formatDate(job.createdAt)}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border border-line bg-white p-6">
          <h2 className="text-xl font-bold">Apply for this job</h2>
          {!token ? (
            <>
              <p className="mt-2 text-muted">Log in as a candidate to apply.</p>
              <Link to="/login" state={{ from: location.pathname }} className="btn-primary mt-4 w-full">Log in to apply</Link>
            </>
          ) : user?.role !== 'candidate' ? (
            <p className="mt-2 text-muted">Recruiter accounts can’t apply for jobs.</p>
          ) : applied ? (
            <p className="mt-3 rounded-lg bg-brand-soft p-3 font-semibold text-brand-dark">You’ve applied to this job. Track it in your dashboard.</p>
          ) : expired ? (
            <p className="mt-2 text-red-700">The deadline for this job has passed.</p>
          ) : (
            <form onSubmit={apply} className="mt-4 space-y-4">
              <div>
                <label htmlFor="cl" className="label">Cover letter</label>
                <textarea id="cl" required rows={5} className="input" value={form.coverLetter}
                  onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                  placeholder="Why are you a good fit?" />
              </div>
              <div>
                <label htmlFor="rl" className="label">Resume link</label>
                <input id="rl" type="url" required className="input" value={form.resumeLink}
                  onChange={(e) => setForm({ ...form, resumeLink: e.target.value })}
                  placeholder="https://drive.google.com/..." />
              </div>
              <button className="btn-primary w-full" disabled={sending}>{sending ? 'Submitting…' : 'Submit application'}</button>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
