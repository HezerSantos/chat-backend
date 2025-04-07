const { body } = require('express-validator')

exports.validateMessage = [
    body("message")
        .trim()
        .notEmpty().withMessage("Message Cannot Be Empty")
        .isLength({min: 1}).withMessage("Must be at least one character")
        .escape()
]