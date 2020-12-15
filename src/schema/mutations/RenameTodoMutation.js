const { mutationWithClientMutationId, fromGlobalId } = require("graphql-relay");
const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");
const { GraphQLTodo } = require("../nodes");
const { getTodoOrThrow, renameTodo, Todo } = require("../../data/database");

const RenameTodoMutation = mutationWithClientMutationId({
  name: "RenameTodo",
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todo: {
      type: new GraphQLNonNull(GraphQLTodo),
      resolve: ({ localTodoId }) => getTodoOrThrow(localTodoId),
    },
  },
  mutateAndGetPayload: ({ id, text }) => {
    const localTodoId = fromGlobalId(id).id;
    renameTodo(localTodoId, text);

    return { localTodoId };
  },
});

exports.RenameTodoMutation = RenameTodoMutation;
