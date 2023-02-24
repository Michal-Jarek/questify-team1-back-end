#!/usr/bin/env node

/**
 * Module dependencies.
 */

var { app } = require("../functions/app");
var debug = require("debug")("questify-team1-back-end:server");
var http = require("http");
const { mongoose } = require("mongoose");
require("dotenv").config();

const uriDb = process.env.MONGODB_URL;
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const connection = mongoose.connect(uriDb, {
  promiseLibrary: global.Promise,
  useUnifiedTopology: true,
});

/**
 * Listen on provided port, on all network interfaces.
 */
connection
  .then(() => {
    server.listen(port, () => {
      console.log("\nDatabase connection successful");
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });

server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
