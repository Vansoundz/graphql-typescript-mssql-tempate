import { AuthenticationError } from "apollo-server-errors";
import { IContext } from "./interface";

const authenticatePerson = (context: IContext) => {
    if (!context.PersonToken) {
        throw new AuthenticationError('Not Authorized')
    }
}

export { authenticatePerson }