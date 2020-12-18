const { mutationWithClientMutationId, fromGlobalId } = require("graphql-relay");
const { GraphQLID, GraphQLNonNull } = require("graphql");
const { GraphQLUser } = require("../nodes");
const {
  getUserOrThrow,
  removeTodo,
  User,
  getTodoOrThrow,
} = require("../../data/database");
const { pubSub } = require("../publisher");

const RemoveTodoMutation = mutationWithClientMutationId({
  name: "RemoveTodo",
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedTodoId: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ id }) => id,
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ id, userId }) => {
    const localTodoId = fromGlobalId(id).id;
    const todo = getTodoOrThrow(localTodoId);
    removeTodo(localTodoId);

    pubSub.publish("todoRemoved", {
      todoRemoved: todo,
    });

    return { id, userId };
  },
});

exports.RemoveTodoMutation = RemoveTodoMutation;
