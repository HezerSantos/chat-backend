const { validationResult } = require("express-validator")
const primsa = require("../../config/prisma")
const { validateCreateUser } = require("../../validation/createUserValidator")
const prisma = require("../../config/prisma")
const argon = require('argon2');

const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    throw error
}

exports.createUser = [
    validateCreateUser,
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                throwError("Credential Error", 400, errors.array())
            }
            const {username, password } = req.body

            const hashedPassword = await argon.hash(password)

            await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword
                }
            })
        
            return res.json({
                message: "User Signed Up"
            })
        } catch (e) {
            return next(e)
        }
    }
]