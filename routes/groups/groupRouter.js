const { Router } = require('express')
const { createGroup, getGroup, createMessage, getGroupMessages } = require('../../controllers/groups/groupController')
const { passport } = require('../../config/passport')
const { validate } = require('../../controllers/auth/validateFingerprint')
const groupRouter = Router()

groupRouter.post("/", passport.authenticate("jwt", {session: false}), validate, createGroup)
groupRouter.get("/", passport.authenticate("jwt", {session: false}), validate, getGroup)

groupRouter.post("/:groupId/messages", passport.authenticate("jwt", {session: false}), validate, createMessage)
groupRouter.get("/:groupId/messages", passport.authenticate("jwt", {session: false}), validate, getGroupMessages)

module.exports = groupRouter