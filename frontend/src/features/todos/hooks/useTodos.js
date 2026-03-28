// src/features/todos/hooks/useTodos.js

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  generateAiTodos,
  generateAiNoteFromTodo,
  fetchAiNoteByTodo,
} from "../api/todos.api.js";

/* =====================================================
   useTodos (ULTIMATE)
   ✅ Single hook controls:
      - fetching
      - create/update/delete
      - AI todo suggestions
      - todo integrations (AI Note)
      - optimistic-safe UX state
   ✅ No feature loss
   ✅ Backend contract preserved
   ✅ Modal-driven workflow (No window.confirm)
===================================================== */

const safeIsoFromLocalInput = (value) => {
  const v = String(value || "").trim();
  if (!v) return null;

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;

  return d.toISOString();
};

const normalizeTodo = (todo) => {
  if (!todo) return todo;

  const completed = Boolean(todo.completed);
  const status =
    typeof todo.status === "string"
      ? todo.status
      : completed
        ? "completed"
        : "ongoing";

  return {
    ...todo,
    completed,
    status,
  };
};

export const useTodos = () => {
  const mountedRef = useRef(true);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [err, setErr] = useState(null);

  /* ---------------- AI Todo State ---------------- */
  const [aiGoal, setAiGoal] = useState("");
  const [aiTodos, setAiTodos] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  /* ---------------- Integrations UX ---------------- */
  const [generatingNoteId, setGeneratingNoteId] = useState(null);
  const [launchingQuizId, setLaunchingQuizId] = useState(null);

  /* ---------------- Modal States ---------------- */
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

  const loadTodos = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      setErr(null);

      const data = await fetchTodos();
      const list = Array.isArray(data) ? data : [];

      if (!mountedRef.current) return;

      setTodos(list.map(normalizeTodo));
    } catch (e) {
      if (!mountedRef.current) return;

      const msg = e?.response?.data?.message || e?.message || "Failed to load tasks";
      setErr(msg);

      if (!silent) toast.error(msg);

      setTodos([]);
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadTodos();
    return () => {
      mountedRef.current = false;
    };
  }, [loadTodos]);

  /* =====================================================
     CRUD ACTIONS
  ===================================================== */

  const addTodo = useCallback(
    async ({ title, priority = "medium", dueAt = null }) => {
      const cleanTitle = String(title || "").trim();
      if (!cleanTitle) {
        toast.error("Task title required");
        return null;
      }

      try {
        const payload = {
          title: cleanTitle,
          priority,
          dueAt: dueAt || null,
        };

        const created = await createTodo(payload);

        toast.success("Task added");
        await loadTodos({ silent: true });

        return created;
      } catch (e) {
        const msg =
          e?.response?.data?.message || e?.message || "Failed to add task";
        toast.error(msg);
        return null;
      }
    },
    [loadTodos]
  );

  const removeTodo = useCallback(
    async (id) => {
      if (!id) return false;

      try {
        await deleteTodo(id);
        toast.success("Task deleted");
        setDeletingTodo(null);
        await loadTodos({ silent: true });
        return true;
      } catch (e) {
        const msg =
          e?.response?.data?.message || e?.message || "Failed to delete task";
        toast.error(msg);
        return false;
      }
    },
    [loadTodos]
  );

  const toggleComplete = useCallback(
    async (todo) => {
      if (!todo?._id) return false;

      if (todo.completed) {
        const input = prompt("Enter new due date (YYYY-MM-DD HH:mm)");
        if (!input) return false;

        const iso = safeIsoFromLocalInput(input);
        if (!iso || new Date(iso) <= new Date()) {
          toast.error("Valid future date required");
          return false;
        }

        try {
          await updateTodo(todo._id, { completed: false, dueAt: iso });
          toast.success("Task marked ongoing");
          await loadTodos({ silent: true });
          return true;
        } catch (e) {
          const msg =
            e?.response?.data?.message || e?.message || "Failed to update task";
          toast.error(msg);
          return false;
        }
      }

      try {
        await updateTodo(todo._id, { completed: true });
        toast.success("Task completed");
        await loadTodos({ silent: true });
        return true;
      } catch (e) {
        const msg =
          e?.response?.data?.message || e?.message || "Failed to update task";
        toast.error(msg);
        return false;
      }
    },
    [loadTodos]
  );

  const openEdit = useCallback((todo) => {
    if (!todo?._id) return;
    setEditingTodo(todo);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingTodo(null);
  }, []);

  const saveEdit = useCallback(
    async ({ id, title, priority, dueAt }) => {
      if (!id) return false;

      const payload = {
        title: String(title || "").trim(),
        priority,
        dueAt: dueAt || null,
      };

      if (!payload.title) {
        toast.error("Task title required");
        return false;
      }

      try {
        await updateTodo(id, payload);
        toast.success("Task updated");
        setEditingTodo(null);
        await loadTodos({ silent: true });
        return true;
      } catch (e) {
        const msg =
          e?.response?.data?.message || e?.message || "Failed to update task";
        toast.error(msg);
        return false;
      }
    },
    [loadTodos]
  );

  /* =====================================================
     AI TODOS
  ===================================================== */

  const generateWithAI = useCallback(async (goalInput) => {
    const goal = String(goalInput ?? aiGoal ?? "").trim();
    if (!goal) {
      toast.error("Enter a goal");
      return null;
    }

    setAiLoading(true);
    setAiTodos([]);
    setAiGoal(goal);

    try {
      const res = await generateAiTodos(goal);

      const todosList = Array.isArray(res?.todos) ? res.todos : [];

      const drafts = todosList.slice(0, 3).map((t) => ({
        title: String(t || "").trim() || "Review today's study plan",
        priority: "medium",
        dueAt: "",
      }));

      while (drafts.length < 3) {
        drafts.push({
          title: "Review today's study plan",
          priority: "medium",
          dueAt: "",
        });
      }

      setAiTodos(drafts);
      toast.success("AI suggestions ready");
      return res;
    } catch (e) {
      toast.error(e?.message || "AI generation failed");
      setAiTodos([]);
      return null;
    } finally {
      setAiLoading(false);
    }
  }, [aiGoal]);

  const removeAiDraft = useCallback((idx) => {
    setAiTodos((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateAiDraft = useCallback((idx, patch) => {
    setAiTodos((prev) => {
      const copy = [...prev];
      const old = copy[idx];
      if (!old) return prev;
      copy[idx] = { ...old, ...(patch || {}) };
      return copy;
    });
  }, []);

  const addAiDraftToTodos = useCallback(
    async (idx) => {
      const draft = aiTodos[idx];
      if (!draft) return;

      const created = await addTodo({
        title: draft.title,
        priority: draft.priority || "medium",
        dueAt: draft.dueAt ? safeIsoFromLocalInput(draft.dueAt) : null,
      });

      if (created) removeAiDraft(idx);
    },
    [aiTodos, addTodo, removeAiDraft]
  );

  /* =====================================================
     TODO → AI NOTE INTEGRATION
  ===================================================== */

  const createAiNoteFromTodo = useCallback(async (todoId) => {
    if (!todoId) return null;

    try {
      setGeneratingNoteId(todoId);
      const res = await generateAiNoteFromTodo(todoId);
      return res;
    } catch (e) {
      toast.error(e?.message || "Failed to generate AI note");
      return null;
    } finally {
      setGeneratingNoteId(null);
    }
  }, []);

  const viewAiNoteFromTodo = useCallback(async (todoId) => {
    if (!todoId) return null;

    try {
      const res = await fetchAiNoteByTodo(todoId);
      return res;
    } catch (e) {
      toast.error(e?.message || "No AI note found");
      return null;
    }
  }, []);

  /* =====================================================
     SELECTORS
  ===================================================== */

  const ongoingTodos = useMemo(
    () => todos.filter((t) => t?.status === "ongoing"),
    [todos]
  );

  const completedTodos = useMemo(
    () => todos.filter((t) => t?.status === "completed"),
    [todos]
  );

  const counts = useMemo(() => {
    return {
      total: todos.length,
      ongoing: ongoingTodos.length,
      completed: completedTodos.length,
    };
  }, [todos.length, ongoingTodos.length, completedTodos.length]);

  /* =====================================================
     PUBLIC API
  ===================================================== */

  return {
    todos,
    ongoingTodos,
    completedTodos,
    counts,
    loading,
    refreshing,
    err,
    refresh: loadTodos,
    addTodo,
    removeTodo,
    toggleComplete,

    // editing / modals
    editingTodo,
    openEdit,
    closeEdit,
    saveEdit,
    deletingTodo,
    setDeletingTodo,

    // AI todo
    aiGoal,
    setAiGoal,
    aiTodos,
    aiLoading,
    generateWithAI,
    updateAiDraft,
    removeAiDraft,
    addAiDraftToTodos,

    // integrations
    generatingNoteId,
    createAiNoteFromTodo,
    viewAiNoteFromTodo,

    launchingQuizId,
    setLaunchingQuizId,
  };
};

export default useTodos;
