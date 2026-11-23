import { useParams } from "react-router-dom";
import { BookOpenCheck, FileQuestion, Minus } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import ExamCard from "../components/ExamCard";
import Header from "../components/Header";
import SetCard from "../components/SetCard";
import YearSection from "../components/YearSection";
import { gateCse } from "../data/gateCseData";

function GATE() {
  const { paper } = useParams();
  if (!paper) return <GateOverview />;
  return <GateCse />;
}

function GateOverview() {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "GATE" }]} /><p className="text-sm font-semibold text-indigo-600">GRADUATE APTITUDE TEST IN ENGINEERING</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">GATE previous year papers</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Choose a paper collection to review the question-type marking rules and year-wise sets.</p><div className="mt-8 max-w-md"><ExamCard title="GATE CSE" subtitle="Computer Science and IT" description="2016–2025 papers with MCQ, MSQ and NAT marking information." to="/gate/cse" icon={BookOpenCheck} /></div></main></div>;
}

function GateCse() {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header backTo="/gate" backLabel="GATE" /><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "GATE", to: "/gate" }, { label: "CSE" }]} /><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Computer Science and Information Technology</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{gateCse.title} papers</h1><p className="mt-3 max-w-2xl text-slate-600">Select a year and set. Review the marking rules before starting.</p></div><span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">2016–2025</span></div>
    <section className="mt-7 rounded-xl border border-indigo-200 bg-indigo-950 p-5 text-white sm:p-6"><div className="flex items-center gap-2"><FileQuestion size={19} className="text-indigo-300" /><h2 className="text-lg font-bold">Marking scheme</h2></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{gateCse.marking.map((item) => <div key={item.type} className="rounded-lg border border-white/10 bg-white/5 p-4"><p className="font-bold text-indigo-200">{item.type}</p><p className="mt-2 text-sm leading-6 text-indigo-50">{item.detail}</p></div>)}</div><p className="mt-4 flex items-center gap-2 text-sm text-indigo-100"><Minus size={15} />No negative marks for MSQ or NAT; unanswered questions score 0.</p></section>
    <section className="mt-10"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Paper archive</p><h2 className="mt-1 text-2xl font-bold">Select a year</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{gateCse.years.map((year) => <YearSection key={year.year} year={year.year} eyebrow="GATE CSE" count={`${year.sets.length} ${year.sets.length === 1 ? "paper" : "papers"}`}><div className="flex flex-wrap gap-2 p-4">{year.sets.map((set, index) => <SetCard key={set} label={set} to={`/test/gate/cse/${year.year}/set-${index + 1}`} />)}</div></YearSection>)}</div></section>
  </main></div>;
}

export default GATE;