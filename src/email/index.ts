import { createTransport } from 'nodemailer'
import { config } from "dotenv";
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import { emailBuilder } from './builder';
import constants from 'src/constants';

config({ path: path.resolve(process.env.NODE_ENV === 'development' ? '.env.dev' : '.env') })

console.log(process.env.EMAIL, process.env.PASSWORD);

const transport = createTransport(
    {
        service: "gmail",
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
)

const sendEmail = async (message: Mail.Options) => {
    message.html = emailBuilder(`${message.html}`, [
        { name: 'LOGO', value: constants.logo },
        { name: 'LINK', value: constants.link },
    ])

    return new Promise((resolve, reject) => {
        transport.sendMail(message, (err, info) => {
            if (err) {
                return reject(err)
            }
            return resolve(info.response)
        })
    })
}

export { sendEmail }