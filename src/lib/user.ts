import db from "$db"

const getUser = async (params: { email?: string, username?: string, userId?: number, userToken?: string }) => {
    let user = await db.exec('UserGet', params)
    return user
}

export default getUser