import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import resolvers from './resolvers';
import { DocumentNode, } from 'graphql';
// import schema from './schema';
// import getUser from './lib';
import { decodeToken } from '$lib/jwt';
import { graphqlUploadExpress } from 'graphql-upload'
import { loadFiles } from 'graphql-import-files';

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

            if (params?.UserToken) {
                // const user = await getUser({ userToken: params.UserToken });
                return { UserToken: params.UserToken };
            }
            return {}
        }
    });
    app.use(graphqlUploadExpress())
    await server.start();
    server.applyMiddleware({ app });
    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

const schema: DocumentNode = loadFiles('**/schema/**/*.{graphql,gql}') as DocumentNode
startApolloServer(schema, resolvers)