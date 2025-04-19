const { validationResult } = require("express-validator")
const primsa = require("../../config/prisma")
const { validateCreateUser } = require("../../validation/createUserValidator")
const prisma = require("../../config/prisma")
const argon = require('argon2');
const { validateUpdate } = require("../../validation/validateUpdate");

const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    throw error
}

exports.createUser = [
    validateCreateUser,
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                throwError("Credential Error", 400, errors.array())
            }
            const {username, password } = req.body

            const hashedPassword = await argon.hash(password)

            await prisma.user.create({
                data: {
                    username: username,
                    password: hashedPassword
                }
            })
        
            return res.json({
                message: "User Signed Up"
            })
        } catch (e) {
            return next(e)
        }
    }
]

exports.updateUser = [
    validateUpdate,
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                throwError("Credential Error", 400, errors.array())
            }

            const { username, password, verify } = req.body

            if(!verify){
                throwError("Credential Error", 401, [{msg: "Unauthorized"}])
            }

            const userPassword = await prisma.user.findUnique({
                where:{
                    id: req.user.id
                },
                select:{
                    password: true
                }
            })
            
            const match = await argon.verify(userPassword.password, verify)
            
            if(!match){
                throwError("Credential Error", 401, [{msg: "Unauthorized"}])
            }


            const formData = {}
            const changedData = {}
            if(username){
                formData.username = username
                changedData.username = true
            }
            if(password){
                const hashedPassword = await argon.hash(password)
                formData.password = hashedPassword
                changedData.password = true
            }

            await prisma.user.update({
                where:{
                    id: req.user.id
                },
                data: formData
            })

            return res.json({
                message: "Credentials Changed",
                changedData
            })
        }catch(error){
            next(error)
        }
    }
]

exports.getUsers = async(req, res, next) => {
    try{
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true
            }
        })

        const friends = await prisma.friend.findMany({
            where:{
                userId: req.user.id
            }
        })

        const receiverIds = await prisma.request.findMany({
            where: {
                senderId: req.user.id
            }
        })


        let filteredUsers = users.filter(user => user.id !== req.user.id)

        if (friends){
            const friendSet = new Set(friends.map(friend => friend.friendId))
            filteredUsers = filteredUsers.filter(user => !friendSet.has(user.id))
        }

        if(receiverIds){
            const receiverSet = new Set(receiverIds.map(id => id.receiverId))
            filteredUsers = filteredUsers.filter(user => !receiverSet.has(user.id))
        }

        return res.json({
            users: filteredUsers
        })
    } catch(error){
        next(error)
    }
}


exports.sendRequest = async(req, res, next) => {
    try{
        const { userId } = req.params

        const senderId = req.user.id

        await prisma.request.create({
            data: {
                senderId: senderId,
                receiverId: parseInt(userId)
            }
        })

        return res.json({
            message: "Request Sent Successfully"
        })
    } catch(error){
        next(error)
    }
}

exports.deletePending = async(req, res, next) => {
    try{
        const { userId: receiverId } = req.params
        const senderId = req.user.id

        await prisma.request.delete({
            where: {
              senderId_receiverId: {
                senderId: senderId,
                receiverId: parseInt(receiverId),
              },
            },
        })

        return res.json("Delted Pending Request")
    } catch(error){
        next(error)
    }
}

exports.deleteReceived = async(req, res, next) => {
    try{
        const  { userId: senderId } = req.params
        const receiverId = req.user.id

        await prisma.request.delete({
            where: {
              senderId_receiverId: {
                senderId: parseInt(senderId),
                receiverId: receiverId,
              },
            },
        })

        return res.json("Deleted Received Request")
    } catch(error){
        next(error)
    }
}

exports.getRequests = async(req, res, next) => {
    try{
        const requests = await prisma.user.findUnique({
            where: {
              id: req.user.id,
            },
            include: {
              sentRequests: {
                include: {
                  receiver: {
                    select: { username: true },
                  },
                },
              },
              receivedRequests: {
                include: {
                  sender: {
                    select: { username: true },
                  },
                },
              },
            },
          });

        
        return res.json({
            requests
        })
    } catch(error){
        next(error)
    }
}

exports.addFriend = async(req, res, next) => {
    try{
        const senderId = parseInt(req.params.userId, 10);
        const receiverId = req.user.id

        await prisma.friend.createMany({
            data: [
                { userId: receiverId, friendId: parseInt(senderId) },
                { userId: parseInt(senderId), friendId: receiverId }
            ]
        });

        // Delete any pending friend requests in either direction
        await prisma.request.deleteMany({
            where: {
                OR: [
                    { senderId , receiverId },
                    { senderId: receiverId, receiverId: parseInt(senderId) }
                ]
            }
        });

        return res.json("Friend Created")
    } catch(error){
        next(error)
    }
}


exports.getFriends = async(req, res, next) => {
    try{
        const friends = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                friendsAsUser: {
                    include: {
                        friend: {
                            select: {
                                username: true,
                                userGroups: true,
                            }
                        }
                    }
                }
            }
        })

        return res.json({
            friends: friends
        })
    }catch(error){
        next(error)
    }
}

exports.deleteFriend = async(req, res, next) => {
    try{
        const friendId = parseInt(req.params.userId)

        await prisma.friend.deleteMany({
            where: {
                OR: [
                    { userId: req.user.id, friendId: friendId },
                    {userId: friendId, friendId: req.user.id }
                ]
            }
        })

        return res.json("Deleted Friend")
    } catch(error){
        next(error)
    }
}