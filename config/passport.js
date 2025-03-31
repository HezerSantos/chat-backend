const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require('./prisma')
const { format } = require('date-fns');
require('dotenv').config();
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        const token = req.cookies.token;
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

// Authenticate User (example)
async function authenticateUser(username, password) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log("Incorrect username or password");
      throw new Error("Incorrect username or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Incorrect username or password");
      throw new Error("Incorrect username or password");
    }

    // Create JWT payload
    const payload = {
      id: user.id,
    };

    // Sign the JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    console.log("User authenticated", format(new Date(), 'yyyy-MM-dd'));

    return { user, token };
  } catch (err) {
    throw err;
  }
}


module.exports = {
  passport,
  authenticateUser,  // Export the authentication function for use in routes
};