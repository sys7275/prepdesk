import { Clock3 } from "lucide-react";

function ShiftCard({ name, children }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Clock3 size={15} className="text-indigo-600" />{name}</span>
      {children}
    </div>
  );
}

export default ShiftCard;