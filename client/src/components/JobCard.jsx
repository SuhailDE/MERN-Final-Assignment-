import { Link } from 'react-router-dom';

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function JobCard({ job }) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-5 transition-colors hover:border-brand">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold leading-snug">{job.title}</h3>
          <p className="text-muted">{job.company}</p>
        </div>
        <span className="tag shrink-0">{job.type}</span>
      </div>
      <dl className="mt-4 space-y-1 text-sm text-muted">
        <div className="flex gap-2"><dt className="font-semibold text-ink">Location</dt><dd>{job.location}</dd></div>
        <div className="flex gap-2"><dt className="font-semibold text-ink">Salary</dt><dd>{job.salary}</dd></div>
        <div className="flex gap-2"><dt className="font-semibold text-ink">Category</dt><dd>{job.category}</dd></div>
      </dl>
      <div className="mt-5 flex items-center justify-between pt-1">
        <span className="text-sm text-muted">Apply by {formatDate(job.deadline)}</span>
        <Link to={`/jobs/${job._id}`} className="btn-ghost !px-4 !py-1.5 text-sm">View details</Link>
      </div>
    </article>
  );
}
