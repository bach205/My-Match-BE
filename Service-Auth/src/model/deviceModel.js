import db from "../config/db.js"
/**
 * 
 * @param {*} fingerPrint 
 * @returns 
 * trả về [] nếu không có trường trong bảng
 * còn có thì trả về [{data}]
 */
const getDeviceFingerPrint = (fingerPrint) => {
    return new Promise(async (resolve, reject) => {
        try {
            const reuslt = await db("device").where("fingerPrint", fingerPrint);
            resolve(reuslt)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @param {string} fingerPrint 
 * @param {BigInt} timesFalse
 * @returns 
 * [id]
 * thường là sẽ trả về cột auto-increment
 * nếu không có thì sẽ trả về mảng rỗng []
 */
const createDeviceFingerPrint = (fingerPrint, timesFalse) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("device").insert({
                fingerPrint: fingerPrint,
                timesFalse: timesFalse
            })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @param {string} fingerPrint 
 * @param {integer} timesFalse 
 * @returns 
 * trả về số trường được update thành công
 */
const updateDeviceTimesFalse = (fingerPrint, timesFalse) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("device").where("fingerPrint", fingerPrint)
                .update({ timesFalse })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @param {string} fingerPrint 
 * @param {integer} increment 
 * @returns 
 * trả về số lượng bản ghi được update
 */
const incrementDeviceTimesFalse = (fingerPrint, increment) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await db("device")
                .where("fingerPrint", fingerPrint)
                .increment("timesFalse", increment)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @param {string} fingerPrint 
 * @param {Date} banTime 
 * @returns 
 * trả về số lượng bản ghi được update
 */
const updateDeviceBanTime = (fingerPrint, banTime) => {
    return new Promise(async (resolve, reject) => {
        const updated_at = new Date()
        try {
            const result = await db("device")
                .where("fingerPrint", fingerPrint)
                .update({ banTime, updated_at })
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

export {
    getDeviceFingerPrint,
    createDeviceFingerPrint,
    updateDeviceTimesFalse,
    incrementDeviceTimesFalse,
    updateDeviceBanTime,
}