const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const server = http.createServer(app);
const port = process.env.PORT || 4001;
// Pass a http.Server instance to the listen method
const io = require("socket.io")(server);
const shell = require("shelljs")

// The server should start listening
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Register the index route of your app that returns the HTML file
app.use(express.static(path.join(__dirname, "../admin/build")));

app.get("/api/build", (req, res) => {
  shell.exec('yarn workspace client build', (code ,stdout, stderr) => {
    console.log(stdout)
  })
  res.send({ building: true });
});

// Handle connection
io.on("connection", function (socket) {
  console.log("Connected succesfully to the socket ...");

  const news = [
    {
      title: "The cure of the Sadness is to play Videogames",
      date: "04.10.2016",
    },
    {
      title: "Batman saves Racoon City, the Joker is infected once again",
      date: "05.10.2016",
    },
    {
      title: "Deadpool doesn't want to do a third part of the franchise",
      date: "05.10.2016",
    },
    {
      title:
        "Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales",
      date: "04.10.2016",
    },
  ];

  // Send news on the socket
  socket.emit("news", news);

  socket.on("my other event", function (data) {
    console.log(data);
  });
});
