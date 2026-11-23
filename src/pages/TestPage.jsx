import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock3,
  FileQuestion,
  Minus,
  ChevronLeft,
  ChevronRight,
  Languages,
  RotateCcw,
  Flag,
} from "lucide-react";

import Breadcrumb from "../components/Breadcrumb";
import Header from "../components/Header";


function TestPage() {
  const { "*": wildcard = "" } = useParams();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
const [loadingQuestions, setLoadingQuestions] = useState(true);
const [questionError, setQuestionError] = useState("");

const [questionsLoading, setQuestionsLoading] = useState(true);
const [questionsError, setQuestionsError] = useState("");
  // Language
  const [language, setLanguage] = useState("en");

  // Current question
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // All answers
  const [answers, setAnswers] = useState({});

  // Mark for review
  const [markedQuestions, setMarkedQuestions] = useState([]);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);

  const [category, exam, year, ...paperParts] = wildcard.split("/");

  const isGate = category === "gate";

  const paper = paperParts.at(-1) || "paper";

  const session = isGate
    ? null
    : paperParts.length > 1
      ? paperParts[0]
      : null;

  const shift = !isGate
    ? session?.startsWith("shift-")
      ? session
      : paper.startsWith("shift-")
        ? paper
        : null
    : null;

  const set = isGate
    ? paper
    : session?.startsWith("shift-")
      ? paperParts[1]
      : paper;

  const examTitle = getExamTitle(category, exam);
  const dateLabel = getDateLabel(category, session);

  const setLabel = shift
    ? session?.startsWith("shift-")
      ? `${formatLabel(shift)} · ${formatLabel(set)}`
      : formatLabel(shift)
    : formatLabel(set);

  const details = getExamDetails(category, exam);

 const question = questions[currentQuestion];

const totalQuestions = questions.length;

  // Current selected answer
  const selectedAnswer =
    answers[currentQuestion] ?? null;

  const storageKey =
    `prepdesk-timer-${wildcard}`;

    /*
|--------------------------------------------------------------------------
| LOAD QUESTIONS FROM MONGODB
|--------------------------------------------------------------------------
*/

useEffect(() => {
  const loadQuestions = async () => {
    try {
      setQuestionsLoading(true);
      setQuestionsError("");

      const params = new URLSearchParams();

      if (category) {
        params.set("examCategory", category);
      }

      if (examTitle) {
        params.set("examName", examTitle);
      }

      if (year) {
        params.set("year", year);
      }

      if (dateLabel) {
        params.set("date", dateLabel);
      }

   if (shift) {
  params.set("shift", shift);
}

if (set) {
  params.set("set", formatLabel(set));
}
      const response = await fetch(
        `http://127.0.0.1:5000/api/questions?${params.toString()}`
      );



      const data = await response.json();

      console.log(
        "QUESTIONS API RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load questions."
        );
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error(
          "No questions found for this paper."
        );
      }

      setQuestions(data.questions);

    } catch (error) {
      console.error(
        "LOAD QUESTIONS ERROR:",
        error
      );

      setQuestionsError(
        error.message ||
          "Failed to load questions."
      );

    } finally {
      setQuestionsLoading(false);
    }
  };

  loadQuestions();
}, [
  category,
  examTitle,
  year,
  dateLabel,
  shift,
  set,
]);
  /*
  |--------------------------------------------------------------------------
  | LOAD SAVED TIMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const saved =
      localStorage.getItem(storageKey);

    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (data.started && data.endTime) {
          const remaining = Math.max(
            0,
            Math.floor(
              (data.endTime - Date.now()) / 1000
            )
          );

          if (remaining > 0) {
            setStarted(true);
            setTimeLeft(remaining);
          } else {
            localStorage.removeItem(
              storageKey
            );
          }
        }
      } catch {
        localStorage.removeItem(
          storageKey
        );
      }
    }
  }, [storageKey]);

  /*
  |--------------------------------------------------------------------------
  | COUNTDOWN TIMER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(interval);

          localStorage.removeItem(
            storageKey
          );

          setStarted(false);

          alert(
            "Time is over! The test has been submitted."
          );

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [started, storageKey]);

  /*
  |--------------------------------------------------------------------------
  | START TEST
  |--------------------------------------------------------------------------
  */

  const startTest = () => {
    const durationSeconds =
      details.durationSeconds;

    const endTime =
      Date.now() +
      durationSeconds * 1000;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        started: true,
        endTime,
      })
    );

    setTimeLeft(durationSeconds);
    setStarted(true);
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT ANSWER
  |--------------------------------------------------------------------------
  */

  const selectAnswer = (index) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: index,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | NEXT QUESTION
  |--------------------------------------------------------------------------
  */

  const nextQuestion = () => {
    if (
      currentQuestion <
      totalQuestions - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS QUESTION
  |--------------------------------------------------------------------------
  */

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR ANSWER
  |--------------------------------------------------------------------------
  */

  const clearAnswer = () => {
    setAnswers((previous) => {
      const updated = {
        ...previous,
      };

      delete updated[currentQuestion];

      return updated;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | MARK / UNMARK REVIEW
  |--------------------------------------------------------------------------
  */

  const toggleMarkForReview = () => {
    setMarkedQuestions((previous) => {
      if (
        previous.includes(currentQuestion)
      ) {
        return previous.filter(
          (index) =>
            index !== currentQuestion
        );
      }

      return [
        ...previous,
        currentQuestion,
      ];
    });
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT TEST
  |--------------------------------------------------------------------------
  */

  const submitTest = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    questions.forEach(
  (question, index) => {
        const answer = answers[index];

        if (answer === undefined) {
          unattempted++;
        } else if (
          answer === question.correctAnswer
        ) {
          correct++;
        } else {
          wrong++;
        }
      }
    );

    const attempted =
      correct + wrong;

    /*
     * Negative marking
     */

    let negativeMarks = 0;

    if (category === "ssc") {
      negativeMarks =
        wrong * 0.5;
    } else if (
      category === "upsssc"
    ) {
      negativeMarks =
        wrong * 0.25;
    } else if (
      category === "railway"
    ) {
      negativeMarks =
        wrong / 3;
    }

    /*
     * Marks per correct answer
     */

    let marksPerQuestion = 1;

    if (category === "ssc") {
      marksPerQuestion = 2;
    }

    const score =
      correct * marksPerQuestion -
      negativeMarks;

    const maximumMarks =
      Number(details.marks) || 0;

    const percentage =
      maximumMarks > 0
        ? (score / maximumMarks) * 100
        : 0;

    /*
     * Result object
     */

    const result = {
      wildcard,
      category,
      exam,
      year,

      examTitle,

      correct,
      wrong,
      unattempted,
      attempted,

      score,
      maximumMarks,
      percentage,

      answers,
      markedQuestions,

questions,    };

    /*
     * Save result
     */

    sessionStorage.setItem(
      `prepdesk-result-${wildcard}`,
      JSON.stringify(result)
    );

    /*
     * Remove running timer
     */

    localStorage.removeItem(
      storageKey
    );

    setStarted(false);

    /*
     * Go to result
     */

    navigate(
      `/result/${wildcard}`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SUBMIT CONFIRMATION
  |--------------------------------------------------------------------------
  */

  const handleSubmit = () => {
    const attempted =
      Object.keys(answers).length;

    const unattempted =
      totalQuestions - attempted;

    const marked =
      markedQuestions.length;

    const confirmed = window.confirm(
      `Are you sure you want to submit the test?\n\n` +
        `Attempted: ${attempted}\n` +
        `Unattempted: ${unattempted}\n` +
        `Marked for Review: ${marked}`
    );

    if (confirmed) {
      submitTest();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TIMER
  |--------------------------------------------------------------------------
  */

  const formattedTime =
    formatTime(timeLeft);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      <Header />

      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">

        {/* BREADCRUMB */}

        <Breadcrumb
          items={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: examTitle,
              to: getReturnPath(
                category,
                exam
              ),
            },
            {
              label: year,
            },
            {
              label: setLabel,
            },
          ]}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ======================================================
              HEADER
          ======================================================= */}

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-7">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Computer-based test
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                {examTitle}
              </h1>
            </div>

            {/* TIMER */}

            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${
                started
                  ? timeLeft <= 300
                    ? "border-red-400 bg-red-500/20 text-red-100"
                    : "border-white/15 bg-white/10"
                  : "border-white/15 bg-white/10"
              }`}
            >
              <Clock3
                size={17}
                className={
                  started &&
                  timeLeft <= 300
                    ? "text-red-300"
                    : "text-indigo-300"
                }
              />

              <span>Timer</span>

              <strong
                className={`font-mono text-base ${
                  started &&
                  timeLeft <= 300
                    ? "text-red-300"
                    : "text-white"
                }`}
              >
                {formattedTime}
              </strong>
            </div>

          </div>

          {/* ======================================================
              DETAILS
          ======================================================= */}

          <div className="p-5 sm:p-7">

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <Detail
                label="Year"
                value={
                  year ||
                  "Not specified"
                }
                icon={
                  <FileQuestion
                    size={17}
                  />
                }
              />

              <Detail
                label="Date"
                value={
                  dateLabel ||
                  "Not applicable"
                }
                icon={
                  <Clock3
                    size={17}
                  />
                }
              />

              <Detail
                label={
                  shift
                    ? "Shift / Set"
                    : "Paper"
                }
                value={setLabel}
                icon={
                  <Check
                    size={17}
                  />
                }
              />

              <Detail
                label="Questions"
                value={details.questions}
                icon={
                  <FileQuestion
                    size={17}
                  />
                }
              />

              <Detail
                label="Maximum marks"
                value={details.marks}
                icon={
                  <Check
                    size={17}
                  />
                }
              />

              <Detail
                label="Duration"
                value={details.duration}
                icon={
                  <Clock3
                    size={17}
                  />
                }
              />

              <Detail
                label="Correct answer"
                value={details.correct}
                icon={
                  <Check
                    size={17}
                  />
                }
              />

              <Detail
                label="Negative marking"
                value={details.negative}
                icon={
                  <Minus
                    size={17}
                  />
                }
              />

            </div>
{questionsError && (
  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
    {questionsError}
  </div>
)}
            {/* ======================================================
                BEFORE TEST
            ======================================================= */}

            {!started && (
              <div className="mt-6">

                <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="font-semibold">
                      Test instructions
                    </p>

                    <p>
                      Click on{" "}
                      <b>Start Test</b>{" "}
                      to begin the test.
                      The timer will
                      start immediately.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* ======================================================
                TEST WORKSPACE
            ======================================================= */}

            {started &&
              question && (
                <div className="mt-6">

                  {/* QUESTION TOP BAR */}

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Question
                      </p>

                      <p className="text-lg font-bold text-slate-900">
                        {currentQuestion + 1}

                        <span className="mx-1 text-slate-400">
                          /
                        </span>

                        {totalQuestions}
                      </p>
                    </div>

                    {/* LANGUAGE */}

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">

                      <Languages
                        size={17}
                        className="ml-2 text-slate-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setLanguage("en")
                        }
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                          language === "en"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        English
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setLanguage("hi")
                        }
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                          language === "hi"
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        हिन्दी
                      </button>

                    </div>

                  </div>

                  {/* QUESTION */}

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                    {/* SUBJECT */}

                    {question.subject && (
                      <div className="mb-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {question.subject}
                        </span>
                      </div>
                    )}

                    {/* QUESTION TEXT */}

                    <h2 className="text-lg font-semibold leading-8 text-slate-900 sm:text-xl">

                      <span className="mr-2 text-indigo-600">
                        Q{currentQuestion + 1}.
                      </span>

                      {
                        question.question[
                          language
                        ]
                      }

                   </h2>

{/* QUESTION IMAGE / DIAGRAM */}

{question.imageUrl && (
  <div className="my-6 flex justify-center">
    <img
      src={question.imageUrl}
      alt={`Question ${currentQuestion + 1}`}
      className="max-h-[450px] max-w-full rounded-lg border border-slate-200 object-contain"
    />
  </div>
)}

{/* OPTIONS */}

<div className="mt-7 space-y-3">
  
                      {question.options[
                        language
                      ].map(
                        (
                          option,
                          index
                        ) => {

                          const isSelected =
                            selectedAnswer ===
                            index;

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                selectAnswer(
                                  index
                                )
                              }
                              className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100"
                                  : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                              }`}
                            >

                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                                  isSelected
                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                    : "border-slate-300 bg-slate-50 text-slate-700"
                                }`}
                              >
                                {String.fromCharCode(
                                  65 + index
                                )}
                              </span>

                              <span
                                className={`pt-1 text-sm leading-6 sm:text-base ${
                                  isSelected
                                    ? "font-semibold text-indigo-950"
                                    : "text-slate-700"
                                }`}
                              >
                                {option}
                              </span>

                            </button>
                          );
                        }
                      )}

                    </div>

                    {/* ==================================================
                        NAVIGATION
                    =================================================== */}

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">

                      {/* PREVIOUS */}

                      <button
                        type="button"
                        onClick={
                          previousQuestion
                        }
                        disabled={
                          currentQuestion ===
                          0
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft
                          size={17}
                        />
                        Previous
                      </button>

                      {/* CLEAR */}

                      <button
                        type="button"
                        onClick={
                          clearAnswer
                        }
                        disabled={
                          selectedAnswer ===
                          null
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <RotateCcw
                          size={16}
                        />
                        Clear
                      </button>

                      {/* MARK REVIEW */}

                      <button
                        type="button"
                        onClick={
                          toggleMarkForReview
                        }
                        className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                          markedQuestions.includes(
                            currentQuestion
                          )
                            ? "border-purple-500 bg-purple-100 text-purple-700"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Flag
                          size={16}
                        />

                        {markedQuestions.includes(
                          currentQuestion
                        )
                          ? "Unmark Review"
                          : "Mark for Review"}
                      </button>

                      {/* NEXT / SUBMIT */}

                      <button
                        type="button"
                        onClick={
                          currentQuestion ===
                          totalQuestions - 1
                            ? handleSubmit
                            : nextQuestion
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                      >
                        {currentQuestion ===
                        totalQuestions - 1
                          ? "Submit Test"
                          : "Save & Next"}

                        <ChevronRight
                          size={17}
                        />
                      </button>

                    </div>

                  </div>

                  {/* ==================================================
                      QUESTION PALETTE
                  =================================================== */}

                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">

                    <div className="flex items-center justify-between">

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Question Palette
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Select a question directly
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-slate-500">
                        {currentQuestion + 1}/
                        {totalQuestions}
                      </span>

                    </div>

                    {/* PALETTE */}

                    <div className="mt-4 flex flex-wrap gap-2">

                 {questions.map(
  (_, index) => {

                          const isAnswered =
                            answers[
                              index
                            ] !==
                            undefined;

                          const isMarked =
                            markedQuestions.includes(
                              index
                            );

                          const isCurrent =
                            currentQuestion ===
                            index;

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                setCurrentQuestion(
                                  index
                                )
                              }
                              className={`h-10 w-10 rounded-lg border text-sm font-bold transition ${
                                isCurrent
                                  ? "border-indigo-600 bg-indigo-600 text-white"
                                  : isMarked
                                    ? "border-purple-500 bg-purple-100 text-purple-700"
                                    : isAnswered
                                      ? "border-green-500 bg-green-100 text-green-700"
                                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50"
                              }`}
                            >
                              {index + 1}
                            </button>
                          );
                        }
                      )}

                    </div>

                    {/* LEGEND */}

                    <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-200 pt-4 text-xs font-medium text-slate-600">

                      <Legend
                        className="bg-indigo-600"
                        label="Current"
                      />

                      <Legend
                        className="bg-green-500"
                        label="Answered"
                      />

                      <Legend
                        className="bg-purple-500"
                        label="Review"
                      />

                      <Legend
                        className="bg-slate-300"
                        label="Not Answered"
                      />

                    </div>

                  </div>

                </div>
              )}

            {/* ======================================================
                FOOTER
            ======================================================= */}

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">

              <a
                href={getReturnPath(
                  category,
                  exam
                )}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
              >
                <ArrowLeft
                  size={16}
                />

                Back to papers
              </a>

            <button
  type="button"
  onClick={startTest}
  disabled={
    started ||
    questionsLoading ||
    questions.length === 0
  }
                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
               {questionsLoading
  ? "Loading Questions..."
  : started
    ? "Test Running..."
    : "Start Test"}
              </button>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| LEGEND
|--------------------------------------------------------------------------
*/

function Legend({
  className,
  label,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-sm ${className}`}
      />

      {label}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| DETAIL
|--------------------------------------------------------------------------
*/

function Detail({
  label,
  value,
  icon,
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-2 break-words text-sm font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| EXAM TITLES
|--------------------------------------------------------------------------
*/

function getExamTitle(
  category,
  exam
) {
  if (category === "upsssc") {
    return "UPSSSC PET";
  }

  if (category === "ssc") {
    return exam === "cgl"
      ? "SSC CGL"
      : "SSC CHSL";
  }

  if (category === "railway") {
    if (exam === "group-d")
      return "RRB Group D";

    if (exam === "ntpc")
      return "RRB NTPC";

    return "RRB ALP";
  }

  if (category === "gate") {
    return "GATE CSE";
  }

  return "PrepDesk Practice Test";
}

/*
|--------------------------------------------------------------------------
| RETURN PATH
|--------------------------------------------------------------------------
*/

function getReturnPath(
  category,
  exam
) {
  if (category === "ssc") {
    return `/ssc/${exam}`;
  }

  if (category === "railway") {
    return `/railway/${exam}`;
  }

  if (category === "gate") {
    return "/gate/cse";
  }

  return "/upsssc/pet";
}

/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

function getDateLabel(
  category,
  session
) {
  if (
    !session ||
    session.startsWith("shift-")
  ) {
    return null;
  }

  if (category === "railway") {
    const [month, day] =
      session
        .split("-")
        .map(Number);

    if (!month || !day) {
      return null;
    }

    const monthName =
      new Date(
        2025,
        month - 1,
        1
      ).toLocaleString("en", {
        month: "long",
      });

    return `${day} ${monthName}`;
  }

  const parts =
    session.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const [
    day,
    month,
    dateYear,
  ] = parts;

  return `${day}/${month}/${dateYear}`;
}

/*
|--------------------------------------------------------------------------
| LABEL FORMAT
|--------------------------------------------------------------------------
*/

function formatLabel(
  value = "paper"
) {
  return value
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

/*
|--------------------------------------------------------------------------
| EXAM DETAILS + TIMER
|--------------------------------------------------------------------------
*/

function getExamDetails(
  category,
  exam
) {
  // UPSSSC PET

  if (category === "upsssc") {
    return {
      questions: "100",
      marks: "100",
      duration: "2 hours",
      durationSeconds:
        2 * 60 * 60,
      correct: "+1",
      negative:
        "-0.25 per wrong answer",
    };
  }

  // SSC CGL / CHSL

  if (category === "ssc") {
    return {
      questions: "100",
      marks: "200",
      duration: "1 hour",
      durationSeconds:
        60 * 60,
      correct: "+2",
      negative:
        "-0.50 per wrong answer",
    };
  }

  // RAILWAY

  if (category === "railway") {
    if (exam === "alp") {
      return {
        questions:
          "Not configured",
        marks:
          "Not configured",
        duration: "1 hour",
        durationSeconds:
          60 * 60,
        correct: "+1",
        negative:
          "-1/3 per wrong answer",
      };
    }

    return {
      questions:
        "Not configured",
      marks:
        "Not configured",
      duration:
        "90 minutes",
      durationSeconds:
        90 * 60,
      correct: "+1",
      negative:
        "-1/3 per wrong answer",
    };
  }

  // GATE

  if (category === "gate") {
    return {
      questions:
        "Not configured",
      marks:
        "Per-question marking",
      duration:
        "3 hours",
      durationSeconds:
        3 * 60 * 60,
      correct:
        "As shown per question",
      negative:
        "MCQ: -1/3 (1 mark), -2/3 (2 marks); no negative for MSQ/NAT",
    };
  }

  return {
    questions:
      "Not configured",
    marks:
      "Not configured",
    duration:
      "Not configured",
    durationSeconds:
      60 * 60,
    correct:
      "Not configured",
    negative:
      "Not configured",
  };
}

/*
|--------------------------------------------------------------------------
| TIMER FORMAT
|--------------------------------------------------------------------------
*/

function formatTime(
  totalSeconds
) {
  if (
    !totalSeconds ||
    totalSeconds < 0
  ) {
    return "00:00:00";
  }

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(
        2,
        "0"
      )
    )
    .join(":");
}

export default TestPage;