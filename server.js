var express = require('express');
var app = express();

var users = 0;
var numpairs =0;

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

var PORT = "3000";

logData("starting at: " + d.toISOString());
var server = app.listen(PORT, function(err) {
  if (err) return console.log(err);
  //process.exit(1);
  logData("Listening at http://" +"localhost" + ":" + PORT);
});

app.use(express.static("public"));

logData("Server Running.");
logData('Resetting all instances.')


var socket = require('socket.io');
var io = socket(server);

io.emit('reset');

//io.set('heartbeat timeout', 2000);
//io.set('heartbeat interval', 1000);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  users++;
  console.log('new connection! '+socket.id + '\tUsers: ' + users);
  socket.on('disconnect', function() {
    var tosplice = false;
    var clientToSplice = false;
    users--;
    console.log('disconnected: '+socket.id+ '\tUsers: ' + users);

    if (awaiting == socket.id) awaiting = false;
    else
    {pairs.forEach(function(obj) {
      Object.keys(obj).forEach(function(key) {
        if (obj[key] == socket.id) {
          console.log('erasing pair: '+JSON.stringify(obj));
          numpairs--;
          console.log('pairs: '+numpairs);
          socket.broadcast.to((key == 'player1')? obj['player2'] : obj['player1']).emit('left'); //Other disconnected
          tosplice = pairs.indexOf(obj); //remove
          pairs.splice(tosplice,1);
          //clientToSplice = (key == 'player1')? obj['player2'] : obj['player1'];
        }
      });
    });
    if (tosplice) pairs.splice(tosplice,1);}
    //if (clientToSplice) io.sockets.connected[clientToSplice].disconnect();
  });  //DISCONNECT

  if (!awaiting) {awaiting = socket.id; console.log("New awaiting " + socket.id);}
  else { socket.on('loaded', function() { socket.emit('ready'); });
    console.log('creating pair '+ JSON.stringify({'player1' : awaiting, 'player2' : socket.id}));
    numpairs++;
    console.log('pairs: '+numpairs);
    pairs.push({'player1' : awaiting, 'player2' : socket.id});
    socket.broadcast.to(awaiting).emit('ready');
    awaiting = false;
  }

  socket.on('selection', Message);
  //socket.on('stats', logStats);

  function Message(data) {
    var idToSend;

     pairs.forEach(function(obj) {
      //console.log("for obj in pairs : obj:" + JSON.stringify(obj));
      Object.keys(obj).forEach(function(key) {
        //console.log("object "+ JSON.stringify(obj) + ' key ' +key+' value: '+obj.key);
        if (obj[key] == socket.id) {
          //console.log('found pair in pairs');
          var s = (key == 'player1')?'player2' : 'player1';
        //  console.log(s);
          idToSend = {'id' : obj[s] , 'p':s};
        }
      });
    });
    if (!idToSend) {console.log("Invalid message."); socket.emit('invalid');}
    else
    {
      logData("Client " + idToSend.id + " " + idToSend.p + "  sent data:  " + data.choice);
      socket.broadcast.to(idToSend.id).emit('selection', data);
    }
  }
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
