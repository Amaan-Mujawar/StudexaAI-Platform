// src/features/aiNotes/components/AiNoteHistoryItem.jsx

import cx from "../../../utils/cx.js";
import { formatNoteDate, formatNoteMode } from "../utils/aiNotes.utils.js";

/* =====================================================
   AiNoteHistoryItem
   ✅ Single history item display
   ✅ Used in sidebar history list
===================================================== */

const AiNoteHistoryItem = ({ note, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(note)}
      className={cx(
        "w-full rounded-xl px-2.5 py-2 text-left transition",
        active
          ? "bg-brand-blue/10"
          : "hover:bg-brand-blue/8"
      )}
    >
      <p className="truncate text-[12.5px] font-semibold text-text-title">
        {note.subject}
      </p>
      <p className="truncate text-[11px] font-semibold text-text-muted">
        {formatNoteMode(note.mode)} • {formatNoteDate(note.createdAt)}
      </p>
    </button>
  );
};

export default AiNoteHistoryItem;
