// controllers/post.controller.js
const Post = require('../models/post.model');
const postEvent = require('../events/postEvents');

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
    postEvent.emit('post:created', { userId: req.user.id, title });
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', category } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  try {
    const posts = await Post.find(filter)
      .sort({ [sortBy]: -1 }) // Sắp xếp giảm dần theo trường
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'username');

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};



exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    // ✅ Chỉ cho phép author gốc sửa
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bài viết này' });
    }

    // ✅ Cập nhật
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    // ✅ Chỉ cho phép author gốc xoá
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xoá bài viết này' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Xoá bài viết thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

exports.searchPosts = async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.status(400).json({ message: 'Thiếu từ khoá tìm kiếm' });

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ],
    }).populate('author', 'username');

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
