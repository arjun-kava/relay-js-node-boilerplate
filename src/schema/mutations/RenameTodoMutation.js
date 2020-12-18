const {
  mutationWithClientMutationId,
  fromGlobalId,
  cursorForObjectInConnection,
} = require("graphql-relay");
const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");
const { GraphQLTodo } = require("../nodes");
const {
  getTodoOrThrow,
  renameTodo,
  Todo,
  getTodos,
} = require("../../data/database");
const { pubSub } = require("../publisher");

const RenameTodoMutation = mutationWithClientMutationId({
  name: "RenameTodo",
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todo: {
      type: new GraphQLNonNull(GraphQLTodo),
      resolve: ({ todo }) => {
        return todo;
      },
    },
  },
  mutateAndGetPayload: ({ id, text }) => {
    const localTodoId = fromGlobalId(id).id;
    renameTodo(localTodoId, text);

    const todo = getTodoOrThrow(localTodoId);
    const todoEdge = {
      cursor: cursorForObjectInConnection([...getTodos()], todo),
      node: todo,
    };

    pubSub.publish("todoUpdated", {
      todoUpdated: todoEdge,
    });

    return { todo };
  },
});

exports.RenameTodoMutation = RenameTodoMutation;
