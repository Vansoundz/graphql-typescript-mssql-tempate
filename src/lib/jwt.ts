import { sign, verify, decode } from "jsonwebtoken";
import { config } from "dotenv";

config()

const SECRET = process.env.JWT_SECRET as string

const createToken = (PersonToken: string) => {
    let token = sign({ PersonToken }, SECRET, {
        expiresIn: 24 * 60 * 60 * 1000
    })

    return token
}

const verifyToken = (token: string) => {
    let payload = verify(token, SECRET)
    return payload
}

const decodeToken = (token: string) => {
    let payload = decode(token)
    return payload
}

export {
    createToken,
    verifyToken,
    decodeToken
}