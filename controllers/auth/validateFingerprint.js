const prisma = require('../../config/prisma')
const argon = require('argon2')
const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    throw error
}


exports.validate = async(req, res, next) => {
    try{
        const fingerprint = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                fingerprint: true
            }
        })
        // console.log(req.headers['user-agent'])
        // console.log("DB:", fingerprint.fingerprint)
        // console.log("Req:", req.fingerprint)

        const match = await argon.verify(fingerprint.fingerprint, req.fingerprint)
        if(!match){
            throwError("Fingerprint Fail", 400, [{msg:'Invalid Fingerprint'}])
        }

        next()
    } catch(error){
        next(error)
    }
}
