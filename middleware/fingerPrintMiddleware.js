const crypto = require('crypto')
const prisma = require('../config/prisma')

const fingerprint = (req, res, next) => {
  let userAgent = req.headers['user-agent']
  let ip = req.ip

  // console.log(userAgent, ip)

  const fp = `${userAgent}|${ip}`
  // console.log(data)
  // const fp = crypto.createHash('sha256').update(data).digest('hex')

  req.fingerprint = fp
  next()
}


module.exports = {fingerprint};


//access 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGV4MSIsImlhdCI6MTc0NDQ4MTYxMiwiZXhwIjoxNzQ0NDgyNTEyfQ.Ze2ZLG7gDF8_Kn5rDz9RxVjTAT8nLMpBdIUTiOWp8mw
//refresh
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGV4MSIsImV4cGlyZXNJbiI6IjYwNDgwMDAwMCIsImlhdCI6MTc0NDQ4MTUzMywiZXhwIjoxNzQ1MDg2MzMzfQ.Jv4Y682KrTDNoIx_x1_WLxg9Y0woH0ICKV-k4_NjkME