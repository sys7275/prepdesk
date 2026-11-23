import {
  BookOpen,
  Database,
  FileUp,
  LayoutDashboard,
  TrainFront,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Upload,
} from "lucide-react";

import { Link } from "react-router-dom";

function AdminDashboard() {
  const examGroups = [
    {
      id: "upessc",
      title: "UPESSC Teaching Exams",
      description: "UPTET, Super TET, UP TGT & UP PGT question papers & practice sets",
      icon: GraduationCap,
      exams: [
        {
          id: "uptet",
          name: "UPTET (Paper 1 & 2)",
          description: "150 Qs • 150 Marks • +1 / No Negative • 2h 30m",
          path: "/admin/upessc/uptet",
        },
        {
          id: "super-tet",
          name: "Super TET (2026)",
          description: "120 Qs • 360 Marks • +3 / -1 (1/3rd) • 2h",
          path: "/admin/upessc/super-tet",
        },
        {
          id: "tgt",
          name: "UP TGT (2026)",
          description: "120 Qs • 360 Marks • +3 / -1 (1/3rd) • 2h",
          path: "/admin/upessc/tgt",
        },
        {
          id: "pgt",
          name: "UP PGT (2026)",
          description: "120 Qs • 360 + 40 Interview • +3 / -1 • 2h",
          path: "/admin/upessc/pgt",
        },
      ],
    },

    {
      id: "upsssc",
      title: "UPSSSC",
      description: "UPSSSC previous year question papers",
      icon: GraduationCap,
      exams: [
        {
          id: "pet",
          name: "PET",
          description: "PET Previous Year Questions",
          path: "/admin/upsssc/pet",
        },
      ],
    },

    {
      id: "ssc",
      title: "SSC",
      description: "Staff Selection Commission examinations",
      icon: BookOpen,
      exams: [
        {
          id: "cgl",
          name: "CGL",
          description: "Combined Graduate Level",
          path: "/admin/ssc/cgl",
        },
        {
          id: "chsl",
          name: "CHSL",
          description: "Combined Higher Secondary Level",
          path: "/admin/ssc/chsl",
        },
      ],
    },

    {
      id: "railway",
      title: "Railway / RRB",
      description: "Railway Recruitment Board examinations",
      icon: TrainFront,
      exams: [
        {
          id: "group-d",
          name: "Group D",
          description: "RRB Group D",
          path: "/admin/railway/group-d",
        },
        {
          id: "ntpc",
          name: "NTPC",
          description: "RRB NTPC",
          path: "/admin/railway/ntpc",
        },
        {
          id: "alp",
          name: "ALP",
          description: "RRB Assistant Loco Pilot",
          path: "/admin/railway/alp",
        },
      ],
    },

    {
      id: "gate",
      title: "GATE",
      description: "Graduate Aptitude Test in Engineering",
      icon: Database,
      exams: [
        {
          id: "cse",
          name: "CSE",
          description: "GATE Computer Science & IT",
          path: "/admin/gate/cse",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                PrepDesk Admin
              </h1>

              <p className="text-xs text-slate-500">
                Question Management System
              </p>
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            Database Connected
          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Dashboard Heading */}
        <div className="mb-8">

          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <LayoutDashboard size={17} />
            Admin Dashboard
          </div>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Question Management
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Select an examination to manage question papers, years, dates,
            shifts, bilingual questions and bulk PDF uploads.
          </p>

        </div>

        {/* ================= STATS ================= */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Stat
            icon={<BookOpen size={19} />}
            label="Total Questions"
            value="0"
          />

          <Stat
            icon={<FileUp size={19} />}
            label="Total Papers"
            value="0"
          />

          <Stat
            icon={<Upload size={19} />}
            label="English Questions"
            value="0"
          />

          <Stat
            icon={<Upload size={19} />}
            label="Hindi Questions"
            value="0"
          />

        </div>

        {/* ================= EXAM GROUPS ================= */}
        <div className="grid gap-6 lg:grid-cols-2">

          {examGroups.map((group) => {
            const Icon = group.icon;

            return (
              <section
                key={group.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* Group Header */}
                <div className="flex items-start justify-between border-b border-slate-100 p-6">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {group.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {group.description}
                      </p>
                    </div>

                  </div>

                  <FileUp
                    size={20}
                    className="text-slate-300"
                  />

                </div>

                {/* Exams */}
                <div
                  className={`grid gap-3 p-5 ${
                    group.exams.length === 1
                      ? "grid-cols-1"
                      : "sm:grid-cols-2"
                  }`}
                >

                  {group.exams.map((exam) => (

                    <Link
                      key={exam.id}
                      to={exam.path}
                      className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
                    >

                      <div className="flex items-center justify-between">

                        <div>
                          <h4 className="font-semibold text-slate-800 group-hover:text-indigo-700">
                            {exam.name}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500">
                            {exam.description}
                          </p>
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          <ArrowRight size={17} />
                        </div>

                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600">
                        <Upload size={14} />
                        Manage questions & uploads
                      </div>

                    </Link>

                  ))}

                </div>

              </section>
            );
          })}

        </div>

        {/* ================= WORKFLOW INFO ================= */}
        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <FileUp size={20} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Question Upload Workflow
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Select the exam → select the exact paper → upload the
                English and Hindi question PDFs → review extracted questions
                → confirm upload.
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}


/* ================= STAT CARD ================= */

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <span className="text-xs font-medium text-slate-400">
          Admin
        </span>

      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

export default AdminDashboard;