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
// Connect database
connectDB();

app.use(express.urlencoded({ extended: true }));  // for parsing application/x-www-form-urlencoded (forms)
app.use(express.json()); // for parsing JSON


// Middleware
app.use(cors());
app.use(express.json());

app.get('/dashboard', (req, res) => {
  res.send('<h1>Welcome to your dashboard!</h1>');
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/collaborations', collaborationRoutes);
console.log("MONGO_URI =", process.env.MONGO_URI || "mongodb://localhost:27017/artistcollab");

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
