var dataGen = require('./dataGen');
var io = require('socket.io').listen(server);

var players = [];
playerCount = 0;

data = dataGen.generate(1);

var newPlayerDot= {x:400, y:400};

setInterval( function(){
  data = dataGen.resetData(data);
  io.sockets.emit('newData', {data: data });
}, 2000)

setInterval( function(){
  io.sockets.emit('playerPositions', {data: players});
}, 100);


io.sockets.on("connection", function (socket){
  players.push({id: playerCount, x: null, y: null});
  socket.emit("newPlayer", {player: playerCount} );
  playerCount++;

  socket.on("playerPosition", function(data){
    players[data.player].x = data.x;
    players[data.player].y = data.y;
    console.log("Player ID" + players[data.player].id);
  })


});


