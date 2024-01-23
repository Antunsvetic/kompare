import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';

// utils, resolvers and typedefs
import seedDatabase from './utils/seedDatabase';
import resolvers from './graphQL/resolverSetup';
import typeDefs from './graphQL/typeDefs';

dotenv.config();
const PORT = process.env.PORT || 5000;

mongoose.connect(`mongodb://mongo:27017/kompare`)
    .then(() => console.log('DB connected!!'))
    .catch(err => console.log(err));

// seeding database collections for config and cities!
seedDatabase().catch(console.error);

(async (typeDefs, resolvers) => {
    const app = express();
    const httpServer = createServer(app);
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
      });
      await server.start();
      
      app.use(
        '/graphql',
        cors<cors.CorsRequest>({ origin: ['http://localhost:3000', 'http://localhost:5012/graphql'] }),
        express.json(),
        expressMiddleware(server)
      );
      
      await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
      
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
})(typeDefs, resolvers);
