const { PubSub } = require("apollo-server-express");
const pubSub = new PubSub();
exports.pubSub = pubSub;
