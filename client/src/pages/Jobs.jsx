import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(params.get('search') || '');

  const page = Number(params.get('page') || 1);
  const category = params.get('category') || '';
  const type = params.get('type') || '';
  const urlSearch = params.get('search') || '';

  useEffect(() => setSearch(urlSearch), [urlSearch]);
  useEffect(() => {
    api.get('/jobs/categories').then((r) => setCategories(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/jobs', { params: { search: urlSearch, category, type, page, limit: 9 } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [urlSearch, category, type, page]);

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: 1, ...changes }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };

  return (
    <div className="container-x py-10">
      <h1 className="text-4xl font-extrabold">All jobs</h1>
      <p className="mt-1 text-muted">{loading ? 'Searching…' : `${data.total} openings found`}</p>

      <form
        onSubmit={(e) => { e.preventDefault(); update({ search: search.trim() }); }}
        className="mt-6 grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[1fr_200px_180px_auto]"
      >
        <div>
          <label htmlFor="s" className="sr-only">Search</label>
          <input id="s" className="input" placeholder="Title, company or city" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c" className="sr-only">Category</label>
          <select id="c" className="input" value={category} onChange={(e) => update({ category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="t" className="sr-only">Job type</label>
          <select id="t" className="input" value={type} onChange={(e) => update({ type: e.target.value })}>
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button className="btn-primary">Search</button>
      </form>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="mt-8 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      ) : data.jobs.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line p-10 text-center">
          <p className="font-semibold">No jobs match those filters.</p>
          <button className="btn-ghost mt-4" onClick={() => setParams({})}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.jobs.map((j) => <JobCard key={j._id} job={j} />)}
          </div>
          {data.pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
              <button className="btn-ghost" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</button>
              <span className="text-muted">Page {page} of {data.pages}</span>
              <button className="btn-ghost" disabled={page >= data.pages} onClick={() => update({ page: page + 1 })}>Next</button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
