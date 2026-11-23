import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {items.map((item, index) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {item.to && index < items.length - 1 ? <Link className="transition hover:text-indigo-600" to={item.to}>{item.label}</Link> : <span aria-current={index === items.length - 1 ? "page" : undefined} className={index === items.length - 1 ? "font-semibold text-slate-800" : ""}>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;