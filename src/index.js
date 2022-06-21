const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");

require("dotenv/config");

const PORT = process.env.PORT || 2000;

const gateway = new ApolloGateway();

const server = new ApolloServer({
  gateway,
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
