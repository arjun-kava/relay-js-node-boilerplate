const { graphqlHTTP } = require("express-graphql");
const { schema } = require("./schema/schema");
const { app } = require("./app");
require("events").EventEmitter.defaultMaxListeners = 20;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000);
