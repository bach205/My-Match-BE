import express from "express"
import * as userController from "../controller/userController.js"

const router = express.Router();

router.get("/post/createuser", (req, res) => {
    res.send("/post/createuser");
})

router.post("/post/createuser", userController.createUser)

export default router;