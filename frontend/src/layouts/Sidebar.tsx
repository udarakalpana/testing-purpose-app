import { NavLink } from 'react-router';

type NavItem = {
  label: string;
  to: string;
  icon: string;
};

/** Single-path icons keep the shell dependency-free. */
const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'M4 5h6v6H4V5Zm10 0h6v4h-6V5ZM4 15h6v4H4v-4Zm10-2h6v6h-6v-6Z' },
  { label: 'Users', to: '/dashboard/users', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0H4Z' },
  { label: 'Reports', to: '/dashboard/reports', icon: 'M5 3h9l5 5v13H5V3Zm8 1v5h5M8 13h8M8 17h5' },
  { label: 'Settings', to: '/dashboard/settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 1-.1 1.2l2 1.6-2 3.4-2.4-1a8 8 0 0 1-2 1.2l-.4 2.6h-4l-.4-2.6a8 8 0 0 1-2-1.2l-2.4 1-2-3.4 2-1.6A8 8 0 0 1 4 12c0-.4 0-.8.1-1.2l-2-1.6 2-3.4 2.4 1a8 8 0 0 1 2-1.2L9 3h4l.4 2.6a8 8 0 0 1 2 1.2l2.4-1 2 3.4-2 1.6c.1.4.1.8.1 1.2Z' },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 border-r border-slate-200 bg-white px-4 py-6">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
          TA
        </div>
        <span className="text-base font-semibold tracking-tight text-slate-900">Test App</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">Placeholder panel</p>
        <p className="mt-1 text-xs text-slate-500">
          This shell is ready for real features. Nothing here is wired to live data yet.
        </p>
      </div>
    </div>
  );
}
