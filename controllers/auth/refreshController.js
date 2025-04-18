const jwt = require('jsonwebtoken');
require('dotenv').config();
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET

const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    throw error
}

exports.getRefresh = async(req, res, next) => {
    try{
        const refresh = req.cookies.refresh
        if(!refresh){
            throwError('Unauthorized', 401, ['Unauthorized'])
        }

        const refreshPayload = jwt.verify(refresh, REFRESH_JWT_SECRET)
        
        const accessPayload = {
            id: refreshPayload.id, 
            username: refreshPayload.username
        }

        const access = jwt.sign(accessPayload, JWT_SECRET, { expiresIn: '15m' });
        
        res.cookie("access", access, {
            httpOnly: true, 
            secure: true, 
            maxAge: 15 * 60 * 1000, 
            sameSite: "None",
            path: "/",
        });

        // console.log("User Refreshed")
        return res.json({
            message: 'Token Refreshed',
            id: refreshPayload.id,
            username: refreshPayload.username
        })

    } catch(error) {
        next(error)
    }
}