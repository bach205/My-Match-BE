import { redisPool } from "../config/redis.js"
import { getDeviceFingerPrint, createDeviceFingerPrint, updateDeviceTimesFalse, incrementDeviceTimesFalse, updateDeviceBanTime } from "../model/deviceModel.js"
import { createPhoneNumber, getPhoneNumber, updateCodeExpirationTime, updatePhoneNumberCode } from "../model/otpModel.js"

/**
 * kiểm tra xem thiết bị có bị ban hay không
 * query vào database để lấy trường có fingerprint của req
 * nếu không có thì là không bị ban và insert fingerprint đó vào database
 * có rồi thì so sánh nếu arriveTime < banTime thì là đang bị ban 
 * @param {*} fingerPrint 
 * @param {*} arriveTime 
 * @returns 
 * trả về thời gian bị ban nếu true
 * còn không bị ban thì trả về false
 */
const isBan = (fingerPrint, arriveTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            const device = await getDeviceFingerPrint(fingerPrint)
            if (device.length === 0) {
                await createDeviceFingerPrint(fingerPrint, 0)
                resolve(false)
            } else {
                if (device[0].banTime) {
                    if (arriveTime < device[0].banTime) {
                        resolve(device[0].banTime)
                    }
                    else resolve(false)
                } else resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * mượn kết nối tới redis từ pool
 * get code ứng với phone number đó 
 * nếu có thì xóa code đó đi
 * rồi thêm code mới
 * nếu không có thì chỉ cần thêm code mới là được
 * @param {string} phoneNumber 
 */
const setCodeFromRedis = async (phoneNumber, code) => {
    const client = await redisPool.acquire()
    const redisResult = await client.get(phoneNumber)
    if (redisResult) {
        await client.del(phoneNumber)
    }
    await client.set(phoneNumber, code, "EX", 30)
    await redisPool.release(client)
}

/**
 * kiểm tra xem trong database có 
 * thông tin về phone number đó chưa
 * nếu có rồi thì thay code với expiration mới
 * không thì insert trường mới
 * @param {string} phoneNumber 
 * @param {string} code 
 * @param {Date} expirationTime 
 */
const setCodeFromDatabase = async (phoneNumber, code, expirationTime) => {
    const updated_at = new Date()
    const isPhoneNumberExisted = await updatePhoneNumberCode(phoneNumber, code, expirationTime, updated_at) //isPhoneNumber = 1 || 0
    if (!isPhoneNumberExisted) {
        await createPhoneNumber(phoneNumber, code, expirationTime)
    }
}

/**
 * kiểm tra xem thiết bị có bị ban không
 * nếu không bị ban thì kiểm tra trong redis có lưu code otp của số điện thoại này chưa
 * nếu redis bị hỏng thì kiểm tra trong database
 * nếu chưa có thì tạo code mới và lưu với key là số điện thoại ở trong redis cũng như lưu trữ log vào database
 * nếu có rồi thì xóa code cũ rồi thêm code mới vào redis và log lại vào trong database
 * rồi gửi sms
 * 
 * @param {*} data 
 * @returns 
 * {code,message}
 */
const handleReceivePhoneNumber = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const isBanned = await isBan(data.fingerPrint, data.arriveTime)
            if (!isBanned) {
                const code = "123456"
                const expirationTime = new Date(new Date().getTime() + 30 * 1000)
                let isRedisConnected = false;
                try {
                    await setCodeFromRedis(data.phoneNumber, code)
                    isRedisConnected = true;
                    await setCodeFromDatabase(data.phoneNumber, code, expirationTime)
                    const sendCode = null;
                    resolve({
                        code: 1002,
                        message: "OTP is sending in SMS"
                    })
                } catch (e) {
                    if (!isRedisConnected) {
                        try {
                            await setCodeFromDatabase(data.phoneNumber, code, expirationTime)
                            const sendCode = null;
                            resolve({
                                code: 1002,
                                message: "OTP is sending in SMS",
                            })
                        } catch (e) {
                            throw new Error(e)
                        }
                    } else throw new Error(e)
                }
            } else {
                resolve({
                    code: 1003,// bị ban
                    message: `You are sending too many request, please wait till ${isBanned} to continue`
                })
            }
        } catch (e) {
            reject({
                code: -1001,
                message: "Internal server error"
            })
        }
    })
}

/**
 * kiểm tra thiết bị có bị ban không
 * nếu không thì kiểm tra code trong redis
 * nếu mất kết nối với redis thì vào database
 * nếu đúng code thì reset timesFalse = 0
 * nếu sai thì timesFalse++
 * nếu timesFalse >=5 thì bị ban
 * @param {*} data 
 * @returns 
 * {code,message}
 */
const handleReceiveCode = data => {
    return new Promise(async (resolve, reject) => {
        try {
            const isBanned = await isBan(data.fingerPrint, data.arriveTime)
            if (!isBanned) {
                let incermentTimesFalse = true;
                let isRedisConnected = false;
                let client
                try {
                    client = await redisPool.acquire()
                    const codeOTP = await client.get(data.phoneNumber)
                    if (codeOTP && data.code === codeOTP) {
                        incermentTimesFalse = false;
                        client.del(data.phoneNumber)
                        isRedisConnected = true
                        await updateDeviceTimesFalse(data.fingerPrint, 0)
                        await updateCodeExpirationTime(data.phoneNumber, data.arriveTime)
                        resolve({
                            code: 1000,
                            message: "Verify success"
                        })
                    }
                } catch (e) {
                    if (!isRedisConnected) {
                        try {
                            const result = await getPhoneNumber(data.phoneNumber)
                            if (result.length !== 0 && result[0].code === data.code && result[0].expirationTime > data.arriveTime) {
                                incermentTimesFalse = false;
                                resolve({
                                    code: 1000,
                                    message: "Verify success"
                                })
                                await updateDeviceTimesFalse(data.fingerPrint, 0)
                                await updateCodeExpirationTime(data.phoneNumber, data.arriveTime)
                            }
                        } catch (e) {
                            incermentTimesFalse = false
                            console.log(e)
                            reject({
                                code: -1003,
                                message: "Internal server error"
                            })
                        }
                    } else {
                        console.log(e)
                        incermentTimesFalse = false
                        reject({
                            code: -1003,
                            message: "Internal server error"
                        })
                    }
                } finally {
                    if (incermentTimesFalse) {
                        try {
                            await incrementDeviceTimesFalse(data.fingerPrint, 1)
                            const result = await getDeviceFingerPrint(data.fingerPrint)
                            if (result[0]?.timesFalse >= 5) {
                                const banTime = new Date(data.arriveTime.getTime() + (result[0]?.timesFalse - 4) * 15 * 60 * 1000)
                                await updateDeviceBanTime(data.fingerPrint, banTime)
                                resolve({
                                    code: 1003,
                                    message: `You are sending too many request, please wait till ${banTime} to continue`,
                                })
                            } else {
                                resolve({
                                    code: 1004,
                                    message: "Your code is wrong please try again"
                                })
                            }
                        } catch (e) {
                            console.log('Lỗi khong xac nhan duoc otp:', err);
                            reject({
                                code: -1003,
                                message: "Internal server error"
                            })
                        }
                    }
                    if (client) await redisPool.release(client)
                }
            }
            else {
                resolve({
                    code: 1003,// bị ban
                    message: `You are sending too many request, please wait till ${isBanned} to continue`
                })
            }
        } catch (e) {
            console.log(e)
            reject({
                code: -1003,
                message: "Internal server error"
            })
        }
    })
}

export {
    handleReceivePhoneNumber,
    handleReceiveCode
}