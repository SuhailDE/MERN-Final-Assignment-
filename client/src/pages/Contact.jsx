import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';

export default function Contact() {
  const empty = { name: '', email: '', subject: '', message: '' };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/contact', form);
      toast.success(data.message);
      setForm(empty);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="text-4xl font-extrabold">Contact us</h1>
        <p className="mt-3 max-w-md text-muted">Questions about a job post, your account, or hiring on KormoHub? Send a message and we’ll reply within two working days.</p>
        <dl className="mt-8 space-y-4">
          <div><dt className="font-bold">Email</dt><dd className="text-muted">hello@kormohub.com</dd></div>
          <div><dt className="font-bold">Phone</dt><dd className="text-muted">+880 1700-000000</dd></div>
          <div><dt className="font-bold">Office</dt><dd className="text-muted">Level 5, Banani, Dhaka 1213</dd></div>
          <div><dt className="font-bold">Hours</dt><dd className="text-muted">Sunday to Thursday, 9:00 am to 6:00 pm</dd></div>
        </dl>
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-line bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="n" className="label">Name</label><input id="n" required className="input" value={form.name} onChange={set('name')} /></div>
          <div><label htmlFor="e" className="label">Email</label><input id="e" type="email" required className="input" value={form.email} onChange={set('email')} /></div>
        </div>
        <div><label htmlFor="s" className="label">Subject</label><input id="s" className="input" value={form.subject} onChange={set('subject')} /></div>
        <div><label htmlFor="m" className="label">Message</label><textarea id="m" required rows={6} className="input" value={form.message} onChange={set('message')} /></div>
        <button className="btn-primary" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
      </form>
    </div>
  );
}
