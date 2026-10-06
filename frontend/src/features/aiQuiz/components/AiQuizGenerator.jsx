// src/features/aiQuiz/components/AiQuizGenerator.jsx

import { useState } from "react";
import { Sparkles, Brain, Target, Info } from "lucide-react";
import cx from "../../../utils/cx.js";

const AiQuizGenerator = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    onGenerate({ topic: topic.trim(), difficulty, count });
  };

  return (
    <div className="rounded-2xl border border-border bg-white/75 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <Sparkles className="h-4 w-4 text-brand-blue" />
          <h2 className="text-lg font-extrabold text-text-title">
            Generate AI Quiz
          </h2>
        </div>
        <p className="text-[12px] font-semibold text-text-muted">
          Design a custom challenge to test your knowledge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-text-title flex items-center gap-1.5 px-1">
            <Target className="h-3 w-3" />
            Topic or Subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. DBMS, Microprocessors, Software Engineering..."
            className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-text-title placeholder:text-text-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-text-title flex items-center gap-1.5 px-1">
              <Brain className="h-3 w-3" />
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-text-title focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition appearance-none"
            >
              <option value="easy">Easy — Basic Concepts</option>
              <option value="medium">Medium — Balanced</option>
              <option value="hard">Hard — Advanced</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-text-title flex items-center gap-1.5 px-1">
              <Info className="h-3 w-3" />
              Question Count
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-semibold text-text-title focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition appearance-none"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className={cx(
            "w-full rounded-xl py-3.5 text-sm font-bold transition flex items-center justify-center gap-2",
            loading 
              ? "bg-brand-blue/10 text-brand-blue cursor-not-allowed" 
              : "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-brand shadow-brand-blue/20"
          )}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Start AI Quiz
            </>
          )}
        </button>
      </form>
    </div>
  );
};


export default AiQuizGenerator;
