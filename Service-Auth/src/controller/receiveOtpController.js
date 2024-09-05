import * as receiveOtpService from "../service/reveiveOtpService.js"

const handleReceivePhoneNumber = async (req, res) => {
    try {
        const { code, message } = await receiveOtpService.handleReceivePhoneNumber({
            ...req.body,
            arriveTime: new Date()
        })
        res.status(200).json({
            code,
            message
        })
    } catch ({ code, message }) {
        res.status(500).json({
            code,
            message
        })
    }
}

const handleReceiveCode = async (req, res) => {
    try {
        const { code, message } = await receiveOtpService.handleReceiveCode({
            ...req.body,
            arriveTime: new Date()
        })
        res.status(200).json({
            code,
            message
        })
    } catch ({ code, message }) {
        res.status(500).json({
            code,
            message
        })
    }
}

export { handleReceivePhoneNumber, handleReceiveCode }