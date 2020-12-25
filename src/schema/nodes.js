const {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");

const {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  globalIdField,
} = require("graphql-relay");
const { getTodos, USER_ID } = require("../data/database");
const { nodeInterface } = require("./global.defination");

const GraphQLTodo = new GraphQLObjectType({
  name: "Todo",
  fields: {
    id: globalIdField("Todo"),
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (todo) => todo.text,
    },
    complete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (todo) => todo.complete,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: TodosConnection,
  edgeType: GraphQLTodoEdge,
} = connectionDefinitions({
  name: "Todo",
  nodeType: GraphQLTodo,
});

const GraphQLUser = new GraphQLObjectType({
  name: "User",
  fields: {
    id: globalIdField("User"),
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: () => USER_ID,
    },
    todos: {
      type: TodosConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: "any",
        },
        ...connectionArgs,
      },
      // eslint-disable-next-line flowtype/require-parameter-type
      resolve: (root, { status, after, before, first, last }) => {
        const todos = connectionFromArray([...getTodos(status)], {
          after,
          before,
          first,
          last,
        });
        return todos;
      },
    },
    totalCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: () => getTodos().length,
    },
    completedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: () => getTodos("completed").length,
    },
  },
  interfaces: [nodeInterface],
});

exports.GraphQLTodo = GraphQLTodo;
exports.GraphQLTodoEdge = GraphQLTodoEdge;
exports.GraphQLUser = GraphQLUser;
