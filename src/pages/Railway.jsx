import { Link, useParams } from "react-router-dom";
import { CalendarRange, TrainFront } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import DateCard from "../components/DateCard";
import ExamCard from "../components/ExamCard";
import ExamInfo from "../components/ExamInfo";
import Header from "../components/Header";
import SetCard from "../components/SetCard";
import ShiftCard from "../components/ShiftCard";
import YearSection from "../components/YearSection";
import { railwayAlp } from "../data/railwayAlpData";
import { railwayGroupD } from "../data/railwayGroupDData";
import { railwayNtpc } from "../data/railwayNtpcData";

const exams = { "group-d": railwayGroupD, ntpc: railwayNtpc, alp: railwayAlp };

function Railway() {
  const { exam } = useParams();
  const selected = exams[exam];
  if (!selected) return <RailwayOverview />;
  if (selected.id !== "group-d") return <EmptyRailwayExam data={selected} />;

  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header backTo="/railway" backLabel="Railway / RRB" /><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
    <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Railway / RRB", to: "/railway" }, { label: selected.title }]} />
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Railway Recruitment Boards</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{selected.title}</h1><p className="mt-3 max-w-2xl text-slate-600">{selected.description}</p></div><Link to="/railway" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300">Switch exam</Link></div>
    <div className="mt-7 max-w-3xl"><ExamInfo items={[{ icon: "correct", label: "Correct answer", value: selected.correct }, { icon: "wrong", label: "Wrong answer", value: selected.wrong }, { icon: "unanswered", label: "Unanswered", value: selected.unanswered }]} /></div>
    <section className="mt-10"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Exam sessions</p><h2 className="mt-1 text-2xl font-bold">Browse by year</h2></div><div className="space-y-5">
      {selected.years.map((year) => <YearSection key={year.year} year={year.year} eyebrow={year.stage || "RRB Group D"}>{year.months.map((month) => <div key={month.month} className="p-5"><h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800"><CalendarRange size={17} className="text-indigo-600" />{month.month} {year.year}</h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{month.dates.map((date) => <DateCard key={date.slug} date={date.date} compact><div className="grid gap-2">{date.shifts.map((shift, index) => <ShiftCard key={shift} name={shift}><SetCard label="Start Test" to={`/test/railway/group-d/${year.year}/${date.slug}/shift-${index + 1}`} /></ShiftCard>)}</div></DateCard>)}</div></div>)}</YearSection>)}
    </div></section>
  </main></div>;
}

function RailwayOverview() {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header /><main className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Railway / RRB" }]} /><p className="text-sm font-semibold text-indigo-600">RAILWAY RECRUITMENT BOARDS</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Railway exam papers</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Select an RRB examination to open its own paper archive.</p><div className="mt-8 grid gap-4 md:grid-cols-3"><ExamCard title="RRB Group D" subtitle="Level 1" description="Date-wise sessions with three shifts per exam day." to="/railway/group-d" icon={TrainFront} /><ExamCard title="RRB NTPC" subtitle="Non-Technical Popular Categories" description="Open the dedicated NTPC archive and browse available paper records." to="/railway/ntpc" icon={TrainFront} tone="teal" /><ExamCard title="RRB ALP" subtitle="Assistant Loco Pilot" description="Open the dedicated ALP archive for its future paper collection." to="/railway/alp" icon={TrainFront} tone="amber" /></div></main></div>;
}

function EmptyRailwayExam({ data }) {
  const sections = data.categories || data.stages;
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Header backTo="/railway" backLabel="Railway / RRB" /><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Railway / RRB", to: "/railway" }, { label: data.title }]} /><section className="border-b border-slate-200 pb-7"><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Railway archive</p><h1 className="mt-2 text-4xl font-bold text-slate-950">{data.title}</h1><p className="mt-3 max-w-2xl text-slate-600">{data.description}</p></section><div className="mt-7 grid gap-4 md:grid-cols-2">{sections.map((entry) => <section key={entry.id} className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-bold">{entry.title}</h2><p className="mt-2 text-sm text-slate-500">No papers added yet.</p></section>)}</div><div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-white p-6"><h2 className="font-bold text-slate-900">Paper archive is being prepared</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">There are no dates or papers in the current {data.title} data. This archive is kept separate from Group D so its exam-specific structure can be added when source records are available.</p></div></main></div>;
}

export default Railway;