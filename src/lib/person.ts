import db from "$db"

const getPerson = async (params: { email?: string, username?: string, personId?: number, personToken?: string }) => {
    let person = await db.exec('PersonGet', params)
    return person
}

export default getPerson