const { validationResult } = require("express-validator");
const { passport, authenticateUser } = require("../../config/passport");
const { validateLogin } = require("../../validation/loginValidator");


exports.loginUser = [
    validateLogin,
    async(req, res, next) => {
        try {
            const { username, password} = req.body
            // console.log(username, password)
            const { user, access, refresh } = await authenticateUser(username, password)

            // res.cookie("access", access, {
            //     httpOnly: true, 
            //     secure: true, 
            //     maxAge: 15 * 60 * 1000, 
            //     sameSite: "strict",
            //     path: "/",
            //     domain: '.up.railway.app',
            // });
            // res.cookie("refresh", refresh, {
            //     httpOnly: true,      
            //     secure: true,
            //     maxAge: 7 * 24 * 60 * 60 * 1000, 
            //     sameSite: "strict", 
            //     path: "/",
            //     domain: '.up.railway.app',
            // });

            res.cookie("access", access, {
                httpOnly: true, 
                secure: true, 
                maxAge: 15 * 60 * 1000, 
                sameSite: "None",
                path: "/",
            });
            res.cookie("refresh", refresh, {
                httpOnly: true,      
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, 
                sameSite: "None", 
                path: "/",
            });

            return res.json({user})
        } catch(error) {
            return next(error)
        }
    }
]