import express from "express";
import { addPost, editPost, getPost, likePost, reportPost, savedPost, userPost, userSavedPost } from "../controller/postController";
import { authorizeRole, verifyToken } from "../middleware/verifyToken";
import { addComment, allComments, commentDelete, commentsCount, myComment } from "../controller/commentController";

const router = express.Router();

router.post('/add-post',addPost);
router.get('/get-post',getPost);
router.post('/like-post',likePost);
router.post('/update-post',editPost);
router.post('/report-post',reportPost);
router.post('/save-post',savedPost);
router.get('/get-post/:userId',userPost);
router.get('/get-saved-post/:userId',userSavedPost);


router.post('/add-comment',addComment);
router.get('/my-comment',myComment);
router.get('/get-comments/:postId',allComments);
router.get('/get-comments-count/:postId',commentsCount);
router.post('/delete-comment',commentDelete);

export default router;