import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  FileQuestion,
  Play,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  BarChart3,
  BookOpenCheck,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const exams = {
  "upessc/uptet": {
    title: "UPTET (Paper 1 & 2)",
    questions: 150,
    duration: "2 Ghante 30 Min",
    durationMinutes: 150,
    marks: 150,
    correct: "+1",
    correctMark: 1,
    wrong: "0 (No Negative)",
    wrongMark: 0,
    unanswered: "0",
  },
  "upessc/super-tet": {
    title: "Super TET (2026)",
    questions: 120,
    duration: "2 Ghante",
    durationMinutes: 120,
    marks: 360,
    correct: "+3",
    correctMark: 3,
    wrong: "-1 (1/3rd)",
    wrongMark: 1,
    unanswered: "0",
  },
  "upessc/tgt": {
    title: "UP TGT (2026)",
    questions: 120,
    duration: "2 Ghante",
    durationMinutes: 120,
    marks: 360,
    correct: "+3",
    correctMark: 3,
    wrong: "-1 (1/3rd)",
    wrongMark: 1,
    unanswered: "0",
  },
  "upessc/pgt": {
    title: "UP PGT (2026)",
    questions: 120,
    duration: "2 Ghante",
    durationMinutes: 120,
    marks: "360 + 40 (Interview)",
    correct: "+3",
    correctMark: 3,
    wrong: "-1 (1/3rd)",
    wrongMark: 1,
    unanswered: "0",
  },
  "upsssc/pet": {
    title: "UPSSSC PET",
    questions: 100,
    duration: "2 Hours",
    durationMinutes: 120,
    marks: 100,
    correct: "+1",
    correctMark: 1,
    wrong: "-0.25",
    wrongMark: 0.25,
    unanswered: "0",
  },
  "ssc/cgl": {
    title: "SSC CGL",
    questions: 100,
    duration: "1 Hour",
    durationMinutes: 60,
    marks: 200,
    correct: "+2",
    correctMark: 2,
    wrong: "-0.50",
    wrongMark: 0.5,
    unanswered: "0",
  },
  "ssc/chsl": {
    title: "SSC CHSL",
    questions: 100,
    duration: "1 Hour",
    durationMinutes: 60,
    marks: 200,
    correct: "+2",
    correctMark: 2,
    wrong: "-0.50",
    wrongMark: 0.5,
    unanswered: "0",
  },
  "ssc/gd": {
    title: "SSC GD",
    questions: 80,
    duration: "60 Minutes",
    durationMinutes: 60,
    marks: 160,
    correct: "+2",
    correctMark: 2,
    wrong: "-0.25",
    wrongMark: 0.25,
    unanswered: "0",
  },
  "railway/group-d": {
    title: "RRB Group D",
    questions: 100,
    duration: "90 Minutes",
    durationMinutes: 90,
    marks: 100,
    correct: "+1",
    correctMark: 1,
    wrong: "-1/3",
    wrongMark: 1 / 3,
    unanswered: "0",
  },
  "railway/ntpc": {
    title: "RRB NTPC",
    questions: 100,
    duration: "90 Minutes",
    durationMinutes: 90,
    marks: 100,
    correct: "+1",
    correctMark: 1,
    wrong: "-1/3",
    wrongMark: 1 / 3,
    unanswered: "0",
  },
  "railway/alp": {
    title: "RRB ALP",
    questions: 75,
    duration: "60 Minutes",
    durationMinutes: 60,
    marks: 75,
    correct: "+1",
    correctMark: 1,
    wrong: "-1/3",
    wrongMark: 1 / 3,
    unanswered: "0",
  },
};

const practiceSets = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  title: `Set ${index + 1}`,
}));

const optionLabels = ["A", "B", "C", "D", "E"];

// Extract key=number pairs from DI / chart text like "1997=48000, 1998=40000"
function extractChartSeries(text = "") {
  if (!text) return [];
  const matches = [...text.matchAll(/([A-Za-z0-9\u0900-\u097F\s./-]+?)\s*=\s*(\d+(?:\.\d+)?)/g)];
  if (matches.length < 2) return [];

  return matches.map((m) => ({
    label: m[1].replace(/^[,;()\[\]]+\s*/, "").trim(),
    value: Number(m[2]),
  }));
}

function VisualQuestionMedia({ question, text }) {
  const series = extractChartSeries(text);
  const hasImage = Boolean(question?.imageUrl && question.imageUrl.trim());

  if (!hasImage && series.length === 0) return null;

  const maxValue = series.length > 0 ? Math.max(...series.map((d) => d.value), 1) : 1;

  return (
    <div className="mt-5 space-y-4 rounded-2xl border border-indigo-100 bg-slate-50 p-4">
      {hasImage && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
          <img
            src={question.imageUrl}
            alt="Question Visual / Graph"
            className="mx-auto max-h-80 w-auto rounded-lg object-contain"
          />
        </div>
      )}

      {series.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
              <BarChart3 size={16} />
              Data Interpretation Chart View
            </div>
            <span className="text-xs text-slate-500">
              {series.length} Data Points
            </span>
          </div>

          {/* Bar Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex h-52 items-end justify-around gap-3 border-b border-slate-200 pb-2 pt-6 overflow-x-auto">
              {series.map((item, idx) => {
                const heightPercent = Math.max(6, Math.round((item.value / maxValue) * 100));
                return (
                  <div
                    key={`${item.label}-${idx}`}
                    className="flex min-w-[54px] flex-1 flex-col items-center justify-end h-full"
                  >
                    <span className="mb-1 text-[11px] font-bold text-slate-700">
                      {item.value.toLocaleString("en-IN")}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-8 sm:w-10 rounded-t-md bg-indigo-600 transition-all duration-300"
                      title={`${item.label}: ${item.value}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis Labels */}
            <div className="mt-2 flex justify-around gap-3 overflow-x-auto">
              {series.map((item, idx) => (
                <div
                  key={`lbl-${item.label}-${idx}`}
                  className="min-w-[54px] flex-1 text-center text-[11px] font-semibold text-slate-600 break-words"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reference Data Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {series.map((item, idx) => (
              <span
                key={`chip-${idx}`}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                <strong className="text-indigo-700">{item.label}:</strong>{" "}
                {item.value.toLocaleString("en-IN")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PracticeExam({ defaultCategory, defaultExam }) {
  const params = useParams();
  const category = params.category || defaultCategory;
  const exam = params.exam || defaultExam;
  const set = params.set;
  const navigate = useNavigate();

  const data = exams[`${category}/${exam}`];

  const [started, setStarted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setStarted(false);
    setSubmitted(false);
    setQuestions([]);
    setAnswers({});
    setCurrentIndex(0);
    setFetchError("");
  }, [category, exam, set]);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  const handleStartPractice = async () => {
    try {
      setFetchError("");
      setLoadingQuestions(true);

      const query = new URLSearchParams({
        examCategory: category,
        examName: data.title,
        type: "practice",
        practiceSet: String(set),
      });

      const response = await fetch(`${API_BASE}/api/questions?${query.toString()}`);
      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to load practice questions.");
      }

      if (!Array.isArray(resData.questions) || resData.questions.length === 0) {
        throw new Error(
          `Set ${set} ke questions abhi database mein upload nahi hue hain.`
        );
      }

      setQuestions(resData.questions);
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft((data.durationMinutes || 120) * 60);
      setSubmitted(false);
      setStarted(true);
    } catch (err) {
      console.error("START PRACTICE ERROR:", err);
      setFetchError(err.message || "Questions load karne mein error aaya.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Exam not found</h1>
      </div>
    );
  }

  // 1. SET SELECTION PAGE
  if (!set) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(`/practice/${category}`)}
            className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="mb-10">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Self Practice
            </span>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">{data.title}</h1>
            <p className="mt-3 text-slate-600">Select a practice set to continue.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practiceSets.map((practiceSet) => (
              <button
                key={practiceSet.id}
                onClick={() =>
                  navigate(`/practice/${category}/${exam}/${practiceSet.id}`)
                }
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div>
                  <div className="text-sm font-medium text-slate-500">Practice Set</div>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {practiceSet.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {data.questions} Questions
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. RESULT & REVIEW VIEW
  if (started && submitted) {
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected === undefined) {
        unattemptedCount++;
      } else if (Number(selected) === Number(q.correctAnswer)) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const totalScore =
      correctCount * data.correctMark - wrongCount * data.wrongMark;

    const maxScoreLabel =
      typeof data.marks === "number"
        ? `${data.marks}`
        : `${questions.length * data.correctMark}`;

    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">
              {data.title} — Practice Set {set} Result
            </h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Info
                label="Total Score"
                value={`${totalScore.toFixed(2)} / ${maxScoreLabel}`}
              />
              <Info label="Correct" value={correctCount} />
              <Info label="Wrong" value={wrongCount} />
              <Info label="Unanswered" value={unattemptedCount} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleStartPractice}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                <RotateCcw size={16} />
                Re-attempt Set {set}
              </button>

              <button
                onClick={() => navigate(`/practice/${category}/${exam}`)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to All Sets
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              Question-wise Answer & Solution Review
            </h2>

            {questions.map((q, idx) => {
              const qText = q.question?.hi || q.question?.en || "";
              const opts =
                q.options?.hi?.length > 0 ? q.options.hi : q.options?.en || [];
              const explanationText =
                q.explanation?.hi || q.explanation?.en || "";
              const userAns = answers[idx];
              const isCorrect =
                userAns !== undefined &&
                Number(userAns) === Number(q.correctAnswer);

              return (
                <div
                  key={q._id || idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-semibold text-slate-900">
                      Q{q.questionNumber || idx + 1}. {qText}
                    </p>
                    {userAns === undefined ? (
                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        <CheckCircle2 size={14} /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        <XCircle size={14} /> Wrong
                      </span>
                    )}
                  </div>

                  <VisualQuestionMedia question={q} text={qText} />

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {opts.map((optText, optIdx) => {
                      const isRightOption = Number(q.correctAnswer) === optIdx;
                      const isUserChoice = Number(userAns) === optIdx;

                      let style = "border-slate-200 bg-slate-50 text-slate-700";
                      if (isRightOption) {
                        style =
                          "border-green-400 bg-green-50 font-semibold text-green-800";
                      } else if (isUserChoice && !isRightOption) {
                        style =
                          "border-red-400 bg-red-50 font-semibold text-red-800";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`rounded-xl border px-4 py-2.5 text-sm ${style}`}
                        >
                          <span className="mr-2 font-bold">
                            {optionLabels[optIdx]})
                          </span>
                          {optText}
                        </div>
                      );
                    })}
                  </div>

                  {explanationText && (
                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-slate-800">
                      <div className="mb-1 flex items-center gap-1.5 font-bold text-indigo-800">
                        <BookOpenCheck size={16} />
                        Solution / Explanation
                      </div>
                      <p className="whitespace-pre-line leading-relaxed">
                        {explanationText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. LIVE PRACTICE TEST VIEW
  if (started && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const qText = currentQ.question?.hi || currentQ.question?.en || "";
    const opts =
      currentQ.options?.hi?.length > 0
        ? currentQ.options.hi
        : currentQ.options?.en || [];
    const selectedOption = answers[currentIndex];

    return (
      <div className="min-h-screen bg-slate-100 pb-12">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {data.title} — Practice Set {set}
              </h1>
              <p className="text-xs text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 font-mono text-sm font-bold text-blue-700">
                <Clock size={16} />
                {formatTime(timeLeft)}
              </div>

              <button
                onClick={() => setSubmitted(true)}
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
              >
                Submit Test
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto mt-6 grid max-w-7xl gap-6 px-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Question {currentQ.questionNumber || currentIndex + 1}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Marks: {data.correct} | Negative: {data.wrong}
              </span>
            </div>

            <p className="whitespace-pre-line text-lg font-semibold leading-relaxed text-slate-900">
              {qText}
            </p>

            {/* Live Graph / Chart / Image during test */}
            <VisualQuestionMedia question={currentQ} text={qText} />

            <div className="mt-6 space-y-3">
              {opts.map((optText, optIdx) => {
                const isSelected = selectedOption === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentIndex]: optIdx,
                      }))
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 font-semibold text-blue-900"
                        : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {optionLabels[optIdx]}
                    </span>
                    <span>{optText}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              {selectedOption !== undefined && (
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => {
                      const updated = { ...prev };
                      delete updated[currentIndex];
                      return updated;
                    })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Clear Response
                </button>
              )}

              <button
                type="button"
                disabled={currentIndex === questions.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40"
              >
                Save & Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">
              Question Palette ({Object.keys(answers).length}/{questions.length}{" "}
              Answered)
            </h3>

            <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
              {questions.map((q, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q._id || idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition ${
                      isCurrent ? "ring-2 ring-blue-600 ring-offset-1" : ""
                    } ${
                      isAnswered
                        ? "bg-green-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {q.questionNumber || idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. SELECTED SET SUMMARY PAGE
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate(`/practice/${category}/${exam}`)}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Sets
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Self Practice
            </span>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">{data.title}</h1>
            <p className="mt-2 text-xl font-semibold text-slate-700">
              Practice Set {set}
            </p>
            <p className="mt-3 text-slate-600">Hindi Practice Set</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info
              icon={<FileQuestion size={20} />}
              label="Questions"
              value={data.questions}
            />
            <Info icon={<Clock size={20} />} label="Duration" value={data.duration} />
            <Info label="Marks" value={data.marks} />
            <Info label="Correct Answer" value={data.correct} />
            <Info label="Wrong Answer" value={data.wrong} />
            <Info label="Unanswered" value={data.unanswered} />
          </div>

          {fetchError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {fetchError}
            </div>
          )}

          <button
            onClick={handleStartPractice}
            disabled={loadingQuestions}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loadingQuestions ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Loading Questions...
              </>
            ) : (
              <>
                <Play size={20} />
                Start Practice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default PracticeExam;