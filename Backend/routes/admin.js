const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const upload = require("../middleware/upload");
const decodeToken = require("../middleware/decodeToken");

router.post(
  "/posts",
  decodeToken,
  upload.single("image"),
  adminController.addPost
);

router.put(
  "/edit-post/:postId",
  decodeToken,
  upload.single("image"),
  adminController.editPost
);

router.delete("/posts/:postId", decodeToken, adminController.deletePost);

module.exports = router;
