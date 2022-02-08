import sql from 'mssql'
import { config } from "dotenv";
import path from 'path';

config({ path: path.resolve(process.env.NODE_ENV === 'development' ? '.env.dev' : '.env') });

const sqlConfig: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.SERVER!,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

const pool: Promise<sql.ConnectionPool> = sql.connect(sqlConfig)

export default pool