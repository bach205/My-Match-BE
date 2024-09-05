import * as userService from "../service/userService.js"

const createUser = async (req, res) => {
    try {
        const { code, message } = await userService.createUserDataInUserProfile(req.body)
        res.status(200).json({
            code, message
        })
    } catch ({ code, message }) {
        res.status(500).json({
            code, message
        })
    }
}

export { createUser }