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

const AddTodoMutation = mutationWithClientMutationId({
  name: "AddTodo",
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todoEdge: {
      type: new GraphQLNonNull(GraphQLTodoEdge),
      resolve: ({ todoId }) => {
        const todo = getTodoOrThrow(todoId);

        return {
          cursor: cursorForObjectInConnection([...getTodos()], todo),
          node: todo,
        };
      },
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ text, userId }) => {
    const todoId = addTodo(text, false);

    return { todoId, userId };
  },
});

exports.AddTodoMutation = AddTodoMutation;
