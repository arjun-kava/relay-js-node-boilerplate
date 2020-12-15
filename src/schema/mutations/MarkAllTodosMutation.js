const { mutationWithClientMutationId } = require("graphql-relay");
const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const { GraphQLTodo, GraphQLUser } = require("../nodes");

const {
  getTodoOrThrow,
  getUserOrThrow,
  markAllTodos,
} = require("../../data/database");

const MarkAllTodosMutation = mutationWithClientMutationId({
  name: "MarkAllTodos",
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    changedTodos: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLTodo)),
      resolve: ({ changedTodoIds }) =>
        changedTodoIds.map((todoId) => getTodoOrThrow(todoId)),
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ complete, userId }) => {
    const changedTodoIds = markAllTodos(complete);

    return { changedTodoIds, userId };
  },
});

exports.MarkAllTodosMutation = MarkAllTodosMutation;
