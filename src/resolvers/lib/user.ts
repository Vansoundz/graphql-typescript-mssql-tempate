import getUser from "$lib/user"
import handleError from "$lib/error";

const user = async (parent: any, args: any, context: any, info: any) => {
    try {
        let user = await getUser({ email: args.Email })
        return user
    } catch (error) {
        handleError(error)
    }
}

export { user }