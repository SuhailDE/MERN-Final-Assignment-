import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import Spinner from '../components/Spinner';
import { formatDate } from '../components/JobCard';
import { useAuthStore } from '../store/authStore';

const statusStyle = {
  pending: 'bg-slate-100 text-slate-700',
  reviewed: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

function ProfileForm() {
  const { user, setUser } = useAuthStore();
  const isRecruiter = user.role === 'recruiter';
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    skills: (user.skills || []).join(', '),
    resumeLink: user.resumeLink || '',
    companyName: user.companyName || '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4 rounded-xl border border-line bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="pn" className="label">Full name</label><input id="pn" required className="input" value={form.name} onChange={set('name')} /></div>
        <div><label className="label">Email</label><input className="input bg-slate-50" value={user.email} disabled /></div>
        <div><label htmlFor="pp" className="label">Phone</label><input id="pp" className="input" value={form.phone} onChange={set('phone')} /></div>
        <div><label htmlFor="pl" className="label">Location</label><input id="pl" className="input" value={form.location} onChange={set('location')} /></div>
      </div>
      {isRecruiter ? (
        <div><label htmlFor="pc" className="label">Company name</label><input id="pc" className="input" value={form.companyName} onChange={set('companyName')} /></div>
      ) : (
        <>
          <div><label htmlFor="ps" className="label">Skills (comma separated)</label><input id="ps" className="input" value={form.skills} onChange={set('skills')} placeholder="React, Node.js, MongoDB" /></div>
          <div><label htmlFor="pr" className="label">Resume link</label><input id="pr" type="url" className="input" value={form.resumeLink} onChange={set('resumeLink')} placeholder="https://..." /></div>
        </>
      )}
      <div><label htmlFor="pb" className="label">Bio</label><textarea id="pb" rows={4} maxLength={600} className="input" value={form.bio} onChange={set('bio')} /></div>
      <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
    </form>
  );
}

function AppliedJobs() {
  const [apps, setApps] = useState(null);
  useEffect(() => {
    api.get('/applications/my').then((r) => setApps(r.data.applications)).catch((e) => toast.error(errMsg(e)));
  }, []);

  if (!apps) return <Spinner />;
  if (apps.length === 0)
    return (
      <div className="rounded-xl border border-dashed border-line p-10 text-center">
        <p className="font-semibold">You haven’t applied to any jobs yet.</p>
        <Link to="/jobs" className="btn-primary mt-4">Browse jobs</Link>
      </div>
    );

  return (
    <ul className="space-y-3">
      {apps.map((a) => (
        <li key={a._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
          <div>
            {a.job ? (
              <Link to={`/jobs/${a.job._id}`} className="text-lg font-bold hover:text-brand">{a.job.title}</Link>
            ) : (
              <span className="text-lg font-bold">Job removed</span>
            )}
            <p className="text-sm text-muted">{a.job?.company} · Applied {formatDate(a.createdAt)}</p>
          </div>
          <span className={`rounded-md px-3 py-1 text-sm font-semibold capitalize ${statusStyle[a.status]}`}>{a.status}</span>
        </li>
      ))}
    </ul>
  );
}

function MyJobs() {
  const [jobs, setJobs] = useState(null);
  const load = () => api.get('/jobs/mine').then((r) => setJobs(r.data.jobs)).catch((e) => toast.error(errMsg(e)));
  useEffect(() => { load(); }, []);

  const remove = async (job) => {
    if (!window.confirm(`Delete “${job.title}”? Its applications will be removed too.`)) return;
    try {
      await api.delete(`/jobs/${job._id}`);
      toast.success('Job deleted');
      setJobs((j) => j.filter((x) => x._id !== job._id));
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  if (!jobs) return <Spinner />;
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link to="/dashboard/jobs/new" className="btn-primary">Post a new job</Link>
      </div>
      {jobs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-10 text-center font-semibold">You haven’t posted any jobs yet.</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((j) => (
            <li key={j._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white p-4">
              <div>
                <Link to={`/jobs/${j._id}`} className="text-lg font-bold hover:text-brand">{j.title}</Link>
                <p className="text-sm text-muted">{j.location} · {j.type} · Posted {formatDate(j.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/dashboard/jobs/${j._id}/applicants`} className="btn-ghost !px-4 !py-1.5 text-sm">Applicants ({j.applicantCount})</Link>
                <Link to={`/dashboard/jobs/${j._id}/edit`} className="btn-ghost !px-4 !py-1.5 text-sm">Edit</Link>
                <button onClick={() => remove(j)} className="btn-danger !px-4 !py-1.5 text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const isRecruiter = user.role === 'recruiter';
  const tabs = isRecruiter ? [['jobs', 'My job posts'], ['profile', 'Profile']] : [['applied', 'Applied jobs'], ['profile', 'Profile']];
  const [tab, setTab] = useState(tabs[0][0]);

  return (
    <div className="container-x py-10">
      <h1 className="text-4xl font-extrabold">Dashboard</h1>
      <p className="mt-1 text-muted">{user.name} · {isRecruiter ? `Recruiter${user.companyName ? `, ${user.companyName}` : ''}` : 'Candidate'}</p>

      <div role="tablist" className="mt-6 flex gap-2 border-b border-line">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2.5 font-semibold ${tab === key ? 'border-brand text-brand-dark' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'profile' && <ProfileForm />}
        {tab === 'applied' && <AppliedJobs />}
        {tab === 'jobs' && <MyJobs />}
      </div>
    </div>
  );
}
