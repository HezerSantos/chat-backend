const passport = require("passport");
const argon = require('argon2');
const prisma = require('./prisma')
const { format } = require('date-fns');
require('dotenv').config();
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require('jsonwebtoken');



const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        const token = req.cookies.access;
        // console.log("Extracted token from request:", token ? "Token exists" : "No token");
        return token || null;
      },
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const throwError = (message, status, json) => {
  const error = new Error(message)
  error.status = status
  error.json = json
  throw error
}

// Authenticate User (example)
async function authenticateUser(username, password, req) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throwError("Login Error", 401, [{msg: "Incorrect Username or Password"}])
    }

    const match = await argon.verify(user.password, password);
    if (!match) {
      throwError("Login Error", 401, [{msg: "Incorrect Username or Password"}])
    }

    // Create JWT payload
    const accessPayload = {
      id: user.id,
      username: user.username,
    };
    const refreshPayload = {
      id: user.id,
      username: user.username,
      expiresIn: `${7 * 24 * 60 * 60 * 1000}`
    }

    // Sign the JWT token
    const access = jwt.sign(accessPayload, JWT_SECRET, { expiresIn: '15m' });
    const refresh = jwt.sign(refreshPayload, REFRESH_JWT_SECRET, {expiresIn: '7d'})
    console.log("User authenticated", format(new Date(), 'yyyy-MM-dd'));

    return { user, access, refresh };
  } catch (err) {
    throw err;
  }
}


module.exports = {
  passport,
  authenticateUser,  // Export the authentication function for use in routes
};