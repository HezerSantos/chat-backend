const { Router } = require('express')
const { createGroup, getGroup, createMessage, getGroupMessages } = require('../../controllers/groups/groupController')
const { passport } = require('../../config/passport')

const groupRouter = Router()

groupRouter.post("/", passport.authenticate("jwt", {session: false}), createGroup)
groupRouter.get("/", passport.authenticate("jwt", {session: false}), getGroup)

groupRouter.post("/:groupId/messages", passport.authenticate("jwt", {session: false}), createMessage)
groupRouter.get("/:groupId/messages", passport.authenticate("jwt", {session: false}), getGroupMessages)

module.exports = groupRouter