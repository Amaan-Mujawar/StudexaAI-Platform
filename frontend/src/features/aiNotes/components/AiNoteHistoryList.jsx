// src/features/aiNotes/components/AiNoteHistoryList.jsx

import AiNoteHistoryItem from "./AiNoteHistoryItem.jsx";

/* =====================================================
   AiNoteHistoryList
   ✅ Renders list of AI note history items
   ✅ Used in sidebar (NOT in page body)
===================================================== */

const AiNoteHistoryList = ({ notes, selectedNoteId, onSelectNote }) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white/70 px-3 py-3 shadow-card">
        <p className="text-xs font-extrabold text-text-title">
          No notes yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {notes.slice(0, 24).map((note) => (
        <AiNoteHistoryItem
          key={note._id}
          note={note}
          active={selectedNoteId === note._id}
          onClick={onSelectNote}
        />
      ))}
    </div>
  );
};

export default AiNoteHistoryList;
