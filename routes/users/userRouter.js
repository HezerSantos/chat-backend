const { Router } = require('express')
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

const userRouter = Router()

userRouter.get("/", passport.authenticate("jwt", {session: false}), getUsers)
userRouter.post("/", createUser)
userRouter.put("/", passport.authenticate("jwt", {session: false}), updateUser)

userRouter.post("/:userId/friends/request", passport.authenticate("jwt", {session: false}), sendRequest)

userRouter.delete("/:userId/friends/request/pending", passport.authenticate("jwt", {session: false}), deletePending)
userRouter.delete("/:userId/friends/request/received", passport.authenticate("jwt", {session: false}), deleteReceived)

userRouter.get("/friends/request", passport.authenticate("jwt", {session: false}), getRequests)

userRouter.post("/:userId/friends", passport.authenticate("jwt", {session: false}), addFriend)
userRouter.get("/friends", passport.authenticate("jwt", {session: false}), getFriends)
userRouter.delete("/:userId/friends", passport.authenticate("jwt", { session: false}), deleteFriend)

module.exports = userRouter