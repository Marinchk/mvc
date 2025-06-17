const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/register', (req, res) => {
  res.render('register', { error: null });
});


router.post('/register', authController.register);


router.get('/login', (req, res) => {
  res.render('login', { error: null, success: null });
});


router.post('/login', authController.login);

module.exports = router;
