import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import resolvers from './resolvers';
import { DocumentNode, } from 'graphql';
// import schema from './schema';
import { decodeToken } from '$lib/jwt';
import { graphqlUploadExpress } from 'graphql-upload'
import { loadFiles } from 'graphql-import-files';
import { config } from "dotenv";
import path from 'path';

config({ path: path.resolve(process.env.NODE_ENV === 'development' ? '.env.dev' : '.env') });
const dev = process.env.NODE_ENV === 'development'

async function startApolloServer(typeDefs: DocumentNode, resolvers: any) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: async ({ req }) => {
            const token = req.headers.authorization || '';
            let params: any = decodeToken(token)

            if (params?.PersonToken) {
                return { PersonToken: params.PersonToken };
            }
            return {}
        },
        introspection: dev
    });
    app.use(graphqlUploadExpress())
    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

const schema: DocumentNode = loadFiles('**/schema/**/*.{graphql,gql}') as DocumentNode
startApolloServer(schema, resolvers)