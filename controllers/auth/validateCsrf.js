const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const XFRS_SECRET = process.env.XFRS_SECRET

exports.validateCsrf = (req, res, next) => {
    const _sxrfa = req.cookies._sxrfa

    const payload = jwt.verify(_sxrfa, XFRS_SECRET)
    // console.log("Original", payload._fqekx)
    // console.log("Modified", req.headers._sadwv)

    next()
}