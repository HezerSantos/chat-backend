
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

  // console.log(newAgent)

  const fp = `${newAgent}|${ip}`
  // console.log(fp)
  req.fingerprint = fp
  next()
}


module.exports = {fingerprint};

//Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36|::1