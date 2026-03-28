// src/features/aptitude/pages/AptitudeAttemptPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowRight, Loader2, ChevronLeft, Send, Sparkles } from "lucide-react";

import aptitudeService from "../services/aptitude.service.js";
import AptitudeQuestionView from "../components/AptitudeQuestionView.jsx";
import AptitudeProgress from "../components/AptitudeProgress.jsx";
import cx from "../../../utils/cx.js";

const AptitudeAttemptPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= LOAD QUESTION ================= */
  const loadQuestion = async () => {
    try {
      setLoading(true);
      const res = await aptitudeService.getCurrentQuestion(attemptId);
      setQuestion(res.data);
      setSelectedIndex(null);
      setLocked(false);
      setFeedback(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      navigate(`/dashboard/aptitude/${attemptId}/result`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (attemptId) loadQuestion();
  }, [attemptId]);

  /* ================= SUBMIT ANSWER ================= */
  const handleSubmit = async () => {
    if (selectedIndex === null || submitting) return;

    setSubmitting(true);
    try {
      const res = await aptitudeService.submitAnswer(attemptId, selectedIndex);
      setLocked(true);
      setFeedback(res.data.correct ? "correct" : "incorrect");

      if (res.data.completed) {
        toast.success("Practice completed!");
        setTimeout(() => {
          navigate(`/dashboard/aptitude/${attemptId}/result`);
        }, 1200);
      }
    } catch (err) {
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !question) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 relative">
           <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
           <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-brand-blue animate-pulse" />
        </div>
        <p className="text-lg font-black text-text-title">Preparing your question...</p>
        <p className="mt-2 text-sm font-semibold text-text-muted">Calculating adaptive problems</p>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="flex min-h-[85vh] flex-col items-center px-4 py-4 sm:py-6">
      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <button
            onClick={() => navigate("/dashboard/aptitude")}
            className="group flex items-center gap-2 text-[11px] font-bold text-text-muted transition hover:text-brand-blue"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-border transition group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5">
              <ChevronLeft className="h-3 w-3" />
            </div>
            Quit Practice
          </button>
        </div>

        <AptitudeProgress current={question.index} total={question.total} />

        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={question._id || question.index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <AptitudeQuestionView
                question={question}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                locked={locked}
                feedback={feedback}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center">
          {!locked ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIndex === null || submitting}
              className={cx(
                "group relative flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-black text-white shadow-brand shadow-brand-blue/20 transition-all active:scale-[0.98] sm:w-64",
                selectedIndex === null || submitting
                  ? "bg-brand-blue/40 cursor-not-allowed"
                  : "bg-brand-blue hover:bg-brand-blue-hover"
              )}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? "Checking..." : "Submit Answer"}
            </button>
          ) : (
            <button
              onClick={loadQuestion}
              className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-text-title py-3.5 text-sm font-black text-white shadow-lg shadow-black/10 transition-all hover:bg-black active:scale-[0.98] sm:w-64"
            >
              Next Question
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {locked && feedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cx(
              "mt-4 flex items-center justify-center gap-2 text-center text-[13px] font-black uppercase tracking-wider",
              feedback === "correct" ? "text-green-600" : "text-red-500"
            )}
          >
            {feedback === "correct" 
              ? "That's correct! Great job mastering this concept." 
              : "Not quite, but every mistake is a learning step!"}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AptitudeAttemptPage;
