// src/features/aiQuiz/components/AiQuizHistoryItem.jsx

import { useNavigate } from "react-router-dom";
import { Eye, RotateCcw, Trash2, Calendar, Trophy, BarChart3 } from "lucide-react";
import cx from "../../../utils/cx.js";

const AiQuizHistoryItem = ({ quiz, onDelete, onReattempt, loading }) => {
  const navigate = useNavigate();
  const id = quiz._id || quiz.id;

  const handleView = () => navigate(`/dashboard/ai-quiz/${id}/result`);

  return (
    <div className="group rounded-3xl border border-border bg-white/70 p-5 shadow-card transition duration-300 hover:bg-white hover:shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-lg font-extrabold text-text-title group-hover:text-brand-blue transition">
            {quiz.topic}
          </h3>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-text-muted">
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="capitalize">{quiz.difficulty || "Adaptive"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-text-muted">
              <Trophy className="h-3.5 w-3.5" />
              {quiz.score || 0} / {quiz.totalQuestions || 0}
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-text-muted">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(quiz.completedAt || quiz.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleView}
            className="flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold text-white shadow-brand shadow-brand-blue/15 transition hover:bg-brand-blue-hover"
          >
            <Eye className="h-3.5 w-3.5" />
            Result
          </button>
          
          <button
            onClick={() => onReattempt(quiz)}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white font-bold text-text-title transition hover:bg-brand-blue/6 hover:text-brand-blue"
            title="Reattempt"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(id)}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white font-bold text-text-title transition hover:bg-red-50 hover:text-red-600 hover:border-red-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiQuizHistoryItem;
