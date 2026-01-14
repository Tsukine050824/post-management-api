const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");

// Route tìm kiếm cần đặt trước để không bị nhầm với :id
router.get("/search", postController.searchPosts);

// Các route chính
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post(
  "/",
  verifyToken,
  upload.single("thumbnail"),
  postController.createPost
);
router.put(
  "/:id",
  verifyToken,
  upload.single("thumbnail"),
  postController.updatePost
);
router.delete("/:id", verifyToken, postController.deletePost);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 */
// (swagger docs omitted for brevity)

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết (có phân trang, lọc, sắp xếp)
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số bài viết mỗi trang
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: "Trường cần sắp xếp (mặc định: createdAt)"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo chuyên mục
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 */
// duplicate swagger docs removed

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Lấy chi tiết một bài viết
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 */
// keep single definition above

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền sửa bài viết
 */
// handled above with multer

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Xoá bài viết
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       403:
 *         description: Không có quyền xoá bài viết
 */
// handled above

/**
 * @swagger
 * /api/posts/search:
 *   get:
 *     summary: Tìm kiếm bài viết theo từ khoá
 *     tags: [Post]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khoá cần tìm trong tiêu đề hoặc nội dung
 *     responses:
 *       200:
 *         description: Danh sách bài viết khớp
 */
// already defined at top
module.exports = router;
