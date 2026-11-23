import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Target,
  ArrowLeft,
  RotateCcw,
  Trophy,
  BarChart3,
  Sparkles,
  Loader2,
  AlertTriangle,
  ListChecks,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

function ResultPage() {
  const { "*": wildcard = "" } = useParams();

  const saved = sessionStorage.getItem(`prepdesk-result-${wildcard}`);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiReport, setAiReport] = useState(null);
  const [aiMeta, setAiMeta] = useState({ cached: false, fallback: false });

  const parsedResult = saved ? JSON.parse(saved) : null;

  useEffect(() => {
    if (!parsedResult) return;

    let cancelled = false;

    const runAnalysis = async () => {
      try {
        setAiLoading(true);
        setAiError("");

        const totalQuestions = parsedResult.questions?.length || 0;
        const questionBreakdown = Array.isArray(parsedResult.questions)
          ? parsedResult.questions.map((q, idx) => {
              const userAns = parsedResult.answers?.[idx];
              const correctAns = q?.correctAnswer;
              const isAttempted = userAns !== undefined && userAns !== null;
              const isCorrect = isAttempted && Number(userAns) === Number(correctAns);
              return {
                questionNumber: q?.questionNumber || idx + 1,
                subject: q?.subject || parsedResult.examTitle || "General",
                status: !isAttempted ? "unattempted" : isCorrect ? "correct" : "wrong",
              };
            })
          : [];

        const response = await fetch(`${API_BASE}/api/ai/analyze-attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: parsedResult.category || "",
            exam: parsedResult.examTitle || parsedResult.exam || "",
            correct: parsedResult.correct || 0,
            wrong: parsedResult.wrong || 0,
            unattempted: parsedResult.unattempted || 0,
            totalQuestions,
            questionBreakdown,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to generate AI performance report.");
        }

        if (!cancelled) {
          setAiReport(data.analysis || null);
          setAiMeta({
            cached: Boolean(data.cached),
            fallback: Boolean(data.fallback),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setAiError(err.message || "Unable to load AI analysis right now.");
        }
      } finally {
        if (!cancelled) {
          setAiLoading(false);
        }
      }
    };

    runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [saved]);

  if (!parsedResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle size={34} className="text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Result not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please attempt the test first to view your result.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const result = parsedResult;
  const totalQuestions = result.questions?.length || 0;

  const attemptedPercentage =
    totalQuestions > 0 ? (result.attempted / totalQuestions) * 100 : 0;

  const scorePercentage =
    result.maximumMarks > 0 ? (result.score / result.maximumMarks) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-6xl">
        {/* TOP HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            PrepDesk
          </Link>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            Test Result
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* HERO */}
          <div className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-5 py-8 text-center sm:px-8 sm:py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 ring-8 ring-green-50/60">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
              Test Completed
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {result.examTitle}
            </h1>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                {result.year || "Practice"}
              </span>

              <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                {totalQuestions} Questions
              </span>
            </div>
          </div>

          {/* SCORE SECTION */}
          <div className="px-5 py-7 sm:px-8 sm:py-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* SCORE CARD */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Trophy size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-indigo-700">
                      Your Score
                    </p>
                    <p className="text-xs text-slate-500">
                      Final examination score
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex items-end gap-3">
                  <span className="text-5xl font-black tracking-tight text-indigo-700 sm:text-6xl">
                    {Number(result.score || 0).toFixed(2)}
                  </span>

                  <span className="mb-2 text-sm font-semibold text-slate-500">
                    / {result.maximumMarks || 0}
                  </span>
                </div>

                {/* SCORE PROGRESS */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Score percentage</span>

                    <span className="text-indigo-700">
                      {scorePercentage.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${Math.min(Math.max(scorePercentage, 0), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* PERFORMANCE CARD */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <BarChart3 size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Performance
                    </p>
                    <p className="text-xs text-slate-500">Attempt summary</p>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">
                      Attempted
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {result.attempted} / {totalQuestions}
                    </span>
                  </div>

                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${Math.min(Math.max(attemptedPercentage, 0), 100)}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {attemptedPercentage.toFixed(1)}% of questions attempted
                  </p>
                </div>
              </div>
            </div>

            {/* STAT CARDS */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                icon={<CheckCircle2 size={21} className="text-green-600" />}
                label="Correct"
                value={result.correct}
                bg="bg-green-50"
              />

              <Stat
                icon={<XCircle size={21} className="text-red-600" />}
                label="Wrong"
                value={result.wrong}
                bg="bg-red-50"
              />

              <Stat
                icon={<MinusCircle size={21} className="text-slate-500" />}
                label="Unattempted"
                value={result.unattempted}
                bg="bg-slate-100"
              />

              <Stat
                icon={<Target size={21} className="text-indigo-600" />}
                label="Percentage"
                value={`${Number(result.percentage || 0).toFixed(2)}%`}
                bg="bg-indigo-50"
              />
            </div>

            {/* MARKS SUMMARY */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Result Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Overview of your test performance
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryItem
                  label="Attempted"
                  value={`${result.attempted} / ${totalQuestions}`}
                />

                <SummaryItem label="Correct Answers" value={result.correct} />

                <SummaryItem label="Wrong Answers" value={result.wrong} />
              </div>
            </div>

            {/* AI DIAGNOSTIC & STUDY PLAN */}
            <section className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      AI Performance Coach & 48-Hour Plan
                    </h2>
                    <p className="text-xs text-slate-500">
                      Diagnostic insights based on accuracy, negative marking & question outcomes
                    </p>
                  </div>
                </div>

                {aiReport?.readinessLevel && (
                  <span className="rounded-full bg-indigo-100 px-3.5 py-1 text-xs font-bold text-indigo-800">
                    {aiReport.readinessLevel}
                    {aiMeta.cached ? " • Cached" : ""}
                  </span>
                )}
              </div>

              {aiLoading && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-indigo-100 bg-white p-4 text-sm text-slate-600">
                  <Loader2 size={18} className="animate-spin text-indigo-600" />
                  Analyzing your attempt and generating study recommendations...
                </div>
              )}

              {!aiLoading && aiError && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
                  <AlertTriangle size={18} className="shrink-0" />
                  {aiError}
                </div>
              )}

              {!aiLoading && aiReport && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm leading-6 text-slate-700">
                      {aiReport.summary}
                    </p>
                    {aiReport.accuracyAdvice && (
                      <p className="mt-2 text-xs font-semibold text-indigo-700">
                        Tip: {aiReport.accuracyAdvice}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-red-100 bg-white p-4">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-red-600">
                        Areas to Improve
                      </p>
                      <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                        {(aiReport.weakTopics || []).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-green-100 bg-white p-4">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-green-700">
                        Strong Areas
                      </p>
                      <ul className="mt-2.5 space-y-1.5 text-sm text-slate-700">
                        {(aiReport.strongTopics || []).map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {Array.isArray(aiReport.next48HourPlan) &&
                    aiReport.next48HourPlan.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                          <ListChecks size={16} />
                          Next 48-Hour Action Plan
                        </div>
                        <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
                          {aiReport.next48HourPlan.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                </div>
              )}
            </section>

            {/* ACTION BUTTONS */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft size={17} />
                Back to Home
              </Link>

              <Link
                to={`/test/${result.wildcard}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <RotateCcw size={17} />
                Retake Test
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="py-6 text-center text-xs text-slate-400">
          PrepDesk • Competitive Exam Preparation Platform
        </p>
      </main>
    </div>
  );
}

function Stat({ icon, label, value, bg = "bg-slate-50" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
      >
        {icon}
      </div>

      <p className="text-2xl font-black text-slate-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default ResultPage;