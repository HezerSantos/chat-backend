const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const XFRS_SECRET = process.env.XFRS_SECRET
const RFRS_SECRET = process.env.RFRS_SECRET

const csrf = async(req, res, next) => {
    const crossSurf = crypto.randomBytes(32).toString('hex');
    const id = Math.floor(Math.random() * 20)
    const spayload = {
        _fqekx: crossSurf,
        oqi_wd: id
    }

    const rpayload = {
        _wdasd: "ac29e2d6d9a5c433ad412d08905d5506"
    }

    const _sxrfa = jwt.sign(spayload, XFRS_SECRET, { expiresIn: '5m'})
    const asiw_ = jwt.sign(rpayload, RFRS_SECRET, { expiresIn: '5m'})

    
    res.cookie("_sxrfa", _sxrfa, {
        httpOnly: false, 
        secure: true, 
        maxAge: 5 * 1000 * 60, 
        sameSite: "None",
        path: "/",
        domain: ".hallowedvisions.com"
    })

    res.cookie("asiw_", asiw_, {
        httpOnly: false, 
        secure: true, 
        maxAge: 5 * 1000 * 60, 
        sameSite: "None",
        path: "/",
        domain: ".hallowedvisions.com"
    })

    res.status(200).send()
}

module.exports= {csrf}