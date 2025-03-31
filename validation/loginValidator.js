const { body } = require("express-validator")


exports.validateLogin = [
    body("username")
        .trim()
        .escape(),
    body("password")
        .trim()
        .escape()
]