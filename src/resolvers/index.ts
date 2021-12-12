import { login, register } from "$res/auth";
import { multipleUpload, singleUpload } from "$res/file";
import { product, products, productSave } from "$res/product";
import { user } from "$res/user";
import { GraphQLUpload } from "graphql-upload";

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        // Profile
        user,
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