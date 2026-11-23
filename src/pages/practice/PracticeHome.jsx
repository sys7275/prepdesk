import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  GraduationCap,
  TrainFront,
  Trophy,
} from "lucide-react";

const practiceCategories = [
  {
    id: "upessc",
    title: "UPESSC",
    description: "Practice sets for UPTET, Super TET, UP TGT & UP PGT",
    icon: GraduationCap,
    path: "/practice/upessc",
    badge: "Teaching Exams",
  },
  {
    id: "upsssc",
    title: "UPSSSC",
    description: "Practice sets for UPSSSC examinations",
    icon: GraduationCap,
    path: "/practice/upsssc",
    badge: "PET Ready",
  },
  {
    id: "ssc",
    title: "SSC",
    description: "Practice sets for SSC examinations",
    icon: Trophy,
    path: "/practice/ssc",
    badge: "CGL & CHSL",
  },
  {
    id: "railway",
    title: "Railway",
    description: "Practice sets for Railway examinations",
    icon: TrainFront,
    path: "/practice/railway",
    badge: "RRB Sets",
  },
];

function PracticeHome() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <BookOpen size={14} />
            Self Practice
          </span>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Practice Set
          </h1>
          <p className="mt-2 text-slate-600">
            Choose an examination and start practicing with topic-wise and exam-oriented questions.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {practiceCategories.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                  <span>Explore</span>
                  <ChevronRight
                    size={16}
                    className="transition group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PracticeHome;