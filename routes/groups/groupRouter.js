const { Router } = require('express')
const { createGroup, getGroup, createMessage, getGroupMessages, getGroupMembers, addGroupMember, deleteGroupMember, updateGroup, deleteGroup } = require('../../controllers/groups/groupController')
const { passport } = require('../../config/passport')
const { validate } = require('../../controllers/auth/validateFingerprint')
const groupRouter = Router()

groupRouter.post("/", passport.authenticate("jwt", {session: false}), validate, createGroup)
groupRouter.put("/:groupId", passport.authenticate("jwt", {session: false}), validate, updateGroup)
groupRouter.delete("/:groupId", passport.authenticate("jwt", {session: false}), validate, deleteGroup)
groupRouter.get("/", passport.authenticate("jwt", {session: false}), validate, getGroup)

groupRouter.post("/:groupId/messages", passport.authenticate("jwt", {session: false}), validate, createMessage)
groupRouter.get("/:groupId/messages", passport.authenticate("jwt", {session: false}), validate, getGroupMessages)

groupRouter.get("/:groupId/users", passport.authenticate("jwt", {session: false}), validate, getGroupMembers)
groupRouter.post("/:groupId/users/:userId", passport.authenticate("jwt", {session: false}), validate, addGroupMember)
groupRouter.delete("/:groupId/users/:userId", passport.authenticate("jwt", {session: false}), validate, deleteGroupMember)

module.exports = groupRouter