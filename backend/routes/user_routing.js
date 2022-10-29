const express = require('express');
const router = express.Router();

const { registerUser, signInUser, getUserData } = require('../controllers/user_controller');

const { authenticate } = require('../middleware/authentication_handling')

router.post('/', registerUser)
router.post('/signin', signInUser)
router.post('/self', authenticate, getUserData)

module.exports = router