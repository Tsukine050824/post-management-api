const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config(); // ✅ Load biến môi trường
const app = express();

// === CORS cấu hình đúng và đặt trước ROUTES ===
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Middleware khác
app.use(express.json());
app.use(morgan('dev'));
app.use('/upload', express.static('uploads'));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Post Management API',
      version: '1.0.0',
      description: 'API documentation',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use((err, req, res, next) => {
  if (err.message.includes('Chỉ cho phép')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});


module.exports = app;
