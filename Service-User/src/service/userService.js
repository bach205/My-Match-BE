import { getPhoneNumber, insertUserProfileData } from "../model/user_profile_model.js"

const createUserDataInUserProfile = (data) => {
    return new Promise(async (resovle, reject) => {
        const profileData = {
            phoneNumber: data.phoneNumber,
            name: data.name,
            gender: data.gender,
            birth: data.birth,
            mbti: data.defineMBTI,
            style: data.communicationStyle,
            academic: data.academic,
            targetGender: data.targetGender,
            targetRelation: data.targetRelation
        }
        try {
            const isPhoneNumberExisted = await getPhoneNumber(profileData.phoneNumber)
            if (isPhoneNumberExisted.length !== 0) {
                resovle({
                    code: 2001,
                    message: "The phone number is already existed"
                })
            } else {
                await insertUserProfileData(profileData)
                resovle({
                    code: 2000,
                    message: "successfully"
                }) // return id
            }
        } catch (error) {
            console.log(error)
            reject({
                code: -2000,
                message: "Internal server Error, fail to create account"
            })
        }
    })
}

export {
    createUserDataInUserProfile
}