var http = require('http');
var fs = require('fs');


var express = require('express');
var app = express();
var path = require('path');

require('./functionsNodeJS.js')();

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
var colorsClients = [
  'background-color:green;',
  'background-color:blue;',
  'background-color:yellow;',
  'background-color:red;'
]
var clientList = [];
var listCollision = [];

counterID += 1;
clientList[counterID] = {x:150 ,y:200, type:'mapItem', collider:true};

io.sockets.on('connection', function (socket) {

  counterID += 1;
  socket.client.id = counterID;

  console.log('Client '+socket.client.id+' est connecté !');
  socket.emit('auth', socket.client.id);



  if (colorsClients.length == 1) {
    clientList[socket.client.id] = {x:0 ,y:0, type:'client', css:'background-color:green;', collider:true};
  }else if (colorsClients.length == 2) {
    clientList[socket.client.id] = {x:500 ,y:0, type:'client', css:'background-color:blue;', collider:true};
  }else if (colorsClients.length == 3) {
    clientList[socket.client.id] = {x:500 ,y:500, type:'client', css:'background-color:yellow;', collider:true};
  }else if (colorsClients.length == 4) {
    clientList[socket.client.id] = {x:0 ,y:500, type:'client', css:'background-color:red;', collider:true};
  }
  colorsClients.shift();


  updateClientsPositions(socket,clientList);



  socket.on('clientPosition', function(position) {
    var x = position.x;
    var y = position.y;
    for(var i= 0; i < listCollision.length; i++)
    {
      if ( listCollision[i].id1 == socket.client.id || listCollision[i].id2 == socket.client.id ){
        console.log('stop pour '+socket.client.id);
        socket.emit('stopClient', {x:x, y:y});
      }
    }
    clientList[socket.client.id].x = x;
    clientList[socket.client.id].y = y;


  });
  setInterval(function(){
    if( clientList !== undefined && clientList.length > 0){
      // mette a jour la liste des infos de clients pour tout le monde
      socket.broadcast.emit('gamePosition', clientList);
     // et ma liste aussi
      socket.emit('gamePosition', clientList);


      // liste tout les collisions entre element
      listCollision = [];
      for(var i= 0; i < clientList.length; i++)
      {
        for(var j= i; j < clientList.length; j++)
        {
             if (collide(clientList, i, j) === true){
               //console.log('Collision entre element '+i+' et '+j);
               listCollision.push({id1:i, id2:j})
             }
        }
      }

      //console.log('Nombre de collisions '+listCollision.length);



    }

  },10);

});

app.listen(5000);
server.listen(8080);
