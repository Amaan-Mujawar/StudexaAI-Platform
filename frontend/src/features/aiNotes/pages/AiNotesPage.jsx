// src/features/aiNotes/pages/AiNotesPage.jsx

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import { AiNotesProvider } from "../context/AiNotesContext.jsx";
import useAiNotes from "../hooks/useAiNotes.js";
import AiNoteGenerator from "../components/AiNoteGenerator.jsx";
import AiNoteViewer from "../components/AiNoteViewer.jsx";
import DeleteAiNoteModal from "../components/DeleteAiNoteModal.jsx";

/* =====================================================
   AiNotesPage (ULTIMATE — ChatGPT-style)
   ✅ Generator + Viewer in main workspace
   ✅ History lives in sidebar (NOT here)
   ✅ Integrates with dashboard shell perfectly
===================================================== */

const containerAnim = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const AiNotesPageContent = () => {
  const [searchParams] = useSearchParams();
  const {
    selectedNote,
    generating,
    regeneratingId,
    createNote,
    selectNote,
    regenerateNote,
    removeNote,
    notes,
    deletingNote,
    setDeletingNote,
    loading,
  } = useAiNotes();

  // Auto-select note from URL param
  useEffect(() => {
    const noteId = searchParams.get("noteId");
    if (noteId && notes.length > 0) {
      const note = notes.find((n) => n._id === noteId);
      if (note) {
        selectNote(noteId);
      }
    }
  }, [searchParams, notes, selectNote]);

  const handleGenerate = async ({ topic, mode }) => {
    await createNote({ topic, mode });
  };

  const handleRegenerate = async (noteId) => {
    await regenerateNote(noteId);
  };

  const handleDelete = async (note) => {
    setDeletingNote(note);
  };

  return (
    <motion.div
      variants={containerAnim}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div>
        <h1 className="mb-2 text-2xl font-extrabold text-text-title">
          AI Study Notes
        </h1>
        <p className="text-sm font-semibold text-text-muted">
          Generate comprehensive study notes on any topic using AI
        </p>
      </div>

      <AiNoteGenerator onGenerate={handleGenerate} loading={generating} />

      <AiNoteViewer
        note={selectedNote}
        onRegenerate={handleRegenerate}
        onDelete={() => handleDelete(selectedNote)}
        regenerating={regeneratingId === selectedNote?._id}
      />

      <DeleteAiNoteModal
        open={Boolean(deletingNote)}
        note={deletingNote}
        loading={loading}
        onClose={() => setDeletingNote(null)}
        onConfirm={() => removeNote(deletingNote?._id)}
      />
    </motion.div>
  );
};

const AiNotesPage = () => {
  return (
    <AiNotesProvider>
      <AiNotesPageContent />
    </AiNotesProvider>
  );
};

export default AiNotesPage;
