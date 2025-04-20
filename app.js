const express = require("express");
const path = require("path");
require("dotenv").config();

//Start my confusion

const http = require('http')
const WebSocket = require('ws')

const app = express();





// Middleware Imports
const jwt = require('jsonwebtoken');
const corsMiddleware = require("./middleware/corsMiddleware");
const helmetMiddleware = require("./middleware/helmetMiddleware");
const { passport } = require("./config/passport");
const staticMiddleware = require("./middleware/staticMiddleware");
const cookieParserMiddleware = require("./middleware/cookieParserMiddleware");
const bodyParserMiddleware = require("./middleware/bodyParserMiddleware");
const {fingerprint} = require('./middleware/fingerPrintMiddleware')
const { csrf } = require('./middleware/csrfMiddleware')
const { validateCsrf } = require('./middleware/validateCsrfMiddleware')
const { validateRefreshCsrf } = require('./middleware/validateRefreshCsrf')
// Apply Middleware
app.use(cookieParserMiddleware);
app.use(fingerprint)
app.use(bodyParserMiddleware);
app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(passport.initialize());
app.use(staticMiddleware);
// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('trust proxy', true);
// Routers
const loginRouter = require("./routes/auth/loginRouter");
const userRouter = require("./routes/users/userRouter");
const refreshRouter = require("./routes/auth/refreshRouter");
const groupRouter = require("./routes/groups/groupRouter");
const prisma = require("./config/prisma");


// Routes
app.use("/api/auth/csrf", csrf)
app.use("/api/auth/login", validateCsrf, loginRouter);
app.use("/api/auth/refresh",validateRefreshCsrf, refreshRouter)
app.use("/api/users", validateCsrf, userRouter)
app.use("/api/groups", validateCsrf, groupRouter)
// Logout Route
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("access", {
    httpOnly: true, 
    secure: true, 
    sameSite: "None",
    path: "/",
});
res.clearCookie("refresh", {
    httpOnly: true,      
    secure: true,
    sameSite: "None", 
    path: "/",
});

  console.log("Logged Out")
  res.json({ message: "Logged out successfully" });
});


app.use((err, req, res, next) => {
  console.error(`Error ${err.status || 500 }: ${err.message || 'Internal Server Error'}`)
  res.status(err.status || 500).json({
    errors: err.json || [{msg: 'Internal Server Error'}],

  });
});


const server = http.createServer(app)

const wss = new WebSocket.Server({ 
  server, 
  handleProtocols: (protocols, request) => {
    return true
  }
})


const connectedClients = new Map()
const connectedGroups = new Map()

const getCookie = (tokenName, cookie) => {
  let cookies = cookie.split(';')
  cookies = cookies.map((cookie) => cookie.trim())
  cookies = cookies.map((cookie) => cookie.split('='))
  cookies = new Map(cookies)
  return cookies.get(tokenName)
}

const getGroupIds = async(socketId) => {
  try{
    const groups = await prisma.userGroup.findMany({
      where: {
        userId: socketId
      },
      select: {
        groupId: true
      }
    })

    const groupIds = new Set(groups.map(group => group.groupId))
    return groupIds
  } catch (e){
    console.error(e)
  }
}

JWT_SECRET = process.env.JWT_SECRET
XFRS_SECRET = process.env.XFRS_SECRET

wss.on('connection', (ws, req) => {
  const socket = ws
  let socketId
  let username
  let groupId

  const access = getCookie("access", req.headers.cookie)
  let _sxrfa = getCookie("_sxrfa", req.headers.cookie)
  try{
    const accessPayload = jwt.verify(access, JWT_SECRET)
    const _sxrfaPayload = jwt.verify(_sxrfa, XFRS_SECRET)
    if(!accessPayload || !_sxrfaPayload){
      throw new Error()
    }

    socketId = accessPayload.id
    username = accessPayload.username
    connectedClients.set(socketId, {socket: socket})
  } catch(error){
    ws.close(4000, 'Invalid session cookie')
    if(socketId){
      connectedClients.delete(socketId)
    }
    console.log("Invalid")
  }





  ws.on('message', async(data) => {
    const req = JSON.parse(data)
    if (req.type === 'Connect'){
      groupId = req.groupId

      const groupIds = await getGroupIds(socketId)
      const clientInfo = connectedClients.get(socketId)
      clientInfo.groupIds = groupIds
      
      if(!groupIds.has(groupId)){
        clientInfo.socket.send(JSON.stringify({
          userId: null,
          username: 'Server',
          message: "You do not have access to this socket",
          groupId: groupId,
        }))
        socket.close(4000, "Unauthorized")
        connectedClients.delete(socketId)
        return
      }

      connectedGroups.set(socketId, {socket: socket, groupId: groupId})
      
      return
    }
    
    connectedGroups.forEach((client, id) => {
      if(client.groupId === groupId){
        client.socket.send(JSON.stringify({
          userId: socketId,
          username: username,
          message: req.message,
        }))
      }
    })
  })

  ws.on('close', () => {
    connectedClients.delete(socketId)
  })
})


// Server
server.listen(8080, () => {
  console.log("App running on port 8080");
});
