const express = require("express");
const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const { schema } = require("./schema/schema");

const app = express();
const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

exports.app = app;
exports.server = server;
exports.httpServer = httpServer;
