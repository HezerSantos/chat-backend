const { body } = require("express-validator")
const prisma = require('../config/prisma')
const argon = require('argon2');
const throwError = (message, status) => {
    const error = new Error(message)
    error.status = status
    throw error
}

// exports.validateUpdate = [
//     body("newUsername")
//         .optional({checkFalsy: true})
//         .trim()
//         .isLength({min: 1}).withMessage("Username must be at least one character")
//         .custom(async(username) => {
//             let user
//             try{
//                 user = await prisma.user.findUnique({
//                     where: {
//                         username: username
//                     }
//                 })
//                 if (user){
//                     throwError("Username Exists", 409)
//                 }
//                 return true
//             } catch (e){
//                 if(user){
//                     throwError("Username Exists", 409)
//                 } else {
//                     throwError("Internal Server Error", 500)
//                 }
//             }
//         })
//         .escape(),
//     body("newPassword")
//         .optional({checkFalsy: true})
//         .trim()
//         .isLength({min: 3}).withMessage("Password Must be at Least 12 characters")
//         .escape(),
//     body("newConfirmPassword")
//         .optional({checkFalsy: true})
//         .trim()
//         .custom((newConfirmPassword, {req}) => {
//             console.log(newConfirmPassword, req.body)
//             if (newConfirmPassword !== req.body.newPassword){
//                 throwError("Passwords Dont Match", 400)
//             }
//             return true
//         })
//         .escape(),
//     body("verify")
//     .custom(async(verify, {req}) => {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: req.user.id
//             }
//         })

//         if(!user){
//             throwError("Username Does Not Exist", 409)
//         }
//         console.log(user.password)
//         console.log(verify)
//         const match = await argon.verify(user.password, verify);
//         if (!match) {
//             throwError("Incorrect Username or Password", 401)
//         }

//         return true
//     })
// ]

exports.validateUpdate = [
    body("username")
        .trim("")
        .custom(async(username) => {
            let user
            try {
                user = await prisma.user.findUnique({
                    where: {
                        username: username
                    }
                })
                if (user){
                    throw new Error
                }
                return true
            } catch (e) {
                if(user){
                    throw new Error("Username Already Exists")
                } else {
                    throw new Error("Internal Server Error. Please Try Again")
                }
                
            }
        })
        .escape(),
    body("password")
        .trim()
        .isLength({min: 3}).withMessage("Password must be at least 12 characters")
        .escape(),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password){
                throw new Error("Passwords dont match")
            }
            return true
        })
        .escape(),
    body("verify")
        .trim()
        .escape()
]