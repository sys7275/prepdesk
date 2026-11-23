import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

const examData = {
  upsssc: [
    {
      id: "pet",
      title: "UPSSSC PET",
      description: "Practice questions for UPSSSC PET",
    },
  ],

  ssc: [
    {
      id: "cgl",
      title: "SSC CGL",
      description: "Practice questions for SSC CGL",
    },
    {
      id: "chsl",
      title: "SSC CHSL",
      description: "Practice questions for SSC CHSL",
    },
    {
      id: "gd",
      title: "SSC GD",
      description: "Practice questions for SSC GD",
    },
  ],

  railway: [
    {
      id: "group-d",
      title: "RRB Group D",
      description: "Practice questions for RRB Group D",
    },
    {
      id: "ntpc",
      title: "RRB NTPC",
      description: "Practice questions for RRB NTPC",
    },
    {
      id: "alp",
      title: "RRB ALP",
      description: "Practice questions for RRB ALP",
    },
  ],
};

const categoryTitles = {
  upsssc: "UPSSSC",
  ssc: "SSC",
  railway: "Railway",
};

function PracticeCategory() {
  const { category } = useParams();
  const navigate = useNavigate();

  const exams = examData[category] || [];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => navigate("/practice")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Practice Set
        </button>

        <div className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Practice Set
          </span>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            {categoryTitles[category] || "Practice"}
          </h1>

          <p className="mt-3 text-slate-600">
            Select an examination to continue.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() =>
                navigate(`/practice/${category}/${exam.id}`)
              }
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={22} />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {exam.title}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {exam.description}
              </p>

              <div className="mt-5 flex items-center gap-2 font-semibold text-blue-600">
                Continue
                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default PracticeCategory;