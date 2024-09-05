import db from "../config/db.js";

const getPhoneNumber = (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("user_profile")
                .where("phoneNumber", phoneNumber)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

const insertUserProfileData = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("user_profile")
                .insert(data)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

export {
    getPhoneNumber,
    insertUserProfileData,
}