// src/utils/autoCompleteOverdueTodos.js
import Todo from "../modules/todos/models/Todo.js";

const autoCompleteOverdueTodos = async (userId) => {
  const now = new Date();

  await Todo.updateMany(
    {
      user: userId,
      completed: false,
      dueAt: { $ne: null, $lt: now },
    },
    {
      $set: {
        completed: true,
        dueAt: null, // also clear due date
      },
    }
  );
};

export default autoCompleteOverdueTodos;
