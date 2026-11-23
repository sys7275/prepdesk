import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Minus,
  CircleHelp,
} from "lucide-react";
import { petExam } from "../data/petData";
import Breadcrumb from "../components/Breadcrumb";

const petYears = petExam.years;

function PET() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">

          <Link
            to="/upsssc"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            UPSSSC
          </Link>

          <div className="font-bold">
            PrepDesk
          </div>

        </div>
      </header>

{/* Practice / PYQ Navigation */}
<div className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
  <div className="flex flex-wrap gap-3">
    <Link
      to="/upsssc/pet/practice"
      className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
    >
      Practice Set
    </Link>

    <Link
      to="/upsssc/pet"
      className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
    >
      PYQ
    </Link>
  </div>
</div>

      <div className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "UPSSSC", to: "/upsssc" }, { label: "PET" }]} />
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        {/* Title */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
            <FileText size={16} />
            UPSSSC PET
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">
            Previous Year Papers
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Select a year, examination date, shift or set to start your
            previous year question paper.
          </p>

        </div>

        {/* Exam Information */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <InfoCard
            icon={<FileText size={20} />}
            title="Questions"
            value="100 MCQs"
          />

          <InfoCard
            icon={<Clock3 size={20} />}
            title="Duration"
            value="2 Hours"
          />

          <InfoCard
            icon={<Minus size={20} />}
            title="Negative Marking"
            value="-0.25 / wrong"
          />

          <InfoCard
            icon={<Check size={20} />}
            title="Correct Answer"
            value="+1 mark"
          />

          <InfoCard
            icon={<CircleHelp size={20} />}
            title="Unanswered"
            value="0 marks"
          />

        </div>

        {/* Years */}
        <section className="mt-12">

          <div className="mb-6">
            <p className="text-sm font-semibold text-indigo-600">
              PYQ ARCHIVE
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Select Year
            </h2>
          </div>

          <div className="space-y-6">

            {petYears.map((item) => (
              <YearCard
                key={item.year}
                data={item}
              />
            ))}

          </div>

        </section>

      </main>
    </div>
  );
}

/* ================= YEAR CARD ================= */

function YearCard({ data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Year Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <CalendarDays size={20} />
          </div>

          <div>
            <h3 className="text-xl font-bold">
              {data.year}
            </h3>

            <p className="text-xs text-slate-500">
              UPSSSC PET
            </p>
          </div>

        </div>

      </div>

      {/* Date Structure */}
      {data.dates && (
        <div className="divide-y divide-slate-100">

          {data.dates.map((item) => (
            <div
              key={item.date}
              className="p-5"
            >

              <div className="mb-4 flex items-center gap-2">
                <CalendarDays
                  size={17}
                  className="text-indigo-600"
                />

                <span className="font-semibold">
                  {item.date}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">

                {item.sets.map((set) => (
                  <PaperButton
                    key={set}
                    label={set}
                    to={`/test/upsssc/pet/${data.year}/${item.date.replaceAll("/", "-")}/${set.toLowerCase().replaceAll(" ", "-")}`}
                  />
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

      {/* 2021 Shift Structure */}
      {data.shifts && (
        <div className="divide-y divide-slate-100">

          {data.shifts.map((shift) => (
            <div
              key={shift.name}
              className="p-5"
            >

              <div className="mb-4 flex items-center gap-2">

                <Clock3
                  size={17}
                  className="text-indigo-600"
                />

                <span className="font-semibold">
                  {shift.name}
                </span>

              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

                {shift.sets.map((set) => (
                  <PaperButton
                    key={set}
                    label={set}
                    to={`/test/upsssc/pet/${data.year}/${shift.name.toLowerCase().replaceAll(" ", "-")}/${set.toLowerCase().replaceAll(" ", "-")}`}
                  />
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

/* ================= PAPER BUTTON ================= */

function PaperButton({ label, to }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
      {label}
      <span className="ml-2 text-[10px] font-medium text-indigo-600">Start Test</span>
    </Link>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>

    </div>
  );
}

export default PET;