var express = require('express');
var app = express();
server = require('http').createServer(app);

gamemaster= require('./gameMaster');

app.use(express.static(__dirname + '/client'));
server.listen(3000);



