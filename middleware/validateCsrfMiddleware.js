const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const XFRS_SECRET = process.env.XFRS_SECRET

exports.validateCsrf = (req, res, next) => {
    const _sxrfa = req.cookies._sxrfa

    const payload = jwt.verify(_sxrfa, XFRS_SECRET)
    // console.log("Original", payload._fqekx, req.originalUrl)
    // console.log("Modified", req.headers._sadwv)
    // console.log()

    const crossSurf = crypto.randomBytes(32).toString('hex');

    const newPayload = {
        _fqekx: crossSurf
    }

    const newToken = jwt.sign(newPayload, XFRS_SECRET, { expiresIn: '7d'})


    
    res.cookie("_sxrfa", newToken, {
        httpOnly: false, 
        secure: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: "None",
        path: "/",
    })

    next()
}