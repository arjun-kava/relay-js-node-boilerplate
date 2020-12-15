const { GraphQLString } = require("graphql");
const { GraphQLUser } = require("../nodes");
const { getUserOrThrow } = require("../../data/database");

const UserQuery = {
  type: GraphQLUser,
  args: {
    id: { type: GraphQLString },
  },
  resolve: (root, { id }) => getUserOrThrow(id),
};

exports.UserQuery = UserQuery;
