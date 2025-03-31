const { Router } = require("express")

const { loginUser } = require("../../controllers/auth/loginController")
const loginRouter = Router()

loginRouter.post("/", loginUser)

module.exports = loginRouter