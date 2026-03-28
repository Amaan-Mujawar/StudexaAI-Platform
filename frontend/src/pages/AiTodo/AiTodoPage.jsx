// src/pages/AiTodo/AiTodoPage.jsx

import { useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3 } from "lucide-react";

import useTodos from "../../features/todos/hooks/useTodos.js";

import TodoHeader from "../../features/todos/components/TodoHeader.jsx";
import TodoCreateCard from "../../features/todos/components/TodoCreateCard.jsx";
import AiTodoGeneratorCard from "../../features/todos/components/AiTodoGeneratorCard.jsx";
import TodoSection from "../../features/todos/components/TodoSection.jsx";
import TodoItem from "../../features/todos/components/TodoItem.jsx";
import TodoEmptyState from "../../features/todos/components/TodoEmptyState.jsx";
import TodoSkeleton from "../../features/todos/components/TodoSkeleton.jsx";

import EditTodoModal from "../../features/todos/components/EditTodoModal.jsx";
import DeleteTodoModal from "../../features/todos/components/DeleteTodoModal.jsx";

/* =====================================================
   AiTodoPage (ULTIMATE — FINAL)
   ✅ Fully integrated TodoItem
   ✅ Dedicated Edit & Delete Modals (Professional)
===================================================== */

const containerAnim = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const AiTodoPage = () => {
  const {
    counts,
    ongoingTodos,
    completedTodos,
    loading,
    refreshing,
    err,
    refresh,
    addTodo,
    removeTodo,
    toggleComplete,
    
    editingTodo,
    openEdit,
    closeEdit,
    saveEdit,
    
    deletingTodo,
    setDeletingTodo,

    aiTodos,
    aiLoading,
    generateWithAI,
    createAiNoteFromTodo,
    viewAiNoteFromTodo,
    generatingNoteId,
    launchingQuizId,
    setLaunchingQuizId,
  } = useTodos();

  const handleToggle = useCallback(async (todo) => {
    await toggleComplete(todo);
  }, [toggleComplete]);

  const handleLaunchQuiz = useCallback(async (todo) => {
    if (!todo?._id) return;
    setLaunchingQuizId(todo._id);
    setTimeout(() => setLaunchingQuizId(null), 700);
  }, [setLaunchingQuizId]);

  if (loading) {
    return <TodoSkeleton />;
  }

  return (
    <motion.div
      variants={containerAnim}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <TodoHeader
        total={counts.total}
        ongoing={counts.ongoing}
        completed={counts.completed}
        aiCount={aiTodos.length}
        loading={refreshing || aiLoading}
        error={err}
        onRefresh={() => refresh({ silent: true })}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <TodoCreateCard
            onCreateTodo={addTodo}
            createLoading={refreshing}
          />
        </div>

        <div className="xl:col-span-6">
          <AiTodoGeneratorCard
            onGenerate={generateWithAI}
            onCreateTodo={addTodo}
            loading={aiLoading}
            createLoading={refreshing}
          />
        </div>
      </div>

      {!ongoingTodos.length && !completedTodos.length && !err ? (
        <TodoEmptyState
          title="Your task space is empty"
          description="Add your first todo manually or generate three AI drafts from a study goal."
          secondaryLabel="Refresh"
          onSecondary={() => refresh({ silent: true })}
        />
      ) : null}

      {ongoingTodos.length > 0 && (
        <TodoSection
          title="Ongoing Tasks"
          subtitle={`${ongoingTodos.length} active tasks in progress`}
          rightSlot={
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
              <Clock3 className="h-3.5 w-3.5 text-brand-blue" />
              Stay focused
            </div>
          }
        >
          <div className="space-y-3">
            {ongoingTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                completed={false}
                busy={false}
                generatingNote={generatingNoteId === todo._id}
                launchingQuiz={launchingQuizId === todo._id}
                onToggle={handleToggle}
                onDelete={(t) => setDeletingTodo(t)}
                onEdit={(t) => openEdit(t)}
                onGenerateNote={(t) => createAiNoteFromTodo(t?._id)}
                onViewNote={(t) => viewAiNoteFromTodo(t?._id)}
                onLaunchQuiz={handleLaunchQuiz}
              />
            ))}
          </div>
        </TodoSection>
      )}

      {completedTodos.length > 0 && (
        <TodoSection
          title="Completed Tasks"
          subtitle={`${completedTodos.length} tasks done`}
          rightSlot={
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-muted shadow-card">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue" />
              Great consistency
            </div>
          }
        >
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                completed
                busy={false}
                generatingNote={generatingNoteId === todo._id}
                launchingQuiz={launchingQuizId === todo._id}
                onToggle={handleToggle}
                onDelete={(t) => setDeletingTodo(t)}
                onEdit={(t) => openEdit(t)}
                onGenerateNote={(t) => createAiNoteFromTodo(t?._id)}
                onViewNote={(t) => viewAiNoteFromTodo(t?._id)}
                onLaunchQuiz={handleLaunchQuiz}
              />
            ))}
          </div>
        </TodoSection>
      )}

      {/* Modals */}
      <EditTodoModal
        open={Boolean(editingTodo)}
        todo={editingTodo}
        loading={refreshing}
        onClose={closeEdit}
        onSave={async (updates) => {
          await saveEdit({
            id: editingTodo._id,
            ...updates
          });
        }}
      />

      <DeleteTodoModal
        open={Boolean(deletingTodo)}
        todo={deletingTodo}
        loading={refreshing}
        onClose={() => setDeletingTodo(null)}
        onConfirm={() => removeTodo(deletingTodo?._id)}
      />
    </motion.div>
  );
};

export default AiTodoPage;
