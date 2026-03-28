// src/features/contest/pages/ContestAttemptPage.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2, Send } from "lucide-react";

import { useContest } from "../context/ContestContext.jsx";
import TimerBar from "../components/TimerBar.jsx";
import cx from "../../../utils/cx.js";

const DIFF_COLORS = {
    easy: "text-green-600 bg-green-50 border-green-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    hard: "text-red-600 bg-red-50 border-red-200",
};

const ContestAttemptPage = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const { submitContest } = useContest();

    const [attempt, setAttempt] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [questionStart, setQuestionStart] = useState(Date.now());
    const [submitting, setSubmitting] = useState(false);

    const answersRef = useRef(answers);
    answersRef.current = answers;

    useEffect(() => {
        const raw = sessionStorage.getItem(`contest_attempt_${attemptId}`);
        if (raw) {
            try { setAttempt(JSON.parse(raw)); }
            catch { navigate("/dashboard/contest", { replace: true }); }
        } else {
            navigate("/dashboard/contest", { replace: true });
        }
    }, [attemptId, navigate]);

    useEffect(() => {
        setSelectedIdx(null);
        setQuestionStart(Date.now());
    }, [currentIndex]);

    const doSubmitAll = useCallback(async (finalAnswers) => {
        setSubmitting(true);
        try {
            const result = await submitContest(attemptId, finalAnswers);
            /* submitContest returns the API data directly from ContestContext */
            sessionStorage.setItem(`contest_result_${attemptId}`, JSON.stringify(result));
            navigate(`/dashboard/contest/${attemptId}/result`, { replace: true });
        } catch (err) {
            toast.error(err?.message || "Submission failed. Please try again.");
            setSubmitting(false);
        }
    }, [submitContest, attemptId, navigate]);

    const goNext = useCallback(async (forcedIdx) => {
        const sel = forcedIdx !== undefined ? forcedIdx : (selectedIdx ?? -1);
        const timeTakenSecs = Math.min(Math.round((Date.now() - questionStart) / 1000), 30);

        const newAnswer = { questionIndex: currentIndex, selectedIndex: sel, timeTakenSecs };
        const allAnswers = [...answersRef.current, newAnswer];
        setAnswers(allAnswers);

        const isLast = attempt && currentIndex === attempt.questions.length - 1;
        if (isLast) {
            await doSubmitAll(allAnswers);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }, [selectedIdx, currentIndex, questionStart, attempt, doSubmitAll]);

    const handleTimerExpire = useCallback(() => goNext(-1), [goNext]);

    /* ── Loading spinner ── */
    if (!attempt) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
                <div className="mb-6 relative">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
                    <span className="absolute inset-0 flex items-center justify-center text-xl">⚡</span>
                </div>
                <p className="text-lg font-black text-text-title">Loading contest…</p>
            </div>
        );
    }

    const question = attempt.questions[currentIndex];
    const total = attempt.questions.length;
    const isLast = currentIndex === total - 1;

    return (
        <div className="flex min-h-[85vh] flex-col items-center px-4 py-4 sm:py-6">
            <div className="w-full max-w-2xl">
                {/* ── Back button ── */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate("/dashboard/contest")}
                        className="group flex items-center gap-2 text-[11px] font-bold text-text-muted transition hover:text-brand-blue"
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-border transition group-hover:border-brand-blue/30 group-hover:bg-brand-blue/5">
                            <ChevronLeft className="h-3 w-3" />
                        </div>
                        Quit Contest
                    </button>
                </div>

                {/* ── Progress bar ── */}
                <div className="mb-3 rounded-2xl border border-border bg-white p-3 shadow-card">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-text-muted">
                        <span>Question {currentIndex + 1} of {total}</span>
                        <span className={cx("rounded-full border px-2 py-0.5 capitalize text-[10px]", DIFF_COLORS[question.difficulty])}>
                            {question.difficulty}
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-brand-blue transition-all duration-500"
                            style={{ width: `${(currentIndex / total) * 100}%` }}
                        />
                    </div>
                </div>

                {/* ── Timer ── */}
                <div className="mb-4 rounded-2xl border border-border bg-white p-3 shadow-card">
                    <TimerBar maxSecs={30} questionKey={currentIndex} onExpire={handleTimerExpire} />
                </div>

                {/* ── Question + options ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        {/* Question card */}
                        <div className="mb-4 rounded-2xl border border-border bg-white p-5 shadow-card">
                            <p className="text-[15px] font-bold text-text-title leading-relaxed">
                                {question.question}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5">
                            {question.options.map((opt, idx) => {
                                const isSelected = selectedIdx === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => selectedIdx === null && setSelectedIdx(idx)}
                                        disabled={selectedIdx !== null}
                                        className={cx(
                                            "w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-150",
                                            isSelected
                                                ? "border-brand-blue bg-brand-blue/8 text-brand-blue shadow-brand shadow-brand-blue/10"
                                                : selectedIdx !== null
                                                    ? "border-border bg-white/60 text-text-muted cursor-not-allowed"
                                                    : "border-border bg-white text-text-body hover:border-brand-blue/40 hover:bg-brand-blue/5 shadow-card"
                                        )}
                                    >
                                        <span className="mr-3 inline-grid h-5 w-5 place-items-center rounded-full border border-current text-[10px] font-black">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ── Next / Submit button ── */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => goNext()}
                        disabled={selectedIdx === null || submitting}
                        className={cx(
                            "group relative flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-black text-white shadow-brand shadow-brand-blue/20 transition-all active:scale-[0.98] sm:w-64",
                            selectedIdx === null || submitting
                                ? "bg-brand-blue/40 cursor-not-allowed"
                                : "bg-brand-blue hover:bg-brand-blue-hover"
                        )}
                    >
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {submitting ? "Submitting…" : isLast ? "Submit Contest" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContestAttemptPage;
