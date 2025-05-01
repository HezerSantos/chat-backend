const jwt = require('jsonwebtoken');
require('dotenv').config();
const RFRS_SECRET = process.env.RFRS_SECRET  
  
  const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    throw error
}

  const compare  = (token, header) => {
    const { _wdasd } = jwt.verify(token, RFRS_SECRET)

    return _wdasd === header
  }


exports.validateRefreshCsrf = (req, res, next) => {
    try{
        const asiw_ = req.cookies.asiw_
        
        if(!asiw_){
            console.log("Rejected", req.method, req.originalUrl)
            throwError("CSRF missing", 403, ['CSRF Missing'])
        }
        
        const match = compare(asiw_, req.headers._bsdfe)
        
        if(!match){
            console.log("Rejected", req.method, req.originalUrl)
            throwError("CSRF token invalid or missing", 403, ['403 Forbidden'])
        }

        const rpayload = {
            _wdasd: "ac29e2d6d9a5c433ad412d08905d5506"
        }
    
        const newToken = jwt.sign(rpayload, RFRS_SECRET, { expiresIn: '5m'})
    
    
        
        res.cookie("asiw_", newToken, {
            httpOnly: false, 
            secure: true, 
            maxAge: 60 * 1000 * 5, 
            sameSite: "None",
            path: "/",
            domain: "lunarlink.hallowedvisions.com"
        })
        console.log("Validated", req.method, req.originalUrl)
        next()
    } catch(error){
        next(error)
    }
}