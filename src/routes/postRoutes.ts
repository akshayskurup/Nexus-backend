import express from "express";
import { addPost, deletePost, editPost, getOnePost, getPost, likePost, reportPost, savedPost, userPost, userSavedPost } from "../controller/postController";
import { authorizeRole, verifyToken } from "../middleware/verifyToken";
import { addComment, allComments, commentDelete, commentsCount, myComment, replyComment } from "../controller/commentController";

const router = express.Router();

router.post('/add-post',verifyToken,addPost);
router.get('/get-post',verifyToken,getPost);
router.post('/like-post',verifyToken,likePost);
router.post('/update-post',editPost);
router.delete('/delete-post/:postId',verifyToken,deletePost);
router.post('/report-post',verifyToken,reportPost);
router.post('/save-post',verifyToken,savedPost);
router.get('/get-post/:userId',userPost);
router.get('/get-saved-post/:userId',userSavedPost);
router.get('/find-post/:postId',getOnePost);


router.post('/add-comment',addComment);
router.get('/my-comment',myComment);
router.get('/get-comments/:postId',allComments);
router.get('/get-comments-count/:postId',commentsCount);
router.post('/reply-comment',replyComment);
router.post('/delete-comment',commentDelete);

export default router;