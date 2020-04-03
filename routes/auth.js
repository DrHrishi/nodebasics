const express = require('express');
const { signup, signin, signout } = require('../controllers/auth');
const { signupValidator } = require('../Validators/Validator');
const { userById } = require('../controllers/userController');
const router = express.Router();
router.post('/signup', signupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// if any routes contains userid as params
router.param('userId', userById)

module.exports = router;
