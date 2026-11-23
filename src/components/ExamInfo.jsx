import { Check, CircleHelp, Clock3, FileQuestion, Minus, Plus } from "lucide-react";

const icons = { questions: FileQuestion, duration: Clock3, marks: Plus, correct: Check, wrong: Minus, unanswered: CircleHelp };

function ExamInfo({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = icons[item.icon] || FileQuestion;
        return <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Icon size={17} className="text-indigo-600" />{item.label}</div>
          <p className="mt-2 text-base font-bold text-slate-950">{item.value}</p>
        </div>;
      })}
    </div>
  );
}

export default ExamInfo;