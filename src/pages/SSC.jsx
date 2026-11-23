import { Link, useParams } from "react-router-dom";
import { Layers3, Trophy } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import DateCard from "../components/DateCard";
import ExamCard from "../components/ExamCard";
import ExamInfo from "../components/ExamInfo";
import Header from "../components/Header";
import SetCard from "../components/SetCard";
import ShiftCard from "../components/ShiftCard";
import YearSection from "../components/YearSection";
import { sscCgl } from "../data/sscCglData";
import { sscChsl } from "../data/sscChslData";

const exams = { cgl: sscCgl, chsl: sscChsl };

function SSC() {
  const { exam } = useParams();
  const selected = exams[exam];
  if (!selected) return <SSCOverview />;
  const isCgl = selected.id === "cgl";

  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header backTo="/ssc" backLabel="SSC" /><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
    <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "SSC", to: "/ssc" }, { label: selected.title }]} />
    <section className={`rounded-2xl border p-6 sm:p-8 ${isCgl ? "border-indigo-200 bg-indigo-950 text-white" : "border-teal-200 bg-white"}`}><div className="flex flex-wrap items-start justify-between gap-5"><div className="max-w-2xl"><p className={`text-xs font-bold uppercase tracking-wider ${isCgl ? "text-indigo-300" : "text-teal-700"}`}>Staff Selection Commission</p><h1 className={`mt-3 text-3xl font-bold sm:text-4xl ${isCgl ? "text-white" : "text-slate-950"}`}>{selected.title}</h1><p className={`mt-3 text-sm leading-6 sm:text-base ${isCgl ? "text-indigo-100" : "text-slate-600"}`}>{selected.description}</p></div><div className={`rounded-xl px-4 py-3 text-sm font-semibold ${isCgl ? "bg-white/10 text-indigo-100" : "bg-teal-50 text-teal-800"}`}>Tier 1 archive</div></div>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Choose SSC exam">{Object.values(exams).map((item) => <Link key={item.id} to={`/ssc/${item.id}`} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${item.id === selected.id ? (isCgl ? "bg-white text-indigo-950" : "bg-teal-700 text-white") : (isCgl ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-600 hover:bg-teal-50")}`}>{item.title}</Link>)}</div>
    </section>
    <section className="mt-7" aria-label={`${selected.title} exam information`}><ExamInfo items={[{ icon: "questions", label: "Question type", value: selected.questionType }, { icon: "questions", label: "Questions", value: String(selected.questions) }, { icon: "marks", label: "Maximum marks", value: String(selected.marks) }, { icon: "duration", label: "Duration", value: selected.duration }, { icon: "correct", label: "Correct answer", value: selected.correct }, { icon: "wrong", label: "Wrong answer", value: selected.wrong }, { icon: "unanswered", label: "Unanswered", value: selected.unanswered }]} /></section>
    <section className="mt-10"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Paper archive</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Select a year</h2></div><span className="text-sm text-slate-500">{selected.years.length} years</span></div><div className="space-y-5">
      {selected.years.map((year) => <YearSection key={year.year} year={year.year} eyebrow={`${selected.title} · Tier 1`}>
          {year.tiers.map((tier) => <div key={tier.name} className="p-5"><div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800"><Layers3 size={17} className="text-indigo-600" />{tier.name}</div>
            {tier.dates.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{tier.dates.map((entry) => <DateCard key={entry.date} date={entry.date} compact><div className="grid gap-2">{entry.shifts.map((shift, index) => <ShiftCard key={shift} name={shift}><SetCard label="Start Test" to={`/test/ssc/${selected.id}/${year.year}/${entry.date.replaceAll("/", "-")}/shift-${index + 1}`} /></ShiftCard>)}</div></DateCard>)}</div> : <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-600">Dates and shifts have not been added to the current project data for this year.</div>}
        </div>)}
      </YearSection>)}
    </div></section>
  </main></div>;
}

function SSCOverview() {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "SSC" }]} /><p className="text-sm font-semibold text-indigo-600">STAFF SELECTION COMMISSION</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">SSC previous year papers</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Choose an examination to browse its Tier 1 papers and marking scheme.</p><div className="mt-8 grid gap-4 md:grid-cols-2"><ExamCard title="SSC CGL" subtitle="Combined Graduate Level" description="Tier 1 papers organized by year, date and shift." to="/ssc/cgl" icon={Trophy} /><ExamCard title="SSC CHSL" subtitle="Combined Higher Secondary Level" description="Tier 1 archive with its own year-wise paper index." to="/ssc/chsl" icon={Layers3} tone="teal" /></div></main></div>;
}

export default SSC;