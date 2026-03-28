// src/features/aiQuiz/components/AiQuizReviewCard.jsx

import cx from "../../../utils/cx.js";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

/**
 * Premium Question Review Card
 * Highlights correctness and provides explanation
 */
const AiQuizReviewCard = ({ index, data }) => {
  const {
    question,
    options,
    correctIndex,
    selectedIndex,
    explanation,
    isCorrect,
  } = data;

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-text-title/5 text-[13px] font-black text-text-title">
            {index + 1}
          </div>
          <h3 className="text-md font-extrabold text-text-title leading-relaxed">
            {question}
          </h3>
        </div>

        <div className={cx(
          "flex shrink-0 self-start mt-0.5 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors",
          isCorrect 
            ? "bg-green-50 text-green-700 border-green-200" 
            : "bg-red-50 text-red-700 border-red-200"
        )}>
          {isCorrect ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          <span>{isCorrect ? "Correct" : "Incorrect"}</span>
        </div>
      </div>

      <div className="space-y-2.5 mb-6">
        {options.map((opt, i) => {
          const isSelected = i === selectedIndex;
          const isCorrectIndex = i === correctIndex;

          let style = "border-border bg-white text-text-muted";
          
          if (isCorrectIndex) {
            style = "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/10";
          } else if (isSelected && !isCorrectIndex) {
            style = "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/10";
          }

          return (
            <div
              key={i}
              className={cx(
                "flex items-center justify-between rounded-xl border p-3.5 text-[13.5px] font-semibold transition",
                style
              )}
            >
              <span>{opt}</span>
              <div className="flex gap-2">
                {isCorrectIndex && <span className="text-[10px] font-black uppercase text-green-600">(Correct)</span>}
                {isSelected && !isCorrectIndex && <span className="text-[10px] font-black uppercase text-red-600">(You)</span>}
              </div>
            </div>
          );
        })}
      </div>

      {explanation && (
        <div className="rounded-2xl border border-brand-blue/10 bg-brand-blue/5 p-4">
          <div className="flex items-center gap-2 mb-2 text-brand-blue">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-wider">Solution Logic</span>
          </div>
          <p className="text-sm font-semibold text-text-body leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default AiQuizReviewCard;
