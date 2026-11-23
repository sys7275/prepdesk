import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function Header({ backTo = "/", backLabel = "Home" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to={backTo} className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-600">
          <BookOpen size={19} className="text-indigo-600" />
          PrepDesk
          {backLabel !== "Home" && <span className="font-normal text-slate-400">/ {backLabel}</span>}
        </Link>
        <nav aria-label="Exam categories" className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link className="transition hover:text-indigo-600" to="/upsssc">UPSSSC</Link>
          <Link className="transition hover:text-indigo-600" to="/ssc">SSC</Link>
          <Link className="transition hover:text-indigo-600" to="/railway">Railway</Link>
          <Link className="transition hover:text-indigo-600" to="/gate">GATE</Link>
        </nav>
        <Link to="/" aria-label="Back to PrepDesk home" className="text-sm font-semibold text-indigo-600 sm:hidden">Home</Link>
      </div>
    </header>
  );
}

export default Header;