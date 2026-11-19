import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import Spinner from '../components/Spinner';
import { formatDate } from '../components/JobCard';

const STATUSES = ['pending', 'reviewed', 'shortlisted', 'rejected'];

export default function Applicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}/applications`).then((r) => setData(r.data)).catch((e) => toast.error(errMsg(e)));
  }, [id]);

  const setStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setData((d) => ({ ...d, applications: d.applications.map((a) => (a._id === appId ? { ...a, status } : a)) }));
      toast.success('Status updated');
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  if (!data) return <Spinner />;

  return (
    <div className="container-x max-w-4xl py-10">
      <Link to="/dashboard" className="text-sm font-semibold text-brand hover:underline">Back to dashboard</Link>
      <h1 className="mt-2 text-3xl font-extrabold">Applicants</h1>
      <p className="text-muted">{data.job.title} · {data.applications.length} applications</p>

      {data.applications.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line p-10 text-center font-semibold">No one has applied yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {data.applications.map((a) => (
            <li key={a._id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{a.applicant?.name}</h2>
                  <p className="text-sm text-muted">{a.applicant?.email}{a.applicant?.phone ? ` · ${a.applicant.phone}` : ''} · Applied {formatDate(a.createdAt)}</p>
                </div>
                <div>
                  <label htmlFor={`st-${a._id}`} className="sr-only">Status</label>
                  <select id={`st-${a._id}`} className="input !w-auto capitalize" value={a.status} onChange={(e) => setStatus(a._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {a.applicant?.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">{a.applicant.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div>
              )}
              <p className="mt-3 whitespace-pre-line">{a.coverLetter}</p>
              <a href={a.resumeLink} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-brand hover:underline">Open resume</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
