const { Router } = require('express')
const { createGroup, getGroup, createMessage, getGroupMessages, getGroupMembers, addGroupMember, deleteGroupMember, updateGroup, deleteGroup } = require('../../controllers/groups/groupController')
const { passport } = require('../../config/passport')
const { validate } = require('../../controllers/auth/validateFingerprint')
const { createGroupLimiter } = require('../../ratelimiters/groups/createGroupLimiter')
const { updateGroupLimiter } = require('../../ratelimiters/groups/updateGroup')
const { deleteGroupLimiter } = require('../../ratelimiters/groups/deleteGroupLimiter')
const { getGroupLimiter } = require('../../ratelimiters/groups/getGroupLimiter')
const { createMessageLimiter } = require('../../ratelimiters/groups/createMessageLimiter')
const { getGroupMessagesLimiter } = require('../../ratelimiters/groups/getGroupMessagesLimiter')
const { getGroupMembersLimiter } = require('../../ratelimiters/groups/getGroupMembersLimiter')
const { addGroupMembersLimiter } = require('../../ratelimiters/groups/addGroupMemberLimiter')
const groupRouter = Router()

groupRouter.post("/", createGroupLimiter, passport.authenticate("jwt", {session: false}), validate, createGroup)
groupRouter.put("/:groupId", updateGroupLimiter, passport.authenticate("jwt", {session: false}), validate, updateGroup)
groupRouter.delete("/:groupId", deleteGroupLimiter, passport.authenticate("jwt", {session: false}), validate, deleteGroup)
groupRouter.get("/", getGroupLimiter, passport.authenticate("jwt", {session: false}), validate, getGroup)

groupRouter.post("/:groupId/messages", createMessageLimiter, passport.authenticate("jwt", {session: false}), validate, createMessage)
groupRouter.get("/:groupId/messages", getGroupMessagesLimiter, passport.authenticate("jwt", {session: false}), validate, getGroupMessages)

groupRouter.get("/:groupId/users", getGroupMembersLimiter, passport.authenticate("jwt", {session: false}), validate, getGroupMembers)
groupRouter.post("/:groupId/users/:userId", addGroupMembersLimiter, passport.authenticate("jwt", {session: false}), validate, addGroupMember)
groupRouter.delete("/:groupId/users/:userId", deleteGroupLimiter, passport.authenticate("jwt", {session: false}), validate, deleteGroupMember)

module.exports = groupRouter