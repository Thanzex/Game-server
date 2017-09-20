var express = require('express');
var app = express();
var fs = require('fs');
var logStream = fs.createWriteStream('logs/log.txt', {'flags':'a'});
var playerStatsStream = fs.createWriteStream('logs/players.txt', {'flags':'a'});
var d = new Date();

if (process.platform === "win32") {                       //Catch exit
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}


var HOST = 'localhost';
var PORT = "3000";

logData("starting at: " + d.toISOString());
var server = app.listen(PORT, HOST, function(err) {
                  if (err) return console.log(err);
                  logData("Listening at http://"+ HOST +":"  + PORT);
                });

app.use(express.static("public"));

logData("Server Running.");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection',newConnection);
io.sockets.on('disconnect',resetGames);

function newConnection(socket) {
  logData("New connection: " + socket.id);

  socket.on('selection',Message);
  socket.on('stats',logStats);

  function Message(data) {
    logData("Client "+socket.id+"  sent data:  " + data);
    socket.broadcast.emit('selection',data);
    logData("Broadcasting data...");
  }

  function logStats(data) {
    logData("Logging player data: " + data);


  }
}

function resetGames() {
  io.sockets.emit('reset',"disconnection");
  logData("Client disconnected, refreshing all windows...");
}

process.on('SIGINT', function(){
  server.close();
  d = new Date();
  logData("Exiting at: " + d.toISOString());
  playerStatsStream.write("\r\nExiting.");
  process.exit();
});

function logData(data) {
  console.log(data);
  logStream.write("\r\n"+data);
}
