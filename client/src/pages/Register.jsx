import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { errMsg } from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate', companyName: '' });
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-x flex justify-center py-16">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-xl border border-line bg-white p-8">
        <h1 className="text-3xl font-extrabold">Create your account</h1>

        <fieldset>
          <legend className="label">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {[['candidate', 'Job seeker'], ['recruiter', 'Recruiter']].map(([v, l]) => (
              <label key={v} className={`cursor-pointer rounded-lg border px-4 py-2.5 text-center font-semibold ${form.role === v ? 'border-brand bg-brand-soft text-brand-dark' : 'border-line'}`}>
                <input type="radio" name="role" value={v} checked={form.role === v} onChange={set('role')} className="sr-only" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" required className="input" value={form.name} onChange={set('name')} />
        </div>
        {form.role === 'recruiter' && (
          <div>
            <label htmlFor="company" className="label">Company name</label>
            <input id="company" required className="input" value={form.companyName} onChange={set('companyName')} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" required className="input" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" required minLength={6} className="input" value={form.password} onChange={set('password')} />
          <p className="mt-1 text-sm text-muted">At least 6 characters.</p>
        </div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <p className="text-center text-muted">Already registered? <Link to="/login" className="font-semibold text-brand hover:underline">Log in</Link></p>
      </form>
    </div>
  );
}
