import { CalendarDays } from "lucide-react";

function YearSection({ year, eyebrow, children, count }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white"><CalendarDays size={19} /></span>
          <div><h3 className="text-xl font-bold text-slate-950">{year}</h3>{eyebrow && <p className="text-xs text-slate-500">{eyebrow}</p>}</div>
        </div>
        {count !== undefined && <span className="text-xs font-medium text-slate-500">{count}</span>}
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </section>
  );
}

export default YearSection;