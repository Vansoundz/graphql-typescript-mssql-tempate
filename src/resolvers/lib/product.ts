import db from "$db"
import { authenticateUser } from "$lib/auth"
import handleError from "$lib/error"


const products = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticateUser(context)
        let products = await db.execList('ProductListGet', args)
        return products
    } catch (error) {
        handleError(error)
    }
}

const product = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticateUser(context)
        args.userToken = context.UserToken
        let product = await db.exec('ProductGet', args)
        return product
    } catch (error) {
        handleError(error)
    }
}


const productSave = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticateUser(context)
        let params = args.product
        params.userToken = context.UserToken
        let product = await db.exec('ProductSave', params)
        return product
    } catch (error) {
        handleError(error)
    }
}


export {
    product,
    products,
    productSave
}