import getPerson from "$lib/person"
import handleError from "$lib/error";
import { authenticatePerson } from "$lib/auth";

const person = async (parent: any, args: any, context: any, info: any) => {
    authenticatePerson(context)
    try {
        let person = await getPerson({ email: args.Email })
        return person
    } catch (error) {
        handleError(error)
    }
}

export { person }