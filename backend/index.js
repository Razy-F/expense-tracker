import express from "express";
import http from "http";
import cors from "cors";
import colors from "colors";
import "dotenv/config";
import env from "./utils/validateEnv.js";
import passport from "passport";
import session from "express-session";
import ConnectMongo from "connect-mongodb-session";
import { ApolloServer } from "@apollo/server";

import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";

import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

configurePassport();
const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongo(session);

const store = new MongoDBStore({
  uri: env.MONGO_DB,
  collection: "sessions",
  databaseName: "Expense_tracker",
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/graphql",
  cors({
    origin: env.ORIGIN_URL,
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    //context is basically an object that's shared across all resolvers and we get it as the third argument (parent, argumant, context)
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`.cyan.dim);
