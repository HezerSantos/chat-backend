const { Router } = require("express")
const { loginUser } = require("../../controllers/auth/loginController")
const { loginLimiter } = require("../../ratelimiters/auth/loginLimiter")
const loginRouter = Router()

loginRouter.post("/", loginLimiter, loginUser)

module.exports = loginRouter