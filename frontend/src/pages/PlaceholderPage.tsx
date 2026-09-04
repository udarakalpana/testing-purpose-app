/**
 * Stands in for a section the sidebar links to but that has no feature behind
 * it yet, so navigation resolves instead of falling through to the catch-all.
 */
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">This section has not been built yet.</p>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <svg className="h-8 w-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <p className="text-sm font-medium text-slate-900">Nothing here yet</p>
        <p className="max-w-sm text-sm text-slate-500">
          The {title.toLowerCase()} area is a placeholder so the navigation works end to end.
        </p>
      </div>
    </div>
  );
}
