import { GraphQLError } from "graphql"

const handleError = (error: any) => {
    throw new GraphQLError(error.message)
}

export default handleError