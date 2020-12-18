const { GraphQLTodoEdge } = require("../nodes");
const { pubSub } = require("../publisher");

const TodoSubscriptions = {
  todoAdded: {
    type: GraphQLTodoEdge,
    subscribe: () => pubSub.asyncIterator("todoAdded"),
  },
  todoUpdated: {
    type: GraphQLTodoEdge,
    subscribe: () => pubSub.asyncIterator("todoUpdated"),
  },
  todoRemoved: {
    type: GraphQLTodoEdge,
    subscribe: () => pubSub.asyncIterator("todoRemoved"),
  },
};
exports.TodoSubscriptions = TodoSubscriptions;
