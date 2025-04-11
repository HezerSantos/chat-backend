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
            if(username === ""){return true}
            if(username.length < 1){
                throwError("Username must be at least 1 character", 500)
            }
            let user
            try {
                user = await prisma.user.findUnique({
                    where: {
                        username: username
                    }
                })
                if (user){
                    throwError("Username Exists", 409)
                }
                return true
            } catch (e) {
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
        .custom(password => {
            if(password){return true}else{return true}
        })
        .escape(),
    body("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if(req.body.password){
                if (value !== req.body.password){
                    throwError("Passwords Dont Match", 400)
                }
                if (value.length < 12){
                    throwError("Password Must be 12 characters long")
                }
                return true
            }

            return true
        })
        .escape(),
    body("verify")
        .trim()
        .escape()
]