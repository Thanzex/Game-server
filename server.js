var express = require('express');
var app = express();
var fs = require('fs');
//var ip = require('ip');

/*
fs.readFile('public/sketch.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/var HOST = '.*'/g, "var HOST = '"+ip.address()+"';");

  fs.writeFile('public/sketch.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
*/

/*
var logStream = fs.createWriteStream('logs/log.txt', {
  'flags': 'a',
  'autoClose': 'true'
});
logStream.on('error', function() {
  console.log("Log file not present, creating...");
  fs.writeFile("logs/log.txt", "", function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});
var playerStatsStream = fs.createWriteStream('logs/players.txt', {
  'flags': 'a'
});
playerStatsStream.on('error', function() {
  console.log("Player file not present, creating...");
  fs.writeFile("logs/players.txt", "", function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});
*/
var d = new Date();

var pair = {
  'player1': false,
  'player2': false
};
var pairs = [];

var awaiting = false;

if (process.platform === "win32") { //Catch exit
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}

//var HOST = 'https://serverperlaura-uauauauauau.now.sh';//ip.address();
var PORT = "3000";

logData("starting at: " + d.toISOString());
var server = app.listen(PORT, function(err) {
  if (err) return console.log(err);
  //process.exit(1);
  logData("Listening at http://" +"localhost" + ":" + PORT);
});

app.use(express.static("public"));

logData("Server Running.");

var socket = require('socket.io');
var io = socket(server);

//io.set('heartbeat timeout', 2000);
//io.set('heartbeat interval', 1000);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  // if (playersDict.player1) playersDict.player2 = socket.id;
  // else playersDict.player1 = socket.id;
  // logData("New connection: " + ((playersDict.player1 == socket.id) ? 'player1' : 'player2'));
  //
  socket.on('disconnect', function(socket) {
    for (obj in pairs) {
      Object.keys(obj).forEach(function(key) {
        if (obj[key] == socket.id) {
          socket.broadcast.to((key == 'player1')? obj['player2'] : obj['player1']).emit('left'); //Other disconnected
          pairs.splice(array.indexOf(obj),1); //remove
        }
      });
    }
  });

  if (!awaiting) awaiting = socket.id;
  else {
    pairs.push({player1 : awaiting, player2 : socket.id});
    awaiting = false;
  }

  socket.on('selection', Message);
  //socket.on('stats', logStats);

  function Message(data) {
    var idToSend = function(){ for (obj in pairs) {
                                Object.keys(obj).forEach(function(key) {
                                  if (obj[key] == socket.id) {
                                    var s = (key == 'player1')?'player2' : 'player1';
                                    return {'id' : obj[s],
                                            'p' : s};
                                  }
                                });
                              }
                            }
    logData("Client " + idToSend.id + " " + idToSend.p + "  sent data:  " + data.choice);
    socket.broadcast.to(idToSend.id).emit('selection', data);
    logData("Broadcasting data...");
  }

  // function logStats(data) {
  //   d = new Date();
  //   logData("Logging player data: " + data.choice);
  //   //playerStatsStream.write("\r\nPlayer: " + ((playersDict.player1 == socket.id) ? 'player1' : 'player2') + "\tAction:" + data.choice + "\t Time: " + d.toISOString());
  // }
}

function resetGames() {
  io.sockets.emit('reset', "disconnection");
  logData("Client disconnected, refreshing all windows...");
  //playerStatsStream.write("\r\nExiting.");
}

process.on('SIGINT', function() {
  server.close();
  d = new Date();
  logData("Exiting at: " + d.toISOString());
  //playerStatsStream.write("\r\nExiting.");
  process.exit();
});

function logData(data) {
  console.log(data);
  //logStream.write("\r\n" + data);
}
