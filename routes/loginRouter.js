const { Router } = requrie("express")

const { Router } = require("express")
const { loginUser } = require("../controllers/loginController")
const loginRouter = Router()

loginRouter.post("/", loginUser)

module.exports = loginRouter