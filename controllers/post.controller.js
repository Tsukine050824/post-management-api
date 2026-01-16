// controllers/post.controller.js
const fs = require("fs");
const path = require("path");
const Post = require("../models/post.model");
const postEvent = require("../events/postEvents");

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    const newPost = new Post({
      title,
      content,
      category,
      thumbnail,
      author: req.user.id,
    });

    const savedPost = await newPost.save();
    postEvent.emit("post:created", { userId: req.user.id, title });
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error in createPost:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  const { page = 1, limit = 10, sortBy = "createdAt", category } = req.query;
  const filter = {};

  if (category) filter.category = category;

  try {
    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);
    const posts = await Post.find(filter)
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate("author", "username");

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // ✅ Chỉ cho phép author gốc sửa
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa bài viết này" });
    }

    // ✅ Cập nhật
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    // Nếu có file mới (multer) thì cập nhật thumbnail path và xoá file cũ sau khi lưu
    const oldThumbnail = post.thumbnail;
    if (req.file) {
      post.thumbnail = req.file.path;
    }

    const updatedPost = await post.save();

    // Xoá file cũ (nếu có) nhưng chỉ khi khác file mới
    try {
      if (req.file && oldThumbnail && oldThumbnail !== updatedPost.thumbnail) {
        const uploadsDir = path.join(process.cwd(), "uploads");
        const candidate = path.isAbsolute(oldThumbnail)
          ? oldThumbnail
          : path.join(process.cwd(), oldThumbnail);
        const normalized = path.normalize(candidate);
        if (normalized.startsWith(uploadsDir)) {
          fs.unlink(normalized, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error("Failed to delete old thumbnail:", err);
            }
          });
        } else {
          console.warn("Skipping deletion of non-uploads file:", oldThumbnail);
        }
      }
    } catch (e) {
      console.error("Error while deleting old thumbnail:", e);
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });

    // ✅ Chỉ cho phép author gốc xoá
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá bài viết này" });
    }

    // Xoá file thumbnail nếu có
    try {
      if (post.thumbnail) {
        const uploadsDir = path.join(process.cwd(), "uploads");
        const candidate = path.isAbsolute(post.thumbnail)
          ? post.thumbnail
          : path.join(process.cwd(), post.thumbnail);
        const normalized = path.normalize(candidate);
        if (normalized.startsWith(uploadsDir)) {
          fs.unlink(normalized, (err) => {
            if (err && err.code !== "ENOENT") {
              console.error("Failed to delete thumbnail on post delete:", err);
            }
          });
        } else {
          console.warn(
            "Skipping deletion of non-uploads file on post delete:",
            post.thumbnail
          );
        }
      }
    } catch (e) {
      console.error("Error while deleting thumbnail on post delete:", e);
    }

    await post.deleteOne();
    res.status(200).json({ message: "Xoá bài viết thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

exports.searchPosts = async (req, res) => {
  const keyword = req.query.q;
  if (!keyword)
    return res.status(400).json({ message: "Thiếu từ khoá tìm kiếm" });

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    }).populate("author", "username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy các bài viết của user hiện tại
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate("author", "username");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};