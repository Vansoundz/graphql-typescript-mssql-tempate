import db from "$db"
import { authenticatePerson } from "$lib/auth"
import handleError from "$lib/error"


const products = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticatePerson(context)
        let products = await db.execList('ProductListGet', args)
        return products
    } catch (error) {
        handleError(error)
    }
}

const product = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticatePerson(context)
        args.personToken = context.PersonToken
        let product = await db.exec('ProductGet', args)
        return product
    } catch (error) {
        handleError(error)
    }
}


const productSave = async (parent: any, args: any, context: any, info: any) => {
    try {
        authenticatePerson(context)
        let params = args.product
        params.personToken = context.PersonToken
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