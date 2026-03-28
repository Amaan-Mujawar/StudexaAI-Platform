// src/features/verbalReasoning/components/VerbalResultView.jsx

import { Trophy, BarChart, Percent, MessageSquare } from "lucide-react";
import cx from "../../../utils/cx.js";

const VerbalResultView = ({ result }) => {
  if (!result) return null;

  const score = result.score || 0;
  const total = result.totalQuestions || 0;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-border bg-white shadow-card">
        <div className="relative mb-5">
          <svg className="h-32 w-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              className="text-brand-blue/10"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * percentage) / 100}
              className="text-brand-blue transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-text-title leading-none">
              {percentage}%
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">
              Verbal
            </span>
          </div>
        </div>

        <h2 className="text-xl font-black text-text-title mb-1">
          {percentage >= 80 ? "Linguistic Expert!" : percentage >= 50 ? "Great Communication!" : "Keep Reading!"}
        </h2>
        <p className="text-[13px] font-semibold text-text-muted max-w-sm">
          You solved {score} out of {total} verbal questions correctly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ResultStat icon={<MessageSquare className="h-4 w-4" />} label="Type" value="Verbal" />
        <ResultStat icon={<BarChart className="h-4 w-4" />} label="Difficulty" value={result.difficulty} />
        <ResultStat icon={<Trophy className="h-4 w-4" />} label="Score" value={`${score}/${total}`} />
        <ResultStat icon={<Percent className="h-4 w-4" />} label="Accuracy" value={`${percentage}%`} />
      </div>
    </div>
  );
};

const ResultStat = ({ icon, label, value, truncate }) => (
  <div className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm backdrop-blur-sm">
    <div className="flex items-center gap-1.5 text-text-muted mb-2">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </div>
    <div className={cx(
      "text-sm font-extrabold text-text-title",
      truncate && "truncate"
    )} title={value}>
      {value}
    </div>
  </div>
);

export default VerbalResultView;
