// src/features/aiNotes/components/AiNoteGenerator.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import cx from "../../../utils/cx.js";

/* =====================================================
   AiNoteGenerator
   ✅ Pure form component
   ✅ Calls parent onGenerate callback
   ✅ NO backend logic
===================================================== */

const cardAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const AiNoteGenerator = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("short");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onGenerate === "function") {
      onGenerate({ topic, mode });
      setTopic("");
    }
  };

  return (
    <motion.div
      variants={cardAnim}
      className="surface-card p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-brand-blue/6 shadow-card">
          <Sparkles className="h-5 w-5 text-brand-blue" />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-text-title">
            Generate AI Study Notes
          </h2>
          <p className="text-xs font-semibold text-text-muted">
            Enter a topic to generate comprehensive notes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="ai-note-topic"
            className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-text-muted"
          >
            Topic
          </label>
          <input
            id="ai-note-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Data Structures, Operating Systems, Computer Networks..."
            className="input"
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-text-muted">
            Note Type
          </label>
          <div className="flex gap-3">
            <label
              className={cx(
                "flex flex-1 cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 transition",
                mode === "short"
                  ? "border-brand-blue bg-brand-blue/6 shadow-card"
                  : "border-border bg-white hover:bg-brand-blue/3"
              )}
            >
              <input
                type="radio"
                name="mode"
                value="short"
                checked={mode === "short"}
                onChange={(e) => setMode(e.target.value)}
                className="h-4 w-4 accent-brand-blue"
                disabled={loading}
              />
              <span className="text-sm font-semibold text-text-title">
                Short
              </span>
            </label>

            <label
              className={cx(
                "flex flex-1 cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 transition",
                mode === "detailed"
                  ? "border-brand-blue bg-brand-blue/6 shadow-card"
                  : "border-border bg-white hover:bg-brand-blue/3"
              )}
            >
              <input
                type="radio"
                name="mode"
                value="detailed"
                checked={mode === "detailed"}
                onChange={(e) => setMode(e.target.value)}
                className="h-4 w-4 accent-brand-blue"
                disabled={loading}
              />
              <span className="text-sm font-semibold text-text-title">
                Detailed
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className={cx(
            "btn-primary w-full px-6 py-3 text-sm",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {loading ? "Generating..." : "Generate Notes"}
        </button>
      </form>
    </motion.div>
  );
};

export default AiNoteGenerator;
