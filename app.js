require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');

const app = express();

// Подключаем базу
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/collaborations', collaborationRoutes);
console.log("MONGO_URI =", process.env.MONGO_URI || "mongodb://localhost:27017/artistcollab");

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
