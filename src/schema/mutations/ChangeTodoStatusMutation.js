const { fromGlobalId, mutationWithClientMutationId } = require("graphql-relay");
const { GraphQLBoolean, GraphQLID, GraphQLNonNull } = require("graphql");
const { GraphQLTodo, GraphQLUser } = require("../nodes");
const {
  changeTodoStatus,
  getTodoOrThrow,
  getUserOrThrow,
} = require("../../data/database");

const ChangeTodoStatusMutation = mutationWithClientMutationId({
  name: "ChangeTodoStatus",
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todo: {
      type: new GraphQLNonNull(GraphQLTodo),
      resolve: ({ todoId }) => getTodoOrThrow(todoId),
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ id, complete, userId }) => {
    const todoId = fromGlobalId(id).id;
    changeTodoStatus(todoId, complete);

    return { todoId, userId };
  },
});

exports.ChangeTodoStatusMutation = ChangeTodoStatusMutation;
