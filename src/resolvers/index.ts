import { login, register } from "$res/auth";
import { multipleUpload, singleUpload } from "$res/file";
import { product, products, productSave } from "$res/product";
import { person } from "$res/person";
import { GraphQLUpload } from "graphql-upload";

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        // Profile
        person,
        products,
        product,
    },

    Mutation: {
        // Auth
        register,
        login,

        // Profile
        productSave,

        // File
        singleUpload,
        multipleUpload,
    }
};

export default resolvers