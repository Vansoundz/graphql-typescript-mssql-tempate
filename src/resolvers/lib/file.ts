import db from "$db";
import { authenticateUser } from "$lib/auth";
import { S3 } from "aws-sdk";
import { config } from "dotenv";
import handleError from "$lib/error";
// import { getUserProfile } from "./user";

config();

var s3 = new S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
});


const uploadFile = async (file: any, targetType: string, fileType: string, username: string) => {
    try {
        const location = `${targetType}/${fileType}/${username}/${file.filename}`

        let rsp = await s3.upload({
            Bucket: 'artfollow',
            Key: location,
            Metadata: { filename: file.filename, mimetype: file.mimetype, },
            Body: file.stream,
            ACL: "public-read"
        }).promise()

        return rsp
    } catch (error) {
        throw error
    }
}


const singleUpload = async (parent: any, { file, targetType, fileType, imageType }: any = {}, context: any, info: any) => {
    try {
        authenticateUser(context)
        const { createReadStream, filename, mimetype } = await file;

        // let profile = await getUserProfile(parent, {}, context, info)
        // let username = profile.UserName
        // if (!username) {
        //     username = 'unknown'
        // }

        const stream = createReadStream()

        const location = `${targetType}/${fileType}/${filename}`

        let rsp = await s3.upload({
            Bucket: 'artfollow',
            Key: location,
            Metadata: { filename, mimetype, },
            Body: stream,
            ACL: "public-read"
        }).promise()

        let params = {
            location: rsp.Location,
            key: rsp.Key,
            userToken: context.UserToken,
            targetType,
            fileType,
            imageType
        }

        let id = await db.exec('FileSave', params)
        return id;
    } catch (error: any) {
        handleError(error)
    }

}

const multipleUpload = async (parent: any, { files, targetType, fileType, imageType }: any = {}, context: any, info: any) => {
    try {
        authenticateUser(context)
        let values = await Promise.all(files)
        let streams = values.map((file: any) => ({ ...file, stream: file.createReadStream() }))
        // const { createReadStream, filename, mimetype } = await files;

        // let profile = await getUserProfile(parent, {}, context, info)
        // let username = profile.UserName
        // if (!username) {
        //     username = 'unknown'
        // }

        streams = streams.map((file: any) => uploadFile(file, targetType, fileType, imageType))
        
        let resp = await Promise.all(streams)
        
        let filesParam = resp.map(file => {
            let res = {
                url: file.Location,
                id: file.Key,
                type: fileType
            }

            return res
        })

        let params = {
            location: "",
            key: "",
            userToken: context.UserToken,
            targetType,
            fileType,
            imageType,
            files: filesParam
        }

        let ids = await db.execList('FileSave', params)
        
        return ids;
    } catch (error: any) {
        handleError(error)
    }

}

export { singleUpload, multipleUpload }