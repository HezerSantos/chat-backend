
const fingerprint = (req, res, next) => {
  let userAgent = req.headers['user-agent']
  let ip = req.ip
  
  userAgent = userAgent.split(" ")
  // console.log(userAgent)
  let newAgent = ''
  let osFlag = false
  for(let i = 0; i < userAgent.length; i++){
    if(/\(/.test(userAgent[i])){
      osFlag = true
    }
    if(!osFlag){
      newAgent += userAgent[i]
    }
    if(/\)/.test(userAgent[i])){
      osFlag = false
    }
  }

  newAgent = newAgent.split("/")

  let fingerprint = newAgent.slice(0,3)
  fingerprint = fingerprint.join("|")
  const fp = `${fingerprint}|${ip}`
  // console.log(fp)
  req.fingerprint = fp
  next()
}


module.exports = {fingerprint};
