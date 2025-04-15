const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const XFRS_SECRET = process.env.XFRS_SECRET


const csrfs = ["cats", "max"]

const csrf = async(req, res, next) => {
    //store the orignal
    // console.log(req.cookies)
    const crossSurf = crypto.randomBytes(32).toString('hex');

    // if(req.cookies._sxrfa){
    //     console.log("I exist")
    //     console.log(req.method, req.url)
    //     console.log()
    // } else {
    //     if(req.method !== "OPTIONS"){
    //         console.log("I dont exist")
    //         console.log(req.method, req.url)
    //         console.log()
    //     }
    // }
    const payload = {
        _fqekx: crossSurf
    }
    const _sxrfa = jwt.sign(payload, XFRS_SECRET, { expiresIn: '7d'})
    // if(!req.cookies._sxrfa && (req.method !== "OPTIONS")){
    //     req._sxrfa = _sxrfa
    //     // console.log("I ran")
    // } else {
    //     req._sxrfa = req.cookies._sxrfa
    // }
    // console.log(_sxrfa)
    // if(!req.cookies._sxrfa){
    //     req._sxrfa = _sxrfa
    // }

    res.cookie("_sxrfa", _sxrfa, {
        httpOnly: false, 
        secure: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: "None",
        path: "/",
    })

    next()
}

module.exports= {csrf}