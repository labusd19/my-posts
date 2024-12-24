const express = require("express");
const postController = require("../controllers/posts");
const router = express.Router();
const decodeToken = require("../middleware/decodeToken");

router.get("/posts", postController.getPosts);
router.get("/posts/:postId", postController.getPost);
router.get("/my-posts", decodeToken, postController.getMyPosts);
router.get("/categories", postController.getCategories);

module.exports = router;
