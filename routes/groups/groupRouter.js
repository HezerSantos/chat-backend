const { Router } = require('express')
const { createGroup, getGroup, createMessage, getGroupMessages } = require('../../controllers/groups/groupController')
const { passport } = require('../../config/passport')
const { validate } = require('../../controllers/auth/validateFingerprint')
const { validateCsrf } = require('../../controllers/auth/validateCsrf')
const groupRouter = Router()

groupRouter.post("/",validateCsrf, passport.authenticate("jwt", {session: false}), validate, createGroup)
groupRouter.get("/", validateCsrf, passport.authenticate("jwt", {session: false}), validate, getGroup)

groupRouter.post("/:groupId/messages", passport.authenticate("jwt", {session: false}), validate, createMessage)
groupRouter.get("/:groupId/messages", passport.authenticate("jwt", {session: false}), validate, getGroupMessages)

module.exports = groupRouter