const { body } = require("express-validator")

exports.validateGroup = [
    body("groupName")
        .trim()
        .notEmpty().withMessage("Group Name cannot be empty")
        .isLength({min: 5}).withMessage("Group Name must be at least 5 characters")
        .escape()
]