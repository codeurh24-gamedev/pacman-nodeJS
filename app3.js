var http = require('http');
var fs = require('fs');


var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));



// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);
var counterID=0;
var clientList = [];

var positionXPlayeurOne=0;

io.sockets.on('connection', function (socket) {

  counterID += 1;
  socket.client.id = counterID;

  console.log('Client '+socket.client.id+' est connecté !');
  socket.emit('auth', socket.client.id);

  if (socket.client.id == 1) {
    clientList[socket.client.id] = {x:0 ,y:0};
    socket.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y})
    socket.broadcast.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y});
  }else if (socket.client.id == 2) {
    clientList[socket.client.id] = {x:500 ,y:0};
    socket.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y})
    socket.broadcast.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y});
    clientList.forEach(function(element, index) {
      if (index != socket.client.id) {
        console.log(index+' => '+element);
        //console.log('Ajout du client '+index+' sur la map');
        socket.emit('ajouteClientSurMap', {id:index, x:element.x ,y:element.y});
      }
    });
  }else if (socket.client.id == 3) {
    clientList[socket.client.id] = {x:500 ,y:500};
    socket.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y})
    socket.broadcast.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y});
  }else if (socket.client.id == 4) {
    clientList[socket.client.id] = {x:0 ,y:500};
    socket.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y})
    socket.broadcast.emit('ajouteClientSurMap', {id:socket.client.id, x:clientList[socket.client.id].x ,y:clientList[socket.client.id].y});
  }



  socket.on('clientPosition', function(position) {
    clientList[socket.client.id] = position;
  });
  setInterval(function(){
    if( clientList[socket.client.id] !== undefined){
      socket.broadcast.emit('gamePosition', clientList);
      socket.emit('gamePosition', clientList);
    }
  },10);

});

app.listen(5000);
server.listen(8080);
