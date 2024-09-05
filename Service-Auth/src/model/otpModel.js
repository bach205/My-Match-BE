import db from "../config/db.js";

/**
 * 
 * @param {string} phoneNumber 
 * @returns 
 * trả về mảng object [{data}] 
 * nếu không có thì trả về mảng rỗng
 */
const getPhoneNumber = (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("otp").where("phoneNumber", phoneNumber)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * @param {string} phoneNumber
 * @param {String} code 
 * @param {Date} expirationTime 
 * @param {Date} updated_at 
 * @returns 
 * trả về số lượng bản ghi được cập nhật thành công
 * nếu không có thì trả về 0
 */
const updatePhoneNumberCode = (phoneNumber, code, expirationTime, updated_at) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("otp")
                .where("phoneNumber", phoneNumber)
                .update({
                    code,
                    expirationTime,
                    updated_at
                })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @param {String} phoneNumber 
 * @param {String} code 
 * @param {Date} expirationTime 
 * @returns 
 * trả về id (cột auto increment)
 */
const createPhoneNumber = (phoneNumber, code, expirationTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("otp").insert({
                phoneNumber,
                code,
                expirationTime
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @param {string} phoneNumber 
 * @param {Date} time 
 * @returns 
 * trả về số lượng trường được cập nhật thành công
 */
const updateCodeExpirationTime = (phoneNumber, time) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("otp").where("phoneNumber", phoneNumber)
                .update({ expirationTime: time })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

export {
    updatePhoneNumberCode,
    createPhoneNumber,
    updateCodeExpirationTime,
    getPhoneNumber,
}