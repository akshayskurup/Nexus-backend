import express from "express";
import { addPost, editPost, getPost, likePost } from "../controller/postController";
import { authorizeRole, verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.post('/add-post',addPost);
router.get('/get-post',getPost);
router.post('/like-post',likePost);
router.post('/update-post',editPost);

export default router;