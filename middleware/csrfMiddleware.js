const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const XFRS_SECRET = process.env.XFRS_SECRET

const csrf = async(req, res, next) => {
    const crossSurf = crypto.randomBytes(32).toString('hex');
    const id = Math.floor(Math.random() * 21)
    const payload = {
        _fqekx: crossSurf,
        oqi_wd: id
    }

    const _sxrfa = jwt.sign(payload, XFRS_SECRET, { expiresIn: '7d'})


    
    res.cookie("_sxrfa", _sxrfa, {
        httpOnly: false, 
        secure: true, 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: "None",
        path: "/",
    })

    res.status(200).send()
}

module.exports= {csrf}