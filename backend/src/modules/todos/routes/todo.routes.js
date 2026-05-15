// src/modules/todos/routes/todo.routes.js
import express from "express";
import protect from "../../../middleware/auth.middleware.js";

import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

const router = express.Router();

/*
  All todo routes are protected
  (user must be logged in)
*/
router.use(protect);

/* =====================================================
   /api/todos
===================================================== */
router.route("/").get(getTodos).post(createTodo);

/* =====================================================
   /api/todos/:id
===================================================== */
router.route("/:id").put(updateTodo).delete(deleteTodo);

export default router;
