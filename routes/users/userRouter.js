const { Router } = require('express')
const { validate } = require('../../controllers/auth/validateFingerprint')
const { 
    createUser, 
    getUsers, 
    sendRequest, 
    getRequests, 
    deletePending, 
    deleteReceived, 
    addFriend, 
    getFriends, 
    deleteFriend, 
    updateUser 
} = require('../../controllers/users/userController')


const passport = require('passport')
const { signupLimiter } = require('../../ratelimiters/auth/signupLimiter')
const { getUsersLimiter } = require('../../ratelimiters/users/getUsersLimiter')
const { getFriendsimiter } = require('../../ratelimiters/users/getFriendsLimiter')
const { updateUserLimiter } = require('../../ratelimiters/users/updateUserLimiter')
const { sendRequestLimiter } = require('../../ratelimiters/users/sendRequestLimiter')
const { deletePendingLimiter } = require('../../ratelimiters/users/deletePendingLimiter')
const { deleteReceivedLimiter } = require('../../ratelimiters/users/deleteReceivedLimiter')
const { getRequestsLimiter } = require('../../ratelimiters/users/getRequestsLimiter')
const { addFriendLimiter } = require('../../ratelimiters/users/addFriendLimiter')
const { deleteFriendLimiter } = require('../../ratelimiters/users/deleteFriendLimiter')

const userRouter = Router()

userRouter.get("/", getUsersLimiter, passport.authenticate("jwt", {session: false}), validate, getUsers)
userRouter.post("/", signupLimiter, createUser)
userRouter.put("/", updateUserLimiter, passport.authenticate("jwt", {session: false}), validate, updateUser)

userRouter.post("/:userId/friends/request", sendRequestLimiter, passport.authenticate("jwt", {session: false}), validate, sendRequest)

userRouter.delete("/:userId/friends/request/pending", deletePendingLimiter, passport.authenticate("jwt", {session: false}), validate, deletePending)
userRouter.delete("/:userId/friends/request/received", deleteReceivedLimiter, passport.authenticate("jwt", {session: false}), validate, deleteReceived)

userRouter.get("/friends/request", getRequestsLimiter, passport.authenticate("jwt", {session: false}), validate, getRequests)

userRouter.post("/:userId/friends", addFriendLimiter, passport.authenticate("jwt", {session: false}), validate, addFriend)
userRouter.get("/friends", getFriendsimiter, passport.authenticate("jwt", {session: false}), validate, getFriends)
userRouter.delete("/:userId/friends", deleteFriendLimiter, passport.authenticate("jwt", { session: false}), validate, deleteFriend)

module.exports = userRouter