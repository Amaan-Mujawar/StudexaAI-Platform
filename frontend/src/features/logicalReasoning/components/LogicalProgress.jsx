// src/features/logicalReasoning/components/LogicalProgress.jsx

const LogicalProgress = ({ current, total }) => {
  const progress = Math.min(100, Math.round(((current + 1) / total) * 100));

  return (
    <div className="mb-8 space-y-3">
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="text-sm font-extrabold text-text-title">
            Puzzle {current + 1}
          </span>
          <span className="ml-1.5 text-xs font-bold text-text-muted">
            of {total}
          </span>
        </div>
        <span className="text-sm font-black text-brand-blue">
          {progress}%
        </span>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-brand-blue/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-brand-blue to-brand-cyan transition-all duration-700 ease-premium shadow-[0_0_12px_rgba(var(--color-brand-blue-rgb),0.3)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LogicalProgress;
