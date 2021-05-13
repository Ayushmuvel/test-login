const { body } = require('express-validator');

exports.createUserSchema = [
    body('Name')
    .exists()
    .withMessage('username is required')
    .isLength({ min: 3 })
    .withMessage('Must be at least 3 chars long'),
    body('Email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
    body('Mobile')
    .exists()
    .withMessage('phone number is required'),
    body('Active')
    .exists()
    .withMessage('activation status is required')
];


exports.updateUserSchema = [
    body('Name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Must be at least 3 chars long'),
    body('Email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
    body('Mobile')
    .optional(),
    body('Active')
    .optional()
];