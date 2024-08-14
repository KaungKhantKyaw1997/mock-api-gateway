require("dotenv").config();
const { startServer } = require("./src/index");
const path = require("path");

const configFiles = [
  path.resolve(__dirname, "./configs/usersConfig.js"),
  path.resolve(__dirname, "./configs/extraConfig.js"),
];

const options = {
  port: process.env.PORT, // Port number, default is 4000
  hostname: process.env.HOSTNAME, // Hostname, default is "localhost"
  protocol: process.env.PROTOCOL, // Protocol, default is "http"
  tokenSecret: process.env.TOKEN_SECRET, // Token secret, default is nIKz31cSWS8CogBicmQqjyYQF1ybYsmg9RYD/Jw7JbE=
  expiresIn: process.env.EXPIRES_IN, // Token expiration, default is 1 hour
};

startServer(configFiles, options);
