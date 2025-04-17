const { body } = require('express-validator')
const prisma = require("../config/prisma")
const argon = require('argon2');
const throwError = (message, status) => {
    const error = new Error(message)
    error.status = status
    throw error
}


exports.validateCreateUser = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username Cannot be Empty")
        .isLength({min: 5}).withMessage("Username Must be at least 5 characters")
        .custom(async(username) => {
            let user
            try{
                user = await prisma.user.findUnique({
                    where: {
                        username: username
                    }
                })
                if (user){
                    throwError("Username Exists", 409)
                }
                return true
            } catch (e){
                if(user){
                    throwError("Username Exists", 409)
                } else {
                    throwError("Internal Server Error", 500)
                }
            }
        })
        .escape(),
    body("password")
        .trim()
        .notEmpty().withMessage("Password Cannot be Empty")
        .isLength({min: 3}).withMessage("Password Must be at Least 12 characters")
        .escape(),
    body("confirmPassword")
        .trim()
        .notEmpty().withMessage("Confirm Pasword Cannot Be Empty")
        .custom((confirmPassword, {req}) => {
            if (confirmPassword !== req.body.password){
                throwError("Passwords Dont Match", 400)
            }
            return true
        })
        .escape(),
]