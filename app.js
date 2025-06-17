require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');

const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// Подключаем базу
connectDB();

app.use(express.urlencoded({ extended: true }));  // для парсинга application/x-www-form-urlencoded (формы)
app.use(express.json()); // для парсинга JSON


// Middleware
app.use(cors());
app.use(express.json());

app.get('/dashboard', (req, res) => {
  res.send('<h1>Добро пожаловать в личный кабинет!</h1><p>Это защищённая страница</p>');
});
// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/collaborations', collaborationRoutes);
console.log("MONGO_URI =", process.env.MONGO_URI || "mongodb://localhost:27017/artistcollab");

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
