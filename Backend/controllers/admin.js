const path = require("path");
const fs = require("fs");

const { Image } = require("../models");
const { Post } = require("../models");
const { sequelize } = require("../models");

// Add post method
exports.addPost = async (req, res, next) => {
  const { title, content } = req.body;
  const userId = req.user.userId;
  const t = await sequelize.transaction();

  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded!" });
  }

  const imagePath = `/images/${req.file.filename}`;

  try {
    const newImage = await Image.create(
      {
        imagePath: imagePath,
      },
      { transaction: t }
    );

    const newPost = await Post.create(
      {
        title: title,
        content: content,
        imageId: newImage.dataValues.id,
        userId: userId,
      },
      { transaction: t }
    );

    await t.commit();
    return res
      .status(201)
      .json({ message: "Post created successfully!", newPost });
  } catch (error) {
    await t.rollback();
    console.error("Error during addPost: ", error);
    return res.status(500).json({ message: "Something went wrong!", error });
  }
};

// Edit post method
exports.editPost = async (req, res, next) => {
  const postId = req.params.postId;
  const { title, content, image } = req.body;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== 1 && post.userId !== req.user.userId) {
      return res
        .status(401)
        .json({ message: "This post doesn't belong to you!" });
    }
    if (req.file) {
      var imagePath = `/images/${req.file.filename}`;
      var newImage = await Image.create({
        imagePath: imagePath,
      });
      console.log("image path: ", imagePath);
    }

    const oldImage = await Image.findByPk(post.imageId);

    const oldImagePath = path.join(__dirname, "..", oldImage.imagePath);

    if (title) post.title = title;
    if (content) post.content = content;
    if (req.file) {
      post.imageId = newImage.id;
    }

    await post.save();

    if (req.file) {
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully:", oldImagePath);
        }
      });
      await oldImage.destroy();
    }

    return res.status(200).json({ message: "Post updated!", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Editing post failed" });
  }
};

// Delete post method
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    if (post.userId !== req.user.userId && req.user.role !== 1) {
      return res
        .status(401)
        .json({ message: "This post doesn't belong to you!" });
    }

    const myImage = await Image.findByPk(post.imageId);
    if (!myImage) {
      console.log("Image not found for post:", post.imageId);
    }

    const imagePath = myImage
      ? path.join(__dirname, "..", myImage.imagePath)
      : null;

    await post.destroy();

    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully:", imagePath);
        }
      });
      await myImage.destroy();
    }

    return res.status(200).json({ message: "Post successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Deleting post failed" });
    console.log(error);
  }
};
