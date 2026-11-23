import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  FileText,
} from "lucide-react";

function UPSSSC() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap size={20} />
            </div>

            <span className="font-bold">PrepDesk</span>
          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">

        {/* Heading */}
        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            <GraduationCap size={16} />
            UPSSSC
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            UPSSSC Previous Year Papers
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Choose an examination to practice previous year question papers
            in a computer-based test environment.
          </p>

        </div>

        {/* Exam */}
        <section className="mt-12">

          <p className="text-sm font-semibold text-indigo-600">
            AVAILABLE EXAMS
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Select Examination
          </h2>

          <div className="mt-6 max-w-2xl">

            <Link
              to="/upsssc/pet"
              className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText size={23} />
                </div>

                <ChevronRight
                  size={22}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />

              </div>

              <h3 className="mt-6 text-2xl font-bold">
                UPSSSC PET
              </h3>

              <p className="mt-2 text-sm font-medium text-indigo-600">
                Preliminary Eligibility Test
              </p>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Practice PET previous year papers with year-wise,
                date-wise and set-wise selection.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                <div className="flex gap-2 text-xs font-medium text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1.5">
                    2021–2025
                  </span>

                  <span className="rounded-md bg-slate-100 px-2.5 py-1.5">
                    MCQ
                  </span>
                </div>

                <span className="text-sm font-semibold text-indigo-600">
                  View Papers →
                </span>

              </div>

            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

export default UPSSSC;