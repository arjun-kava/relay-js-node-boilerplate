const { mutationWithClientMutationId, toGlobalId } = require("graphql-relay");
const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { GraphQLUser } = require("../nodes");
const {
  getUserOrThrow,
  removeCompletedTodos,
  User,
} = require("../../data/database");

const RemoveCompletedTodosMutation = mutationWithClientMutationId({
  name: "RemoveCompletedTodos",
  inputFields: {
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedTodoIds: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
      resolve: ({ deletedTodoIds }) => deletedTodoIds,
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ userId }) => {
    const deletedTodoLocalIds = removeCompletedTodos();

    const deletedTodoIds = deletedTodoLocalIds.map(
      toGlobalId.bind(null, "Todo")
    );

    return { deletedTodoIds, userId };
  },
});

exports.RemoveCompletedTodosMutation = RemoveCompletedTodosMutation;
