import { Router } from "express";
import { loadMessage } from "../controller/MessageController.js";

const router = Router();

router.get("/loadmessage", loadMessage);

export default router;