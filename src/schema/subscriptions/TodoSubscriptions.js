const { GraphQLString } = require("graphql");
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
};
exports.TodoSubscriptions = TodoSubscriptions;
