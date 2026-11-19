import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuthStore } from '../store/authStore';

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

export default function JobForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', company: user.companyName || '', location: '', type: 'Full-time', category: '',
    salary: '', deadline: '', description: '', requirements: '',
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!editing) return;
    api.get(`/jobs/${id}`)
      .then(({ data: { job } }) =>
        setForm({
          title: job.title, company: job.company, location: job.location, type: job.type,
          category: job.category, salary: job.salary || '',
          deadline: job.deadline ? job.deadline.slice(0, 10) : '',
          description: job.description, requirements: (job.requirements || []).join('\n'),
        })
      )
      .catch((e) => { toast.error(errMsg(e)); navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [id, editing, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/jobs/${id}`, form);
      else await api.post('/jobs', form);
      toast.success(editing ? 'Job updated' : 'Job posted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container-x max-w-3xl py-10">
      <Link to="/dashboard" className="text-sm font-semibold text-brand hover:underline">Back to dashboard</Link>
      <h1 className="mt-2 text-3xl font-extrabold">{editing ? 'Edit job' : 'Post a new job'}</h1>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-line bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="t" className="label">Job title</label><input id="t" required className="input" value={form.title} onChange={set('title')} /></div>
          <div><label htmlFor="c" className="label">Company</label><input id="c" required className="input" value={form.company} onChange={set('company')} /></div>
          <div><label htmlFor="l" className="label">Location</label><input id="l" required className="input" value={form.location} onChange={set('location')} /></div>
          <div><label htmlFor="cat" className="label">Category</label><input id="cat" required className="input" value={form.category} onChange={set('category')} placeholder="Software, Design, Finance…" /></div>
          <div>
            <label htmlFor="ty" className="label">Job type</label>
            <select id="ty" className="input" value={form.type} onChange={set('type')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </div>
          <div><label htmlFor="sal" className="label">Salary</label><input id="sal" className="input" value={form.salary} onChange={set('salary')} placeholder="BDT 50,000 - 70,000" /></div>
          <div><label htmlFor="d" className="label">Application deadline</label><input id="d" type="date" className="input" value={form.deadline} onChange={set('deadline')} /></div>
        </div>
        <div><label htmlFor="desc" className="label">Description</label><textarea id="desc" required rows={6} className="input" value={form.description} onChange={set('description')} /></div>
        <div>
          <label htmlFor="req" className="label">Requirements (one per line)</label>
          <textarea id="req" rows={5} className="input" value={form.requirements} onChange={set('requirements')} />
        </div>
        <div className="flex gap-3">
          <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Publish job'}</button>
          <Link to="/dashboard" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
