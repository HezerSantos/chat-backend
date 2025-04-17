const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173", 
  
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    } 

    if(allowedOrigins.indexOf(origin) !== -1){
      return callback(null, true)
    }else {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
  
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie", "_sadwv", "_bsdfe"],
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
