const rateLimit = require('express-rate-limit');
const throwError = (message, status, json) => {
    const error = new Error(message)
    error.status = status
    error.json = json
    return error
}


exports.getRequestsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    headers: true, // Add rate limit info to response headers
    handler: (req, res, next) => {
      const error = throwError("Limit Error", 429, [{msg: "RATE_LIMIT_EXCEEDED"}])
      next(error)
    },
    keyGenerator: (req) => {
      // Use forwarded IP if available, fallback to direct IP
      return req.ip || req.connection.remoteAddress;
    }
  });
