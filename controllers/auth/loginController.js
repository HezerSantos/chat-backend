const { validationResult } = require("express-validator");
const { passport, authenticateUser } = require("../../config/passport");
const { validateLogin } = require("../../validation/loginValidator");


exports.loginUser = [
    validateLogin,
    async(req, res, next) => {
        try {
            const { username, password} = req.body
            // console.log(username, password)
            const { user, token } = await authenticateUser(username, password)
            console.log(req.body)
              // res.cookie('token', token, {
              //   httpOnly: true,
              //   secure: true,
              //   sameSite: 'strict',
              //   domain: '.up.railway.app',
              //   maxAge: 24 * 60 * 60 * 1000
              // });

            res.cookie("token", token, {
                httpOnly: true,      // Prevents access to the cookie from JavaScript
                secure: true, // Use HTTPS in production
                maxAge: 60 * 60 * 1000, // 1 hour expiration time (can adjust as needed)
                sameSite: "None", // To mitigate CSRF attacks
                path: "/",
            });

            return res.json({user})
        } catch(error) {
            return next(error)
        }
    }
]