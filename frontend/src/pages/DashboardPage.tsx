import { useAppSelector } from '../app/hooks';

const stats = [
  { label: 'Total users', value: '1', change: '+1 this week' },
  { label: 'Active sessions', value: '1', change: 'You, right now' },
  { label: 'API requests', value: '—', change: 'Not tracked yet' },
  { label: 'Errors', value: '—', change: 'Not tracked yet' },
];

const activity = [
  { event: 'Signed in', detail: 'Bearer token issued', when: 'Just now' },
  { event: 'Account seeded', detail: 'Created by DatabaseSeeder', when: 'Earlier' },
];

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here is what is happening in your workspace.</p>
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        The figures below are placeholders. No reporting data exists in the application yet.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium tracking-wide text-slate-500 uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">Event</th>
                <th scope="col" className="px-5 py-3">Detail</th>
                <th scope="col" className="px-5 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activity.map((row) => (
                <tr key={row.event} className="transition hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{row.event}</td>
                  <td className="px-5 py-3 text-slate-600">{row.detail}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-500">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
