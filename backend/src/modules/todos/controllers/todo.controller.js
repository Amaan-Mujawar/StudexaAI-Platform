// src/modules/todos/controllers/todo.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import {
  getTodosService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
} from "../services/todo.service.js";

/* =====================================================
   GET ALL TODOS
===================================================== */
export const getTodos = asyncHandler(async (req, res) => {
  const todos = await getTodosService(req.user._id);
  res.json(todos);
});

/* =====================================================
   CREATE TODO
===================================================== */
export const createTodo = asyncHandler(async (req, res) => {
  const todo = await createTodoService(req.user._id, req.body);
  res.status(201).json(todo);
});

/* =====================================================
   UPDATE TODO
===================================================== */
export const updateTodo = asyncHandler(async (req, res) => {
  const updatedTodo = await updateTodoService(
    req.user._id,
    req.params.id,
    req.body
  );
  res.json(updatedTodo);
});

/* =====================================================
   DELETE TODO
===================================================== */
export const deleteTodo = asyncHandler(async (req, res) => {
  const result = await deleteTodoService(req.user._id, req.params.id);
  res.json(result);
});
