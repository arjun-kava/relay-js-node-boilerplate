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
const { pubSub } = require("../publisher");

const MarkAllTodosMutation = mutationWithClientMutationId({
  name: "MarkAllTodos",
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    changedTodos: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLTodo)),
      resolve: ({ changedTodos }) => {
        return changedTodos;
      },
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ complete, userId }) => {
    const changedTodos = markAllTodos(complete);

    pubSub.publish("todoMarkAll", {
      todoMarkAll: { complete: complete },
    });

    return { changedTodos, userId };
  },
});

exports.MarkAllTodosMutation = MarkAllTodosMutation;
