const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET — показываем страницу регистрации
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST — обработка регистрации
router.post('/register', authController.register);

// GET — показываем страницу логина
router.get('/login', (req, res) => {
  res.render('login', { error: null, success: null });
});

// POST — обработка логина
router.post('/login', authController.login);

module.exports = router;
