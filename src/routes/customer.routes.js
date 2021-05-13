const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.contoller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema } = require('../middleware/validators/customerValidator');

router.get('/all', auth(), awaitHandlerFactory(customerController.getAllUsers));
router.get('/email', auth(), awaitHandlerFactory(customerController.getUserById));
router.post('/', auth(Role.Admin), createUserSchema, awaitHandlerFactory(customerController.createUser));
router.put('/', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(customerController.updateUser));
router.delete('/', auth(Role.Admin), awaitHandlerFactory(customerController.deleteUser));

module.exports = router;