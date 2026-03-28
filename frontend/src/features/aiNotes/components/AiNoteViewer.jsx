// src/features/aiNotes/components/AiNoteViewer.jsx

import { motion } from "framer-motion";
import { BookOpen, RefreshCw, Trash2, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import cx from "../../../utils/cx.js";
import { formatNoteDate, formatNoteMode } from "../utils/aiNotes.utils.js";
import { startQuiz } from "../../aiQuiz/services/aiQuiz.service.js";

/* =====================================================
   AiNoteViewer
   ✅ Pure display component
   ✅ Renders backend data only
   ✅ Calls parent callbacks for actions
===================================================== */

const cardAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const AiNoteViewer = ({ note, onRegenerate, onDelete, regenerating }) => {
  const navigate = useNavigate();

  if (!note) {
    return (
      <motion.div
        variants={cardAnim}
        className="surface-card p-8 text-center"
      >
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-brand-blue/6 shadow-card">
          <BookOpen className="h-8 w-8 text-brand-blue" />
        </div>
        <h3 className="mb-2 text-base font-extrabold text-text-title">
          No note selected
        </h3>
        <p className="text-sm font-semibold text-text-muted">
          Generate a new note or select one from the sidebar
        </p>
      </motion.div>
    );
  }

  const handleLaunchQuiz = async () => {
    try {
      const res = await startQuiz({
        topic: note.subject,
        count: 5,
        difficulty: "medium",
        noteId: note._id,
      });

      navigate(`/dashboard/quiz/${res.data.attemptId}`);
    } catch (err) {
      toast.error("Failed to start quiz");
    }
  };

  return (
    <motion.div
      variants={cardAnim}
      className="surface-card p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="mb-1 text-lg font-extrabold text-brand-blue">
            {note.subject}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-text-muted">
            <span>{formatNoteMode(note.mode)}</span>
            <span>•</span>
            <span>{formatNoteDate(note.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onRegenerate?.(note._id)}
            disabled={regenerating}
            className={cx(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white shadow-card transition",
              "hover:bg-brand-blue/6",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
            aria-label="Regenerate note"
          >
            <RefreshCw
              className={cx(
                "h-4 w-4 text-brand-blue",
                regenerating && "animate-spin"
              )}
            />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(note._id)}
            className={cx(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white shadow-card transition",
              "hover:bg-red-50 hover:border-red-200"
            )}
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6 rounded-2xl border border-border bg-brand-blue/3 p-5">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-body">
          {note.answer}
        </pre>
      </div>

      {/* Quiz CTA */}
      <div className="rounded-2xl border border-border bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-brand-blue/6 shadow-card">
            <GraduationCap className="h-5 w-5 text-brand-blue" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-text-title">
              Test Your Knowledge
            </h3>
            <p className="text-xs font-semibold text-text-muted">
              Take a quiz on this topic
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLaunchQuiz}
          className="btn-primary w-full px-4 py-2.5 text-sm"
        >
          Launch Quiz
        </button>
      </div>
    </motion.div>
  );
};

export default AiNoteViewer;
