const express = require("express");
const app = express();
const http = require("http").createServer(app)
const io = require("socket.io")(http);

module.exports = {http,io,app,express};