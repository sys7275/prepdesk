import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function ExamCard({ title, subtitle, description, to, icon: Icon, tone = "indigo" }) {
  const toneClasses = tone === "teal" ? "bg-teal-50 text-teal-700 group-hover:border-teal-200" : tone === "amber" ? "bg-amber-50 text-amber-700 group-hover:border-amber-200" : "bg-indigo-50 text-indigo-700 group-hover:border-indigo-200";
  return (
    <Link to={to} className={`group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${toneClasses.split(" ").at(-1)}`}>
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${toneClasses.split(" ").slice(0, 2).join(" ")}`}>
          {Icon && <Icon size={21} />}
        </div>
        <ArrowUpRight size={18} className="text-slate-400 transition group-hover:text-indigo-600" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      {subtitle && <p className="mt-1 text-sm font-semibold text-indigo-600">{subtitle}</p>}
      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      <span className="mt-5 inline-block text-sm font-semibold text-slate-700 group-hover:text-indigo-600">Browse papers</span>
    </Link>
  );
}

export default ExamCard;