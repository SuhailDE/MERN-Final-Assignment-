import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-slate-300">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-extrabold text-white">Kormo<span className="text-signal">Hub</span></p>
          <p className="mt-3 max-w-sm">
            A job portal where candidates find the next role and recruiters find the right people.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">Explore</h4>
          <ul className="space-y-2">
            <li><Link className="hover:text-white" to="/jobs">Browse jobs</Link></li>
            <li><Link className="hover:text-white" to="/register">Create account</Link></li>
            <li><Link className="hover:text-white" to="/contact">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-bold text-white">Contact</h4>
          <ul className="space-y-2">
            <li>hello@kormohub.com</li>
            <li>+880 1700-000000</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm">
        © {new Date().getFullYear()} KormoHub. All rights reserved.
      </div>
    </footer>
  );
}
