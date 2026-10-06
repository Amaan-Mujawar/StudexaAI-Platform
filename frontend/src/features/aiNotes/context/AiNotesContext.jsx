// src/features/aiNotes/context/AiNotesContext.jsx

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useSidebarHistory } from "../../../context/SidebarHistoryContext.jsx";
import {
  fetchAiNotes,
  generateAiNote,
  deleteAiNote,
  regenerateAiNote,
} from "../services/aiNotes.service.js";
import { normalizeAiNote } from "../utils/aiNotes.utils.js";

/* =====================================================
   AiNotesContext
   ✅ Single source of truth for AI Notes state
   ✅ Uses backend service layer
   ✅ Manages sidebar history integration
   ✅ NO business logic (only state + service calls)
===================================================== */

const AiNotesContext = createContext(null);

export const AiNotesProvider = ({ children }) => {
  const mountedRef = useRef(true);
  const navigate = useNavigate();
  const { setSidebarHistory } = useSidebarHistory();

  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  /* ================= LOAD NOTES ================= */
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAiNotes();
      const list = Array.isArray(data) ? data : [];

      if (!mountedRef.current) return;

      const normalized = list.map(normalizeAiNote);
      setNotes(normalized);

      // Update sidebar history
      setSidebarHistory({
        title: "AI Notes",
        items: normalized.map((note) => ({
          id: note._id,
          title: note.subject,
          subtitle: note.mode,
          timestamp: note.createdAt,
          route: `/dashboard/ai-note?noteId=${note._id}`,
        })),
      });
    } catch (e) {
      if (!mountedRef.current) return;
      const msg = e?.response?.data?.message || e?.message || "Failed to load notes";
      toast.error(msg);
      setNotes([]);
      setSidebarHistory({ title: "AI Notes", items: [] });
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }, [setSidebarHistory]);

  useEffect(() => {
    mountedRef.current = true;
    loadNotes();
    return () => {
      mountedRef.current = false;
    };
  }, [loadNotes]);

  /* ================= SELECT NOTE ================= */
  const selectNote = useCallback((noteId) => {
    setSelectedNoteId(noteId);
  }, []);

  /* ================= GENERATE NOTE ================= */
  const createNote = useCallback(
    async ({ topic, mode }) => {
      const cleanTopic = String(topic || "").trim();
      if (cleanTopic.length < 2) {
        toast.error("Topic must be at least 2 characters");
        return null;
      }

      try {
        setGenerating(true);
        const res = await generateAiNote({
          topic: cleanTopic,
          level: mode || "short",
        });

        const note = normalizeAiNote(res);
        setNotes((prev) => [note, ...prev]);
        setSelectedNoteId(note._id);

        // Update sidebar history
        setSidebarHistory({
          title: "AI Notes",
          items: [note, ...notes].map((n) => ({
            id: n._id,
            title: n.subject,
            subtitle: n.mode,
            timestamp: n.createdAt,
            route: `/dashboard/ai-note?noteId=${n._id}`,
          })),
        });

        toast.success("Notes generated");
        return note;
      } catch (e) {
        toast.error(e?.message || "Failed to generate notes");
        return null;
      } finally {
        setGenerating(false);
      }
    },
    [notes, setSidebarHistory]
  );

  /* ================= DELETE NOTE ================= */
  const removeNote = useCallback(
    async (id) => {
      if (!id) return false;

      try {
        await deleteAiNote(id);
        const updated = notes.filter((n) => n._id !== id);
        setNotes(updated);

        if (selectedNoteId === id) {
          setSelectedNoteId(null);
        }

        // Update sidebar history
        setSidebarHistory({
          title: "AI Notes",
          items: updated.map((n) => ({
            id: n._id,
            title: n.subject,
            subtitle: n.mode,
            timestamp: n.createdAt,
            route: `/dashboard/ai-note?noteId=${n._id}`,
          })),
        });

        toast.success("Note deleted");
        setDeletingNote(null);
        return true;
      } catch (e) {
        const msg = e?.response?.data?.message || e?.message || "Failed to delete note";
        toast.error(msg);
        return false;
      }
    },
    [notes, selectedNoteId, setSidebarHistory]
  );

  /* ================= REGENERATE NOTE ================= */
  const regenerateNote = useCallback(
    async (id) => {
      if (!id) return null;

      try {
        setRegeneratingId(id);
        const res = await regenerateAiNote(id);

        const updated = normalizeAiNote(res);
        const newNotes = notes.map((n) => (n._id === id ? updated : n));
        setNotes(newNotes);

        // Update sidebar history
        setSidebarHistory({
          title: "AI Notes",
          items: newNotes.map((n) => ({
            id: n._id,
            title: n.subject,
            subtitle: n.mode,
            timestamp: n.createdAt,
            route: `/dashboard/ai-note?noteId=${n._id}`,
          })),
        });

        toast.success("Note regenerated");
        return updated;
      } catch (e) {
        toast.error(e?.message || "Failed to regenerate note");
        return null;
      } finally {
        setRegeneratingId(null);
      }
    },
    [notes, setSidebarHistory]
  );

  /* ================= SELECTED NOTE ================= */
  const selectedNote = useMemo(() => {
    return notes.find((n) => n._id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const value = useMemo(
    () => ({
      notes,
      selectedNote,
      selectedNoteId,
      loading,
      generating,
      regeneratingId,
      loadNotes,
      selectNote,
      createNote,
      removeNote,
      regenerateNote,
      deletingNote,
      setDeletingNote,
    }),
    [
      notes,
      selectedNote,
      selectedNoteId,
      loading,
      generating,
      regeneratingId,
      loadNotes,
      selectNote,
      createNote,
      removeNote,
      regenerateNote,
      deletingNote,
      setDeletingNote,
    ]
  );

  return <AiNotesContext.Provider value={value}>{children}</AiNotesContext.Provider>;
};

export default AiNotesContext;
