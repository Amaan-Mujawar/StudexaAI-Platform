// src/features/aiQuiz/pages/AiQuizReviewPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2, BookOpen, Sparkles } from "lucide-react";

import quizService from "../services/aiQuiz.service.js";
import AiQuizReviewCard from "../components/AiQuizReviewCard.jsx";

const AiQuizReviewPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReview = async () => {
      try {
        setLoading(true);
        const res = await quizService.getQuizReview(attemptId);
        setReview(res.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        toast.error("Failed to load review");
        navigate("/dashboard/ai-quiz");
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) loadReview();
  }, [attemptId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 relative">
           <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
           <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-brand-blue animate-pulse" />
        </div>
        <p className="text-lg font-black text-text-title tracking-tight">Fetching Explanations...</p>
      </div>
    );
  }

  if (!review) return null;

  return (
    <div className="flex flex-col items-center px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <button
            onClick={() => navigate(`/dashboard/ai-quiz/${attemptId}/result`)}
            className="mb-4 flex items-center gap-2 text-[11px] font-bold text-text-muted hover:text-brand-blue transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Result
          </button>
          
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl bg-brand-blue/10 p-2 text-brand-blue">
            <BookOpen className="h-5 w-5" />
          </div>
          <h1 className="text-3xl font-black text-text-title tracking-tight">Review Session</h1>
          <p className="mt-2 text-[13px] font-semibold text-text-muted">
            Analyzing {review.questions?.length || 0} solutions from your attempt.
          </p>
        </div>

        <div className="space-y-4">
          {review.questions?.map((q, idx) => (
            <AiQuizReviewCard key={idx} index={idx} data={q} />
          ))}
        </div>

        <div className="mt-12 flex justify-center border-t border-border pt-8">
          <button
            onClick={() => navigate("/dashboard/ai-quiz")}
            className="rounded-2xl bg-text-title px-10 py-3.5 text-sm font-black text-white shadow-xl shadow-black/10 transition hover:bg-black active:scale-[0.98]"
          >
            Finished Review
          </button>
        </div>
      </motion.div>
    </div>
  );
};


export default AiQuizReviewPage;
