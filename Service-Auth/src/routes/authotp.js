import express from "express"
import * as receiveOtpController from "../controller/receiveOtpController.js"
const router = express.Router();

router.get("/otp/phonenumber", (req, res) => {
    res.send("/otp/phonenumber");
})
router.post('/otp/phonenumber', receiveOtpController.handleReceivePhoneNumber)

router.get("/otp/code", (req, res) => {
    res.send("/otp/code");
})
router.post("/otp/code", receiveOtpController.handleReceiveCode)

export default router;