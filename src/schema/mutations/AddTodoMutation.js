const {
  cursorForObjectInConnection,
  mutationWithClientMutationId,
} = require("graphql-relay");

const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");
const { GraphQLTodoEdge, GraphQLUser } = require("../nodes");

const {
  addTodo,
  getTodoOrThrow,
  getTodos,
  getUserOrThrow,
} = require("../../data/database");
const { pubSub } = require("../publisher");

const AddTodoMutation = mutationWithClientMutationId({
  name: "AddTodo",
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todoEdge: {
      type: new GraphQLNonNull(GraphQLTodoEdge),
      resolve: ({ todoEdge }) => {
        return todoEdge;
      },
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ text, userId }) => {
    const todoId = addTodo(text, false);
    const todo = getTodoOrThrow(todoId);

    const todoEdge = {
      cursor: cursorForObjectInConnection([...getTodos()], todo),
      node: todo,
    };

    pubSub.publish("todoAdded", {
      todoAdded: todoEdge,
    });

    return { todoEdge, userId };
  },
});

exports.AddTodoMutation = AddTodoMutation;
