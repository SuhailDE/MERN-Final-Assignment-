import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const linkCls = ({ isActive }) =>
  `rounded-md px-3 py-2 font-semibold transition-colors ${isActive ? 'bg-brand-soft text-brand-dark' : 'text-ink hover:text-brand'}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    toast.success('Logged out');
    navigate('/');
  };
  const close = () => setOpen(false);

  const links = (
    <>
      <NavLink to="/" end className={linkCls} onClick={close}>Home</NavLink>
      <NavLink to="/jobs" className={linkCls} onClick={close}>Jobs</NavLink>
      <NavLink to="/contact" className={linkCls} onClick={close}>Contact</NavLink>
      {token && <NavLink to="/dashboard" className={linkCls} onClick={close}>Dashboard</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
          Kormo<span className="text-brand">Hub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">{links}</nav>

        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <>
              <span className="text-sm text-muted">Hi, {user?.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-ghost !py-2">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost !py-2">Log in</Link>
              <Link to="/register" className="btn-primary !py-2">Sign up</Link>
            </>
          )}
        </div>

        <button
          className="rounded-md border border-line p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="container-x flex flex-col gap-1 py-3">
            {links}
            {token ? (
              <button onClick={handleLogout} className="btn-ghost mt-2">Log out</button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={close} className="btn-ghost flex-1">Log in</Link>
                <Link to="/register" onClick={close} className="btn-primary flex-1">Sign up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
