import { ApolloServer } from "apollo-server";
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";
import { getUid } from "./firebasej/authMiddleware.js";
import "dotenv/config";
const todoUrl = process.env.TODO_URL;
const detailUrl = process.env.DETAIL_URL;
const PORT = process.env.PORT || 2000;

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "detail", url: detailUrl },
      { name: "todo", url: todoUrl },
    ],
  }),
  buildService: ({ url }) => {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set("X-Uid", context.xUid ? context.xUid : null);
        request.http.headers.set("X-Email", context.XEmail ? context.XEmail : null);
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: async ({ req }) => {
    try {
      let user = await getUid(req?.headers?.authorization);

      if (!user) {
        throw new AuthenticationError("Unauthourised Access");
      }

      return {
        xUid: user.uid,
        XEmail: user.email,
      };
    } catch (error) {
      console.log({ error });
    }
  },
  cors: {
    origin: ["https://todolist-graphql.vercel.app", "https://details-idea.herokuapp.com/"],
  },
});

server
  .listen({ port: PORT })
  .then(({ url }) => {
    console.log("server is on " + url);
  })
  .catch((err) => {
    console.log(err.message);
  });
