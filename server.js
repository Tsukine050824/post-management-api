// server.js
const app = require('./app');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: 'https://post-management-frontend-xoab.vercel.app', // hoặc '*', nhưng chỉ nên dùng trong dev
  credentials: true
}));

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(' MongoDB connected');
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
