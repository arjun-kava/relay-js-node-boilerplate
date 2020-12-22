const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} = require("graphql");
const { GraphQLTodoEdge, GraphQLTodo } = require("../nodes");
const { pubSub } = require("../publisher");

const TodoSubscriptions = {
  todoAdded: {
    type: GraphQLTodoEdge,
    subscribe: () => pubSub.asyncIterator("todoAdded"),
  },
  todoUpdated: {
    type: GraphQLTodo,
    subscribe: () => pubSub.asyncIterator("todoUpdated"),
  },
  todoRemoved: {
    type: GraphQLTodo,
    subscribe: () => pubSub.asyncIterator("todoRemoved"),
  },
  todoMarkAll: {
    type: new GraphQLObjectType({
      name: "todoMarkAll",
      fields: {
        complete: { type: GraphQLBoolean },
      },
    }),
    subscribe: () => pubSub.asyncIterator("todoMarkAll"),
  },
  todoRemoveCompleted: {
    type: new GraphQLObjectType({
      name: "todoRemoveCompleted",
      fields: {
        deletedTodoIds: {
          type: new GraphQLList(GraphQLString),
        },
      },
    }),
    subscribe: () => pubSub.asyncIterator("todoRemoveCompleted"),
  },
};
exports.TodoSubscriptions = TodoSubscriptions;
