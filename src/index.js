const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const mongoose = require("mongoose");
require("dotenv/config");

const PORT = process.env.PORT || 2000;

const gateway = new ApolloGateway();

const server = new ApolloServer({
  gateway,
  cors: {
    origin: ["https://todolist-graphql.vercel.app", "http://localhost:3000"],
  },
  subscriptions: false,
});
mongoose
  .connect(process.env.DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return server.listen({ port: PORT });
  })
  .then(({ url }) => {
    console.log("server is on " + url);
  });
