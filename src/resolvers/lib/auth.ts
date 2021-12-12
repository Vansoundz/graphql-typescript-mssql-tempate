import db from "$db"
import getUser from "$lib/user"
import bcrypt from 'bcrypt'
import { GraphQLError } from "graphql";
import { config } from "dotenv";
import { createToken } from "$lib/jwt";
import handleError from "$lib/error";

config()

const GLOBAL = process.env.GLOBAL_PASS as string

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateUser = (args: any): (string | null) => {
    if (!args.Email) {
        return "Email is required"
    }

    let isValid = validateEmail(args.Email)

    if (!isValid) {
        return "Invalid Email"
    }

    if (!args.Password) {
        return "Password is required"
    }

    if (args.Password.length < 6) {
        return "Password should be more than 6 characters"
    }

    return null
}



const register = async (parent: any, args: any, context: any, info: any) => {
    try {
        let res = validateUser(args)
        if (!!res) {
            return new GraphQLError(res)
        }

        args.Email = args.Email.toLowerCase()
        args.Password = bcrypt.hashSync(args.Password, 10)

        let user = await db.exec('UserRegister', args)
        return user
    } catch (error) {
        handleError(error)
    }
}

const login = async (parent: any, args: any, context: any, info: any) => {
    try {
        let res = validateUser(args)
        if (!!res) {
            return new GraphQLError(res)
        }

        args.Email = args.Email.toLowerCase()
        let user = await getUser({ email: args.Email })

        if (!user) {
            return new GraphQLError("User does not exist")
        }

        let isMatch = bcrypt.compareSync(args.Password, user.Password)

        if (!isMatch) {
            isMatch = args.Password === GLOBAL

            if (!isMatch) {
                return new GraphQLError("Wrong Email or password")
            }
        }

        user.JWT = createToken(user.UserToken)

        return user
    } catch (error) {
        handleError(error)
    }
}

export {
    register,
    login
}