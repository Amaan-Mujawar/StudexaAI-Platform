// src/features/aiQuiz/pages/AiQuizResultPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { RotateCcw, Search, LayoutDashboard, Loader2, Sparkles, Trash2 } from "lucide-react";

import { useAiQuiz } from "../hooks/useAiQuiz.js";
import quizService from "../services/aiQuiz.service.js";
import AiQuizResultView from "../components/AiQuizResultView.jsx";
import DeleteConfirmationModal from "../../../components/dashboard/shared/DeleteConfirmationModal.jsx";

const AiQuizResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { 
    refreshHistory, 
    deleteAttempt, 
    deletingAttempt, 
    setDeletingAttempt 
  } = useAiQuiz();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        const res = await quizService.getQuizResult(attemptId);
        setResult(res.data);
        
        // Auto-refresh sidebar history to show the new result
        refreshHistory();
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        toast.error("Failed to load quiz result");
        navigate("/dashboard/ai-quiz");
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) loadResult();
  }, [attemptId, navigate, refreshHistory]);

  const handleReattempt = async () => {
    if (!result) return;
    try {
      const res = await quizService.startQuiz({
        topic: result.topic,
        count: result.totalQuestions,
        difficulty: result.difficulty,
        noteId: result.linkedNote || null,
      });
      if (res.data?.attemptId) {
        navigate(`/dashboard/ai-quiz/${res.data.attemptId}`);
      }
    } catch (err) {
      toast.error("Failed to start new quiz");
    }
  };

  const onConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAttempt(attemptId);
      toast.success("Attempt deleted");
      navigate("/dashboard/ai-quiz");
    } catch (err) {
      toast.error("Failed to delete attempt");
    } finally {
      setIsDeleting(false);
      setDeletingAttempt(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 relative">
           <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
           <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-brand-blue animate-pulse" />
        </div>
        <p className="text-lg font-black text-text-title tracking-tight">Compiling Results...</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex min-h-[85vh] flex-col items-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-2xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-brand-blue">
            Performance Analysis
          </div>
          <h1 className="text-3xl font-black text-text-title tracking-tight">Quiz Results</h1>
        </div>

        <AiQuizResultView result={result} />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleReattempt}
            className="group flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-brand-blue py-3.5 text-sm font-black text-white shadow-brand shadow-brand-blue/20 transition-all hover:bg-brand-blue-hover active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4 transition group-hover:rotate-[-45deg]" />
            Reattempt Quiz
          </button>

          <button
            onClick={() => navigate(`/dashboard/ai-quiz/${attemptId}/review`)}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-white py-3.5 text-sm font-black text-text-title transition-all hover:bg-brand-blue/5 hover:border-brand-blue/20 hover:text-brand-blue active:scale-[0.98]"
          >
            <Search className="h-4 w-4" />
            Review Logic
          </button>

          <button
            onClick={() => setDeletingAttempt(result)}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-2xl border border-status-error/20 bg-status-error/5 py-3.5 text-sm font-black text-status-error transition-all hover:bg-status-error/10 active:scale-[0.98]"
            title="Discard this attempt"
          >
            <Trash2 className="h-4 w-4" />
            Discard Attempt
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard/ai-quiz")}
            className="inline-flex items-center gap-2 text-[11px] font-bold text-text-muted hover:text-brand-blue transition"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Return to Dashboard
          </button>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        open={Boolean(deletingAttempt)}
        title="Discard Quiz Attempt?"
        description={`Are you sure you want to remove your session on "${result?.topic}"?`}
        loading={isDeleting}
        onClose={() => setDeletingAttempt(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};


export default AiQuizResultPage;
