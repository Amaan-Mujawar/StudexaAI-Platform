// src/features/aiQuiz/components/AiQuizQuestionView.jsx

import cx from "../../../utils/cx.js";
import { CheckCircle2, XCircle } from "lucide-react";

/**
 * Premium Question View
 * Handles selection, locking, and feedback
 */
const AiQuizQuestionView = ({
  question,
  selectedIndex,
  onSelect,
  locked,
  feedback, // 'correct' | 'incorrect' | null
}) => {
  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-white/50 p-4 backdrop-blur-sm">
        <h2 className="text-base font-extrabold text-text-title leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="space-y-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const isFeedbackMatch = locked && isSelected;
          
          let stateStyles = "border-border bg-white/70 hover:bg-white hover:border-brand-blue/30";
          
          if (isSelected && !locked) {
            stateStyles = "border-brand-blue bg-brand-blue/5 ring-4 ring-brand-blue/5 text-brand-blue";
          }
          
          if (locked) {
            if (isFeedbackMatch) {
              stateStyles = feedback === "correct" 
                ? "border-green-500 bg-green-50 text-green-700 ring-4 ring-green-500/10"
                : "border-red-500 bg-red-50 text-red-700 ring-4 ring-red-500/10";
            } else {
              stateStyles = "border-border bg-white/30 text-text-muted opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={locked}
              onClick={() => onSelect(idx)}
              className={cx(
                "group relative flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition duration-200 active:scale-[0.99]",
                stateStyles
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition duration-200",
                  isSelected ? "bg-brand-blue border-brand-blue text-white" : "bg-white border-border text-text-muted"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm font-semibold">{option}</span>
              </div>

              {locked && isFeedbackMatch && (
                <div className="shrink-0">
                  {feedback === "correct" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};


export default AiQuizQuestionView;
