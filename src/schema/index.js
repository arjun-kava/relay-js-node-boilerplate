const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const { nodeField } = require("./global.defination");
const { UserQuery } = require("./queries/UserQuery");
const { AddTodoMutation } = require("./mutations/AddTodoMutation");
const {
  ChangeTodoStatusMutation,
} = require("./mutations/ChangeTodoStatusMutation");
const { MarkAllTodosMutation } = require("./mutations/MarkAllTodosMutation");
const {
  RemoveCompletedTodosMutation,
} = require("./mutations/RemoveCompletedTodosMutation");
const { RemoveTodoMutation } = require("./mutations/RemoveTodoMutation");
const { RenameTodoMutation } = require("./mutations/RenameTodoMutation");
const { TodoSubscriptions } = require("./subscriptions/TodoSubscriptions");

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: UserQuery,
    node: nodeField,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTodo: AddTodoMutation,
    changeTodoStatus: ChangeTodoStatusMutation,
    markAllTodos: MarkAllTodosMutation,
    removeCompletedTodos: RemoveCompletedTodosMutation,
    removeTodo: RemoveTodoMutation,
    renameTodo: RenameTodoMutation,
  },
});

const Subscription = new GraphQLObjectType({
  name: "Subscription",
  fields: {
    ...TodoSubscriptions,
  },
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});
exports.schema = schema;
