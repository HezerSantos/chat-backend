const { validateGroup } = require("../../validation/groupValidator");
const prisma = require("../../config/prisma");
const { validationResult } = require("express-validator");
const { validateMessage } = require("../../validation/messageValidator");


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
                    userId: req.user.id
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

exports.getGroup = async(req, res, next) => {
    try{

        const rows = await prisma.group.findMany({
            where: {
                creatorId: req.user.id
            }
        })

        return res.json({
            userGroups: rows
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

            await prisma.message.create({
                data: {
                    message: message,
                    userId: req.user.id,
                    groupId: parseInt(groupId)
                }
            })

            return res.json({
                message: "Message Received"
            })
        } catch(error){
            return next(error)
        }
    }
]

exports.getGroupMessages = async(req, res, next) => {
    try{

        const { groupId } = req.params

        const messages = await prisma.message.findMany({
            where:{
                groupId: parseInt(groupId)
            }
        })

        return res.json({
            messages: messages
        })

    } catch(error){
        return next(error)
    }
}