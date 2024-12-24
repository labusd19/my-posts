const { Post } = require("../models");
const { Image } = require("../models");
const { Category } = require("../models");

//Getting all posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Image,
          attributes: ["imagePath"],
        },
      ],
    });

    const postsWithImagePath = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.Image ? post.Image.imagePath : null,
        userId: post.userId,
        categoryId: post.categoryId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
    res.status(200).json(postsWithImagePath);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Greska pri dobavljanju postova" });
  }
};

// Get one post
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: Image,
          attributes: ["imagePath"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const postWithImagePath = {
      id: post.id,
      title: post.title,
      content: post.content,
      imagePath: post.Image ? post.Image.imagePath : null,
      userId: post.userId,
      categoryId: post.categoryId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    res.status(200).json(postWithImagePath);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Greska pri dobavljanju posta" });
  }
};

exports.getMyPosts = async (req, res, next) => {
  const userId = req.user.userId;
  const userRole = req.user.role; // Pretpostavljamo da je role dostupan u req.user

  console.log("User ID: ", userId);
  console.log("User Role: ", userRole);

  try {
    const queryOptions = {
      include: [
        {
          model: Image,
          attributes: ["imagePath"],
        },
      ],
    };

    if (userRole !== 1) {
      queryOptions.where = { userId: userId };
    }

    const posts = await Post.findAll(queryOptions);

    const postsWithImagePath = posts.map((post) => {
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.Image ? post.Image.imagePath : null,
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    res.status(200).json(postsWithImagePath);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching posts" });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: " Failed to fetch categories" });
  }
};
