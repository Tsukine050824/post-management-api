const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc'); // ✅ tên đúng

require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
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


const swaggerSpec = swaggerJsdoc(swaggerOptions); // ✅ đúng tên hàm
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/posts', require('./routes/post.routes'));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true // nếu bạn dùng cookie hoặc JWT với header
}));
// app.use(cors()); // ✅ bật lại dòng này nếu đã có file

// Routes
app.use('/api/auth', require('./routes/auth.routes')); // ✅ bật lại dòng này nếu đã có file
module.exports = app;
