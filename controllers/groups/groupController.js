const { validateGroup } = require("../../validation/groupValidator");
const prisma = require("../../config/prisma");
const { validationResult } = require("express-validator");
const { validateMessage } = require("../../validation/messageValidator");
const { validateUpdateGroup } = require("../../validation/updateGroupValidator");
const argon = require('argon2');

const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    throw error
}


exports.createGroup = [
    validateGroup,
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                throwError("Invalid Group Name", 400, errors.array())
            }

            const groupCount = await prisma.group.count({
                where: {
                    creatorId: req.user.id
                }
            })
            if(groupCount === 3){
                throwError("Too many Groups", 400, [{msg: "Maximum amount of Groups is 3"}])
            }

            const { groupName } = req.body

            const { id } = await prisma.group.create({
                data: {
                    name: groupName,
                    creatorId: req.user.id
                }
            })

            await prisma.userGroup.create({
                data: {
                    groupId: id,
                    userId: req.user.id,
                }
            })

            return res.json({
                message: "Received Group Name"
            })

        } catch(error){
            return next(error)
        }
    }
]

exports.deleteGroup = async(req, res, next) => {
    try{
        const groupId = parseInt(req.params.groupId)

        const group = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                creatorId: true
            }
        })

        if (req.user.id !== group.creatorId){
            throwError("Unauthorized", 401, [{msg: "Unauthorized"}])
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                password: true
            }
        })

        const { password } = req.body

        const match = await argon.verify(user.password, password)
        
        if(!match){
            throwError("Credential Error", 401, [{msg: "Unauthorized"}])
        }

        await prisma.message.deleteMany({
            where: {
                groupId: groupId
            }
        })

        await prisma.userGroup.deleteMany({
            where: {
                groupId: groupId
            }
        })

        await prisma.group.delete({
            where: {
                id: groupId
            }
        })
        return res.json("Group Deleted")
    } catch(error){
        next(error)
    }
}

exports.updateGroup = [
    validateUpdateGroup,
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                throwError("Invalid Group Name", 400, errors.array())
            }

            const groupId = parseInt(req.params.groupId)

            const group = await prisma.group.findUnique({
                where: {
                    id: groupId
                },
                select: {
                    creatorId: true
                }
            })

            if(req.user.id !== group.creatorId){
                throwError("Unauthorized", 401, [{msg: "Unauthorized"}])
            }
            const { newName } = req.body
            await prisma.group.update({
                where: {
                    id: groupId
                },
                data: {
                    name: newName
                }
            })
            return res.json("Update Name")
        } catch(error){
            next(error)
        }
    }
]

exports.getGroup = async(req, res, next) => {
    try{
        const userGroups = await prisma.group.findMany({
            where: {
                creatorId: req.user.id
            }
        })

        const joinedGroupIdsMap = userGroups.map(group => group.id)

        const joinedGroupIdsSet = new Set(joinedGroupIdsMap)

        const joinedGroups = await prisma.userGroup.findMany({
            where: {
                userId: req.user.id
            },
            select: {
                group: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })


        const filteredJoinedGroups = joinedGroups.filter(group => !joinedGroupIdsSet.has(group.group.id)) 
        return res.status(200).json({
            userGroups: userGroups,
            joinedGroups: filteredJoinedGroups
        })
    } catch(error){
        return next(error)
    }
}

exports.createMessage = [
    validateMessage,
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                throwError("Invalid Message", 400, errors.array())
            }

            const { message } = req.body
            const { groupId } = req.params

            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.id
                },
                select: {
                    userGroups: {
                        select: {
                            groupId: true
                        }
                    }
                }
            })

            const groupIds = new Set(user.userGroups.map(group => group.groupId))
            
            if(!groupIds.has(parseInt(groupId))){
                throwError("Unauthorized", 401, [{msg: "Unauthorized"}])
            }
            await prisma.message.create({
                data: {
                    message: message,
                    userId: req.user.id,
                    groupId: parseInt(groupId)
                }
            })

            return res.json({
                message: "Message Received",
            })
        } catch(error){
            return next(error)
        }
    }
]

exports.getGroupMessages = async(req, res, next) => {
    try{
        /*
            QUERY DB for group id. Check if req.userId in the userIds
            If not return 401
        */
        const { groupId } = req.params

        
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                userGroups: {
                    select: {
                        groupId: true
                    }
                }
            }
        })

        const groupIds = new Set(user.userGroups.map(group => group.groupId))

        if(!groupIds.has(parseInt(groupId))){
            throwError("Unauthorized", 401, [{msg: "Unauthorized"}])
        }
        
        const messages = await prisma.message.findMany({
            where:{
                groupId: parseInt(groupId)
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })

        return res.json({
            messages: messages
        })

    } catch(error){
        return next(error)
    }
}

exports.getGroupMembers = async(req, res, next) => {
    try{
        const groupId = parseInt(req.params.groupId)

                
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                userGroups: {
                    select: {
                        groupId: true
                    }
                }
            }
        })

        const groupIds = new Set(user.userGroups.map(group => group.groupId))

        if(!groupIds.has(groupId)){
            throwError("Unauthorized", 401, [{msg: "Unauthorized"}])
        }


        const groupMembers = await prisma.userGroup.findMany({
            where: {
              groupId: groupId,
            },
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          });

          const filteredMembers = groupMembers.filter(user => user.user.id !== req.user.id)

          return res.json({
            groupMembers: filteredMembers
          })
    } catch(error){
        next(error)
    }
}

exports.addGroupMember = async(req, res, next) => {
    try{
        //GET THE CREATOR ID OF THE GROUP AND COMPARE TO GROUP ID
        const userId = parseInt(req.params.userId)
        const groupId = parseInt(req.params.groupId)


        const creatorId = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                creatorId: true
            }
        })

        if(req.user.id !== creatorId.creatorId){
            throwError("Unauthorized", 401, [{msg: "Unauthroized"}])
        }

        await prisma.userGroup.create({
            data: {
                userId: userId,
                groupId: groupId
            }
        })

        return res.json("Group Created")
    } catch(error){
        next(error)
    }
}


exports.deleteGroupMember = async(req, res, next) => {
    try{
        //GET THE CREATOR ID OF THE GROUP AND COMPARE TO GROUP ID
        const userId = parseInt(req.params.userId)
        const groupId = parseInt(req.params.groupId)


        const creatorId = await prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                creatorId: true
            }
        })

        if(req.user.id !== creatorId.creatorId){
            throwError("Unauthorized", 401, [{msg: "Unauthroized"}])
        }

        await prisma.userGroup.delete({
            where: {
                userId_groupId: {
                    userId: userId,
                    groupId: groupId
            }   
            }
        })

        return res.json("Group Created")
    } catch(error){
        next(error)
    }
}