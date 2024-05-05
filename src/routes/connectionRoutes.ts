import express from "express";
import { follow, getConnectionController, unFollow } from "../controller/connectionController";
const router = express.Router();


router.post('/follow',follow);
router.post('/unfollow',unFollow);
router.post('/get-connection',getConnectionController)


export default router;