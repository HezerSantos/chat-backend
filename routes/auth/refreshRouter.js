const { Router } = require('express')
const { passport } = require('../../config/passport')
const { getRefresh } = require('../../controllers/auth/refreshController')
const refreshRouter = Router()

refreshRouter.get("/", getRefresh)

module.exports = refreshRouter