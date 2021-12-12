import { AuthenticationError } from "apollo-server-errors";
import { IContext } from "./interface";

const authenticateUser = (context: IContext) => {
    if (!context.UserToken) {
        throw new AuthenticationError('Not Authorized')
    }
}

export { authenticateUser }