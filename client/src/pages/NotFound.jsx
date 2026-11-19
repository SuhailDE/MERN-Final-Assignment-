import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-5xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
