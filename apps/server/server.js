const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const server = http.createServer(app);
const port = process.env.PORT || 4001;
// Pass a http.Server instance to the listen method
const io = require("socket.io")(server);
const shell = require("shelljs");

// The server should start listening
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
// Register the index route of your app that returns the HTML file
app.use(express.static(path.join(__dirname, "../client/public")));
// Handle connection
io.on("connection", function (socket) {
  console.log("Connected succesfully to the socket ...");
  socket.on("build", function (data) {
    io.sockets.emit("building", { action: "building" });
    shell.exec("yarn workspace client build", (code, stdout, stderr) => {
      let errors = [];
      if (stderr) {
        errors.push(stderr);
      }
      if (code === 0) {
        io.sockets.emit("built", {
          action: "built",
          timestamp: new Date().getTime(),
        });
      }
      if (code === 1) {
        io.sockets.emit("failed", {
          action: "failed",
          error: errors.length > 0 ? errors.join("\n") : undefined,
        });
      }
    });
  });
});
