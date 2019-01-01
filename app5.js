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
global.counterID=0;
var colorsClients = [
  'background-color:green;',
  'background-color:blue;',
  'background-color:yellow;',
  'background-color:red;'
]
global.clientList = [];
global.vraiClientList = [];
var listCollision = [];

var styleCSS =  '';

// les mur du borde de la map
// bordure Top
for (var i = 0; i < 16; i++) {
  mur(i*50,0);
}
// bordure left
for (var i = 1; i < 11; i++) {
  mur(0,i*50);
}
// bordure right
for (var i = 1; i < 11; i++) {
  mur(15*50,i*50);
}
// bordure bottom
for (var i = 0; i < 16; i++) {
  mur(i*50,11*50);
}

// poteaux
for (var i = 0; i < 14; i=i+2) {
  for (var j = 2; j < 10; j=j+2) {
    mur(i*50,j*50);
  }
}
// pieces
// for (var i = 0; i < 14; i=i+2) {
//   for (var j = 2; j < 10; j=j+2) {
//     piece((+1)*50,(j+1)*50);
//   }
// }




io.sockets.on('connection', function (socket) {

  global.counterID += 1;
  socket.client.id = global.counterID;

  console.log('Client '+socket.client.id+' est connecté !');
  socket.emit('auth', socket.client.id);



  if (colorsClients.length == 1) {
    global.clientList[socket.client.id] = {x:0 ,y:0, type:'client', css:'background-color:green;', collider:true};
  }else if (colorsClients.length == 2) {
    global.clientList[socket.client.id] = {x:500 ,y:0, type:'client', css:'background-color:blue;', collider:true};
  }else if (colorsClients.length == 3) {
    global.clientList[socket.client.id] = {x:250 ,y:500, type:'client', css:'background-color:yellow;', collider:true};
  }else if (colorsClients.length == 4) {
    styleCSS =  'background-image:url(http://127.0.0.1:5000/image/pacman-o.png);';
    global.clientList[socket.client.id] = {x:50 ,y:50, type:'client', css:styleCSS , collider:true};
  }
  colorsClients.shift();


  updateClientsPositions(socket,global.clientList);



  socket.on('clientPosition', function(position) {
    global.clientList[socket.client.id].x = position.x;
    global.clientList[socket.client.id].y = position.y;
  });
  setInterval(function(){
    if( global.clientList !== undefined && global.clientList.length > 0){
      // mette a jour la liste des infos de clients pour tout le monde
      socket.broadcast.emit('gamePosition', global.clientList);
     // et ma liste aussi
      socket.emit('gamePosition', global.clientList);
    }

  },10);

});

app.listen(5000);
server.listen(8080);
