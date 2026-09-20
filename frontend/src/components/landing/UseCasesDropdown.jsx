// src/components/landing/UseCasesDropdown.jsx

import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  CheckSquare,
  FileText,
  LayoutGrid,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import cx from "../../utils/cx.js";

const UseCasesDropdown = ({ open = false, onClose }) => {
  const location = useLocation();

  const items = useMemo(
    () => [
      {
        label: "AI TODO",
        desc: "Generate 3 smart tasks instantly.",
        to: "/use-cases/ai-todo",
        icon: CheckSquare,
      },
      {
        label: "AI Note",
        desc: "Topic notes + Todo → Note",
        to: "/use-cases/ai-note",
        icon: FileText,
      },
      {
        label: "AI Quiz",
        desc: "Unique quizzes. No repeats.",
        to: "/use-cases/ai-quiz",
        icon: Sparkles,
      },
      {
        label: "Aptitude",
        desc: "Placement practice rounds.",
        to: "/use-cases/aptitude",
        icon: LayoutGrid,
      },
      {
        label: "Logical Reasoning",
        desc: "Interview-style reasoning.",
        to: "/use-cases/logical-reasoning",
        icon: Brain,
      },
      {
        label: "Verbal Reasoning",
        desc: "Comprehension + inference.",
        to: "/use-cases/verbal-reasoning",
        icon: MessageSquareText,
      },
    ],
    []
  );

  const isActive = (to) => {
    if (!to) return false;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  if (!open) return null;

  return (
    <div
      className={cx(
        "absolute left-1/2 top-full z-50 mt-3 w-[92vw] max-w-xl -translate-x-1/2",
        "rounded-xl border border-border-soft bg-white/85 p-3",
        "shadow-card-hover backdrop-blur-xl",
        "bg-gradient-to-br from-brand-blue/[0.035] via-white/80 to-brand-cyan/[0.03]"
      )}
      onMouseLeave={() => {
        if (typeof onClose === "function") onClose();
      }}
    >
      {/* subtle ambient glow */}
      <div className="pointer-events-none absolute -left-10 -top-8 h-28 w-28 rounded-full bg-brand-blue/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-8 h-28 w-28 rounded-full bg-brand-cyan/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => {
                if (typeof onClose === "function") onClose();
              }}
              className={cx(
                "group flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 ease-premium",
                "relative",
                active
                  ? "border-brand-blue/35 bg-brand-blue/[0.08]"
                  : cx(
                      "border-transparent",
                      "hover:border-brand-blue/25",
                      "hover:bg-gradient-to-br hover:from-brand-blue/[0.10] hover:to-brand-cyan/[0.08]"
                    )
              )}
            >
              <div
                className={cx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-white transition-all duration-200 ease-premium",
                  active
                    ? "border-brand-blue/40"
                    : "border-border group-hover:border-brand-blue/30"
                )}
              >
                <Icon
                  className={cx(
                    "h-5 w-5 transition-colors duration-200",
                    active
                      ? "text-brand-blue"
                      : "text-text-title group-hover:text-brand-blue"
                  )}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-text-title">
                    {item.label}
                  </p>

                  <span
                    className={cx(
                      "ml-auto inline-flex h-5 w-5 items-center justify-center",
                      "text-xs font-semibold transition-colors",
                      active
                        ? "text-brand-blue"
                        : "text-text-muted group-hover:text-brand-blue"
                    )}
                  >
                    →
                  </span>
                </div>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div
        className={cx(
          "relative mt-3 flex items-center justify-between gap-3 rounded-lg border px-4 py-3",
          "border-border bg-white/90 backdrop-blur-md",
          "bg-gradient-to-r from-brand-blue/[0.04] to-brand-cyan/[0.04]"
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-title">
            Explore all Use cases
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            See feature walkthroughs and examples.
          </p>
        </div>

        <Link
          to="/use-cases"
          onClick={() => {
            if (typeof onClose === "function") onClose();
          }}
          className={cx(
            "inline-flex shrink-0 items-center justify-center rounded-md px-4 py-2 text-xs font-semibold text-white",
            "bg-brand-gradient shadow-card transition-all duration-200 ease-premium",
            "hover:-translate-y-[1px] hover:shadow-card-hover",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/20"
          )}
        >
          View all
        </Link>
      </div>
    </div>
  );
};

export default UseCasesDropdown;
