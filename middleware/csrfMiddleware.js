const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const XFRS_SECRET = process.env.XFRS_SECRET

const csrf = async(req, res, next) => {
    const crossSurf = crypto.randomBytes(32).toString('hex');
    const id = Math.floor(Math.random() * 20)
    const payload = {
        _fqekx: crossSurf,
        oqi_wd: id
    }

    const _sxrfa = jwt.sign(payload, XFRS_SECRET, { expiresIn: '15s'})


    
    res.cookie("_sxrfa", _sxrfa, {
        httpOnly: false, 
        secure: true, 
        maxAge: 15 * 1000, 
        sameSite: "None",
        path: "/",
    })

    res.status(200).send()
}

module.exports= {csrf}