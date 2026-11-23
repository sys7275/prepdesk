import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  FileText,
  PlayCircle,
  GraduationCap,
  Calendar,
} from "lucide-react";

import { uptetExam } from "../data/uptetData";
import { superTetExam } from "../data/superTetData";
import { upTgtExam } from "../data/upTgtData";
import { upPgtExam } from "../data/upPgtData";

const upesscExams = [
  {
    slug: "uptet",
    badge: "TET (Paper 1 & 2)",
    subtitle: "2011 to 2026 Exam Dates (2021 Cancelled)",
    data: uptetExam,
    markingLabel: "+1 Mark | No Negative Marking",
    totalMarksLabel: "150 Marks",
    durationLabel: "2 Ghante 30 Min",
  },
  {
    slug: "super-tet",
    badge: "Super TET",
    subtitle: "2018 (1 Shift) & 2021 (2 Shifts)",
    data: superTetExam,
    markingLabel: "+3 Marks | -1 Mark (1/3rd)",
    totalMarksLabel: "360 Marks",
    durationLabel: "2 Ghante",
  },
  {
    slug: "tgt",
    badge: "UP TGT",
    subtitle: "Subject-wise • 2019, 2021 & 2026 (2 Days, 2 Shifts)",
    data: upTgtExam,
    markingLabel: "+3 Marks | -1 Mark (1/3rd)",
    totalMarksLabel: "360 Marks",
    durationLabel: "2 Ghante",
  },
  {
    slug: "pgt",
    badge: "UP PGT",
    subtitle: "2019, 2021 & 2026 • Hamesha 2 Shift",
    data: upPgtExam,
    markingLabel: "+3 Marks | -1 Mark (1/3rd)",
    totalMarksLabel: "360 + 40 (Interview)",
    durationLabel: "2 Ghante",
  },
];

const practiceSets = Array.from({ length: 15 }, (_, i) => i + 1);

function UPESSC() {
  const [selectedSlug, setSelectedSlug] = useState("uptet");
  const [activeTab, setActiveTab] = useState("practice"); // "practice" | "pyq"
  const [selectedYear, setSelectedYear] = useState("2026");

  const currentExam =
    upesscExams.find((item) => item.slug === selectedSlug) || upesscExams[0];

  const yearObj =
    currentExam.data.years.find((y) => String(y.year) === String(selectedYear)) ||
    currentExam.data.years[0];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <GraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-950">
                  UPESSC Examinations
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  TET, Super TET, TGT & PGT — Official Dates, Shifts, Subjects & Practice Sets
                </p>
              </div>
            </div>
          </div>

          {/* EXAM TABS */}
          <div className="mt-6 flex flex-wrap gap-2">
            {upesscExams.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(item.slug);
                  setSelectedYear(String(item.data.years[0]?.year || "2026"));
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  selectedSlug === item.slug
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.badge}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* EXAM PATTERN & MARKING RULES CARD */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {currentExam.badge}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {currentExam.subtitle}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === "practice"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Practice Sets (1–15)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pyq")}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === "pyq"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Previous Year Papers (PYQ)
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<FileText size={18} className="text-indigo-600" />}
              label="Total Questions"
              value={`${currentExam.data.totalQuestions} Questions`}
            />
            <InfoCard
              icon={<Award size={18} className="text-emerald-600" />}
              label="Total Marks"
              value={currentExam.totalMarksLabel}
            />
            <InfoCard
              icon={<AlertCircle size={18} className="text-amber-600" />}
              label="Marking Scheme"
              value={currentExam.markingLabel}
            />
            <InfoCard
              icon={<Clock size={18} className="text-rose-600" />}
              label="Exam Duration"
              value={currentExam.durationLabel}
            />
          </div>
        </section>

        {/* PRACTICE SETS SECTION */}
        {activeTab === "practice" && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5">
              <BookOpen size={20} className="text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {currentExam.badge} — Practice Sets
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Questions strictly follow exam rules ({currentExam.data.totalQuestions} Qs | {currentExam.totalMarksLabel} | {currentExam.markingLabel} | {currentExam.durationLabel})
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {practiceSets.map((setNum) => (
                <Link
                  key={setNum}
                  to={`/practice/upessc/${currentExam.slug}/${setNum}`}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-400 hover:bg-indigo-50/40"
                >
                  <div>
                    <span className="inline-block rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      Set {setNum}
                    </span>
                    <h4 className="mt-2.5 text-base font-bold text-slate-900">
                      Practice Set {setNum}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {currentExam.data.totalQuestions} Qs • {currentExam.durationLabel}
                    </p>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition">
                    <PlayCircle size={15} />
                    Start Test
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PREVIOUS YEAR PAPERS (PYQ) SECTION */}
        {activeTab === "pyq" && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentExam.badge} — Previous Year Question Papers
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Select year, exam date, shift{Array.isArray(yearObj?.subjects) ? ", and subject" : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentExam.data.years.map((yr) => (
                  <button
                    key={yr.year}
                    type="button"
                    onClick={() => setSelectedYear(String(yr.year))}
                    className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                      String(yearObj?.year) === String(yr.year)
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Year {yr.year}
                  </button>
                ))}
              </div>
            </div>

            {/* EXAM DATES & SHIFTS OVERVIEW */}
            {Array.isArray(yearObj?.dates) && yearObj.dates.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {yearObj.dates.map((d) => (
                  <div
                    key={d.date}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-900"
                  >
                    <Calendar size={14} className="text-indigo-600" />
                    <span>{d.date}</span>
                    <span className="text-indigo-600">
                      ({d.shifts.join(", ")})
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* SUBJECT-WISE PYQ CARDS (UP TGT) */}
            {Array.isArray(yearObj?.subjects) ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {yearObj.subjects.map((subj) => (
                  <div
                    key={`${yearObj.year}-${subj.name}`}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/30"
                  >
                    <div>
                      <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                        {subj.name}
                      </span>
                      <h4 className="mt-2.5 text-base font-bold text-slate-900">
                        UP TGT ({subj.name}) — {yearObj.year}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        120 Qs • 360 Marks • +3 / -1 • 2 Ghante
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {subj.sets.map((sName) => (
                        <Link
                          key={sName}
                          to={`/exam/upessc/${currentExam.slug}?year=${yearObj.year}&subject=${encodeURIComponent(
                            subj.name
                          )}&set=${encodeURIComponent(sName)}`}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 transition hover:border-indigo-400 hover:text-indigo-600"
                        >
                          <span>{sName}</span>
                          <PlayCircle size={14} className="text-indigo-600" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* DATE & SHIFT-WISE PYQ LIST (TET, SUPER TET, PGT) */
              <div className="mt-6 space-y-4">
                {yearObj?.dates?.map((dateItem) => (
                  <div
                    key={dateItem.date}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h4 className="text-sm font-bold text-slate-900">
                      {yearObj.year} — {dateItem.date}
                    </h4>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                      {dateItem.shifts.map((shiftName) =>
                        dateItem.sets.map((setCode) => (
                          <Link
                            key={`${shiftName}-${setCode}`}
                            to={`/exam/upessc/${currentExam.slug}?year=${
                              yearObj.year
                            }&date=${encodeURIComponent(
                              dateItem.date
                            )}&shift=${encodeURIComponent(
                              shiftName
                            )}&set=${encodeURIComponent(setCode)}`}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-indigo-400 hover:text-indigo-600"
                          >
                            <span>
                              {shiftName} ({setCode})
                            </span>
                            <PlayCircle size={15} className="text-indigo-600" />
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default UPESSC;