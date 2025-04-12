const crypto = require('crypto')
const prisma = require('../config/prisma')

const fingerprint = (req, res, next) => {
  let userAgent = req.headers['user-agent']
  let ip = req.ip



  const data = `${userAgent}|${ip}`
  // console.log(data)
  const fp = crypto.createHash('sha256').update(data).digest('hex')

  req.fingerprint = fp
  next()
}


module.exports = {fingerprint};
