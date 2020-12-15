const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "Root",
  fields: {
    viewer: {
      type: GraphQLString,
      resolve: async (obj, args, context, info) => {
        return "Hello World!";
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

exports.schema = schema;
