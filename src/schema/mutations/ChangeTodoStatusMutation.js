const {
  fromGlobalId,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
} = require("graphql-relay");
const { GraphQLBoolean, GraphQLID, GraphQLNonNull } = require("graphql");
const { GraphQLTodo, GraphQLUser } = require("../nodes");
const {
  changeTodoStatus,
  getTodoOrThrow,
  getUserOrThrow,
  getTodos,
} = require("../../data/database");
const { pubSub } = require("../publisher");

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
      resolve: ({ todo }) => {
        return todo;
      },
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: ({ userId }) => getUserOrThrow(userId),
    },
  },
  mutateAndGetPayload: ({ id, complete, userId }) => {
    const todoId = fromGlobalId(id).id;
    changeTodoStatus(todoId, complete);

    const todo = getTodoOrThrow(todoId);
    const todoEdge = {
      cursor: cursorForObjectInConnection([...getTodos()], todo),
      node: todo,
    };

    pubSub.publish("todoUpdated", {
      todoUpdated: todoEdge,
    });

    return { todo, userId };
  },
});

exports.ChangeTodoStatusMutation = ChangeTodoStatusMutation;
