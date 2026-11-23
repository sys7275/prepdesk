import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  LogOut,
  Play,
  TrainFront,
  Trophy,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const exams = [
  {
    title: "UPESSC Teaching Exams",
    subtitle: "UPTET (Paper 1 & 2), Super TET (2026), UP TGT & UP PGT",
    description:
      "Practice UPTET, Super TET, UP TGT, and UP PGT previous year papers and practice sets with exact exam marking rules.",
    icon: GraduationCap,
    path: "/upessc",
    practicePath: "/practice/upessc/uptet",
    badge: "Teaching Exams",
  },
  {
    title: "UPSSSC",
    subtitle: "PET & Other Exams",
    description:
      "Practice previous year papers and full 100-question practice sets with real exam timing.",
    icon: GraduationCap,
    path: "/upsssc",
    practicePath: "/practice/upsssc/pet",
    badge: "PET Ready",
  },
  {
    title: "SSC",
    subtitle: "CGL & CHSL",
    description:
      "Attempt SSC previous year papers in a structured computer-based test environment.",
    icon: Trophy,
    path: "/ssc",
    practicePath: "/practice/ssc",
    badge: "Tier & Shift PYQs",
  },
  {
    title: "Railway / RRB",
    subtitle: "Group D, NTPC & ALP",
    description:
      "Practice RRB previous year questions with shift-wise sets and accurate scoring.",
    icon: TrainFront,
    path: "/railway",
    practicePath: "/practice/railway",
    badge: "CBT Format",
  },
  {
    title: "GATE",
    subtitle: "CSE & More",
    description:
      "Prepare with GATE question papers and sharpen accuracy under timed practice.",
    icon: BookOpen,
    path: "/gate",
    practicePath: "/practice",
    badge: "Subject & Paper",
  },
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem("prepdesk_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function Home() {
  const [user, setUser] = useState(getStoredUser);

  const handleLogout = () => {
    localStorage.removeItem("prepdesk_token");
    localStorage.removeItem("prepdesk_user");
    setUser(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f6f8fc] text-slate-900">
      {/* Up-Down Ball & Entrance Keyframes */}
      <style>{`
        @keyframes ballUpDownSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -34px, 0);
          }
        }
        @keyframes ballUpDownMid {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 28px, 0);
          }
        }
        @keyframes prepFadeUp {
          from {
            opacity: 0;
            transform: translate3d(0, 14px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .bg-ball-1 {
          animation: ballUpDownSlow 5.5s ease-in-out infinite;
        }
        .bg-ball-2 {
          animation: ballUpDownMid 6.8s ease-in-out infinite;
        }
        .bg-ball-3 {
          animation: ballUpDownSlow 7.6s ease-in-out 1s infinite;
        }
        .bg-ball-4 {
          animation: ballUpDownMid 6.2s ease-in-out 0.6s infinite;
        }
        .prep-fade-up {
          animation: prepFadeUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .prep-fade-up-delay {
          animation: prepFadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-ball-1,
          .bg-ball-2,
          .bg-ball-3,
          .bg-ball-4,
          .prep-fade-up,
          .prep-fade-up-delay {
            animation: none !important;
          }
        }
      `}</style>

      {/* Animated Background Layer with Up-Down Moving Balls */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Subtle Dot Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-20"
        >
          <source src="/bg-balls.mp4" type="video/mp4" />
        </video>

        {/* Up-Down Moving Balls */}
        <div className="bg-ball-1 absolute left-[8%] top-24 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/35 to-indigo-600/20 blur-[1px]" />
        <div className="bg-ball-2 absolute right-[10%] top-28 h-32 w-32 rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-400/20 blur-[1px]" />
        <div className="bg-ball-3 absolute bottom-28 left-[18%] h-20 w-20 rounded-full bg-gradient-to-br from-violet-400/30 to-sky-400/20 blur-[1px]" />
        <div className="bg-ball-4 absolute bottom-20 right-[18%] h-28 w-28 rounded-full bg-gradient-to-br from-indigo-300/35 to-cyan-300/25 blur-[1px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition duration-200 group-hover:scale-105 group-hover:bg-indigo-700">
              <BookOpen size={20} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-950">
                PrepDesk
              </h1>
              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Competitive Exam Preparation
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <Link to="/" className="font-semibold text-indigo-600 transition">
              Home
            </Link>

            <a
              href="#exams"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              Exams
            </a>

            <Link
              to="/practice"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              Practice Sets
            </Link>

            <a
              href="#pyq"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              PYQ
            </a>

            <a
              href="#about"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              About
            </a>
          </nav>

          {/* Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/90 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                <UserCheck size={16} />
                <span className="max-w-[120px] truncate sm:max-w-none">
                  {user.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main className="relative z-10">
        <section className="relative border-b border-slate-200/70">
          <div className="mx-auto max-w-7xl px-5 pb-16 pt-12 lg:px-8 lg:pb-20 lg:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              {/* Left Hero Copy */}
              <div className="prep-fade-up lg:col-span-7">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs sm:text-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                  Previous Year Questions • Practice Sets • CBT Mode
                </div>

                <h2 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Prepare with{" "}
                  <span className="text-indigo-600">real PYQs.</span>
                  <br />
                  Practice like the real exam.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Practice previous year papers and full-length mock sets for
                  competitive exams in a clean, timed computer-based test
                  interface with instant score & solution review.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("exams")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/80 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    Explore Exams
                    <ChevronRight size={18} />
                  </button>

                  <Link
                    to="/practice"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/90 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/50"
                  >
                    <Play size={16} className="text-indigo-600" />
                    Start Practice Sets
                  </Link>
                </div>

                {/* Statistics */}
                <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat value="5+" label="Exam Categories" />
                  <Stat value="15+" label="Practice Sets" />
                  <Stat value="2016+" label="PYQ Coverage" />
                  <Stat value="CBT" label="Timed Test Mode" />
                </div>
              </div>

              {/* Right Quick Launch Card */}
              <div className="prep-fade-up-delay lg:col-span-5">
                <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-xs transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Quick Practice
                      </span>
                      <h3 className="mt-1 text-xl font-bold text-slate-950">
                        UPSSSC PET — Practice Sets
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-50/90 p-3">
                      <p className="text-lg font-bold text-slate-900">100</p>
                      <p className="text-[11px] text-slate-500">Questions</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/90 p-3">
                      <p className="text-lg font-bold text-slate-900">2 Hrs</p>
                      <p className="text-[11px] text-slate-500">Duration</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/90 p-3">
                      <p className="text-lg font-bold text-slate-900">-0.25</p>
                      <p className="text-[11px] text-slate-500">Negative</p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-indigo-600"
                      />
                      <span>A–E options, comprehension & DI chart support</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Clock size={16} className="shrink-0 text-indigo-600" />
                      <span>Interactive question palette & countdown timer</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-indigo-600"
                      />
                      <span>Instant scorecard & question-wise review</span>
                    </li>
                  </ul>

                  <Link
                    to="/practice/upsssc/pet/1"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-indigo-600"
                  >
                    <Play size={16} />
                    <span>Launch Practice Set 1</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= EXAM CATEGORIES ================= */}
        <section id="exams" className="bg-white/75 backdrop-blur-2xs">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Exam Categories
                </p>
                <h3 className="mt-1.5 text-3xl font-bold tracking-tight text-slate-950">
                  Choose your exam
                </h3>
                <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
                  Open any exam category to attempt previous year papers or jump
                  straight into practice sets.
                </p>
              </div>

              <Link
                to="/practice"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <span>All Practice Sets</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <ExamCard key={exam.title} exam={exam} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= PYQ SECTION ================= */}
        <section id="pyq" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-7 shadow-sm backdrop-blur-xs sm:p-10">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  PYQ & Practice Architecture
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Built for real exam structure and speed
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  Every examination follows its own paper hierarchy—year, tier,
                  date, shift, or set—along with exam-specific marking rules.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <Feature
                  title="Exam-wise Structure"
                  text="Separate paper flow and set organization tailored for each exam."
                />
                <Feature
                  title="Real Countdown Timer"
                  text="Practice under realistic exam duration with live question tracking."
                />
                <Feature
                  title="Accurate Scoring"
                  text="Automatic positive and negative marking with detailed answer review."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer
          id="about"
          className="border-t border-slate-200 bg-white/90 backdrop-blur-xs"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>© 2026 PrepDesk. Competitive exam preparation platform.</p>
            <p className="font-medium text-slate-600">
              PYQ • Practice • Perform
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ================= STAT COMPONENT ================= */

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3.5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200">
      <p className="text-xl font-extrabold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

/* ================= EXAM CARD ================= */

function ExamCard({ exam }) {
  const Icon = exam.icon;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-2xs transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition duration-200 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white">
            <Icon size={21} />
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {exam.badge}
          </span>
        </div>

        <h4 className="mt-5 text-lg font-bold text-slate-950">{exam.title}</h4>
        <p className="mt-0.5 text-sm font-semibold text-indigo-600">
          {exam.subtitle}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {exam.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold">
        <Link
          to={exam.path}
          className="inline-flex items-center gap-1 text-slate-800 transition hover:text-indigo-600"
        >
          <span>PYQ Papers</span>
          <ChevronRight
            size={16}
            className="transition duration-200 group-hover:translate-x-0.5"
          />
        </Link>

        <Link
          to={exam.practicePath}
          className="text-xs font-bold text-indigo-600 transition hover:underline"
        >
          Practice →
        </Link>
      </div>
    </div>
  );
}

/* ================= FEATURE ================= */

function Feature({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-5 transition duration-200 hover:border-indigo-100 hover:bg-indigo-50/30">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

export default Home;