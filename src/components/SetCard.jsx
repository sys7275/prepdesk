import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function SetCard({ label, to }) {
  return (
    <Link to={to} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      {label}<ArrowRight size={15} />
    </Link>
  );
}

export default SetCard;