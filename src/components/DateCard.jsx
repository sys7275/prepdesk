import { CalendarDays } from "lucide-react";

function DateCard({ date, children, compact = false }) {
  return (
    <div className={compact ? "min-w-0 rounded-lg border border-slate-200 bg-white p-3" : "p-5"}>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <CalendarDays size={16} className="shrink-0 text-indigo-600" />
        <span>{date}</span>
      </div>
      {children}
    </div>
  );
}

export default DateCard;