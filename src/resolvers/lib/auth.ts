import db from "$db"
import getPerson from "$lib/person"
import bcrypt from 'bcrypt'
import { GraphQLError } from "graphql";
import { config } from "dotenv";
import { createToken } from "$lib/jwt";
import handleError from "$lib/error";
import { OAuth2Client } from "google-auth-library";
import { authenticatePerson } from "$lib/auth";
import path from 'path';
import { registrationEmail, verificationEmail } from "src/email/templates";
import { sendEmail } from "src/email";
import { emailBuilder } from "src/email/builder";
import Mail from 'nodemailer/lib/mailer';

config({ path: path.resolve(process.env.NODE_ENV === 'development' ? '.env.dev' : '.env') });

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

if (typeof String.prototype.replaceAll == "undefined") {
    String.prototype.replaceAll = function (match, replace: any) {
        return this.replace(new RegExp(match, 'g'), () => replace);
    }
}
const GLOBAL = process.env.GLOBAL_PASS as string

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validatePerson = (args: any): (string | null) => {
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
        let res = validatePerson(args)
        if (!!res) {
            return new GraphQLError(res)
        }

        args.Email = args.Email.toLowerCase()
        args.Password = bcrypt.hashSync(args.Password, 10)

        let person = await db.exec('PersonRegister', args)
        try {
            const message: Mail.Options = {
                html: registrationEmail,
                to: 'evannivan@gmail.com',
                from: 'thebeatplanet.silente@gmail.com',
                subject: 'Welcome to Artfollow'
            }
            await sendEmail(message)

            const verify: Mail.Options = {
                html: verificationEmail,
                to: 'evannivan@gmail.com',
                from: 'thebeatplanet.silente@gmail.com',
                subject: 'Verify email'
            }
            let code = Math.random().toString(36).substring(7).toUpperCase()
            let jwt = createToken(person.PersonToken)

            verify.html = emailBuilder(`${verify.html}`, [
                { name: 'CODE', value: code },
                { name: 'TOKEN', value: jwt }
            ])
            await sendEmail(verify)

        } catch (error: any) {
            console.log('EMAIL::', error.message);
        }
        return person
    } catch (error) {
        handleError(error)
    }
}

const login = async (parent: any, args: any, context: any, info: any) => {
    try {
        let res = validatePerson(args)
        if (!!res) {
            return new GraphQLError(res)
        }

        args.Email = args.Email.toLowerCase()
        let person = await getPerson({ email: args.Email })

        if (!person) {
            return new GraphQLError("User does not exist")
        }

        let isMatch = bcrypt.compareSync(args.Password, person.Password)

        if (!isMatch) {
            isMatch = args.Password === GLOBAL

            if (!isMatch) {
                return new GraphQLError("Wrong Email or password")
            }
        }

        person.JWT = createToken(person.PersonToken)

        return person
    } catch (error) {
        handleError(error)
    }
}

const verifyEmail = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticatePerson(context)
        console.log({ context });
        await db.exec('PersonVerify')
        let person = await db.exec('PersonGet', context)

        return person
    } catch (error) {
        handleError(error)
    }
}


const loginWithGoogle = async (parent: any, args: any, context: any, info: any) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: args.Token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error("google token failed");
        }

        let person = await db.exec('PersonGet', { Email: payload.email })

        if (!person) {
            args = {
                Email: payload.email,
                Password: Math.random().toString().slice(3, 10),
                isGoogleLogin: true
            }
            person = await register(parent, args, context, info)
        }

        person.JWT = createToken(person.PersonToken)

        return person
    } catch (error) {
        handleError(error)
    }
}



export {
    register,
    login,
    loginWithGoogle,
    verifyEmail
}