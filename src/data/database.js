class Todo {
  constructor(id, text, complete) {
    this.id = id;
    this.text = text;
    this.complete = complete;
  }
}
exports.Todo = Todo;

class User {
  constructor(id) {
    this.id = id;
  }
}
exports.User = User;

// Mock authenticated ID
const USER_ID = "me";
exports.USER_ID = USER_ID;

// Mock user database table
const usersById = new Map([[USER_ID, new User(USER_ID)]]);

// Mock todo database table
const todosById = new Map();
const todoIdsByUser = new Map([[USER_ID, []]]);

// Seed initial data
let nextTodoId = 0;
addTodo("Welcome to Zujo Relay Modern Course", true);
addTodo("Share this course", false);

function getTodoIdsForUser(id) {
  return todoIdsByUser.get(id) || [];
}

function addTodo(text, complete) {
  const todo = new Todo(`${nextTodoId++}`, text, complete);
  todosById.set(todo.id, todo);

  const todoIdsForUser = getTodoIdsForUser(USER_ID);
  todoIdsByUser.set(USER_ID, todoIdsForUser.concat(todo.id));

  return todo.id;
}
exports.addTodo = addTodo;

function changeTodoStatus(id, complete) {
  const todo = getTodoOrThrow(id);

  // Replace with the modified complete value
  todosById.set(id, new Todo(id, todo.text, complete));
}
exports.changeTodoStatus = changeTodoStatus;

// Private, for strongest typing, only export `getTodoOrThrow`
function getTodo(id) {
  return todosById.get(id);
}

function getTodoOrThrow(id) {
  const todo = getTodo(id);

  if (!todo) {
    throw new Error(`Invariant exception, Todo ${id} not found`);
  }

  return todo;
}
exports.getTodoOrThrow = getTodoOrThrow;

function getTodos(status = "any") {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);
  const todosForUser = todoIdsForUser.map(getTodoOrThrow);

  if (status === "any") {
    return todosForUser;
  }

  return todosForUser.filter(
    (todo) => todo.complete === (status === "completed")
  );
}
exports.getTodos = getTodos;

// Private, for strongest typing, only export `getUserOrThrow`
function getUser(id) {
  return usersById.get(id);
}

function getUserOrThrow(id) {
  const user = getUser(id);

  if (!user) {
    throw new Error(`Invariant exception, User ${id} not found`);
  }

  return user;
}
exports.getUserOrThrow = getUserOrThrow;

function markAllTodos(complete) {
  const todosToChange = getTodos().filter((todo) => todo.complete !== complete);

  todosToChange.forEach((todo) => changeTodoStatus(todo.id, complete));

  return todosToChange.map((todo) => todo.id);
}
exports.markAllTodos = markAllTodos;

function removeTodo(id) {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);

  // Remove from the users list
  todoIdsByUser.set(
    USER_ID,
    todoIdsForUser.filter((todoId) => todoId !== id)
  );

  // And also from the total list of Todos
  todosById.delete(id);
}
exports.removeTodo = removeTodo;

function removeCompletedTodos() {
  const todoIdsForUser = getTodoIdsForUser(USER_ID);

  const todoIdsToRemove = getTodos()
    .filter((todo) => todo.complete)
    .map((todo) => todo.id);

  // Remove from the users list
  todoIdsByUser.set(
    USER_ID,
    todoIdsForUser.filter((todoId) => !todoIdsToRemove.includes(todoId))
  );

  // And also from the total list of Todos
  todoIdsToRemove.forEach((id) => todosById.delete(id));

  return todoIdsToRemove;
}
exports.removeCompletedTodos = removeCompletedTodos;

function renameTodo(id, text) {
  const todo = getTodoOrThrow(id);

  // Replace with the modified text value
  todosById.set(id, new Todo(id, text, todo.complete));
}
exports.renameTodo = renameTodo;
