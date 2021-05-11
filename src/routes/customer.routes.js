const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin } = require('../middleware/validators/userValidator.middleware');

router.get('/', (req, res) => {
    res.send("it's working!");
})
router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin))

module.exports = router;