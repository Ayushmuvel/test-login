const { body } = require('express-validator');

exports.validateLogin = [
    body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
    body('password')
    .exists()
    .withMessage('Password is required')
    .notEmpty()
    .withMessage('Password must be filled')
];