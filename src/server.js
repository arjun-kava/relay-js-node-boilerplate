const { httpServer, server } = require("./app");
require("events").EventEmitter.defaultMaxListeners = 2000000;

httpServer.listen({ port: process.env.SERVER_PORT }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${process.env.SERVER_PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${process.env.SERVER_PORT}${server.subscriptionsPath}`
  );
});
