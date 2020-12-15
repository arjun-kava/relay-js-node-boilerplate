const { fromGlobalId, nodeDefinitions } = require("graphql-relay");

const {
  Todo,
  User,
  USER_ID,
  getTodoOrThrow,
  getUserOrThrow,
} = require("../data/database");

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);

    if (type === "Todo") {
      return getTodoOrThrow(id);
    } else if (type === "User") {
      return getUserOrThrow(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

exports.nodeField = nodeField;
exports.nodeInterface = nodeInterface;
