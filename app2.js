var http = require('http');
var fs = require('fs');

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
// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
  // console.log('Un client est connecté !');
  // socket.emit('message', 'Vous êtes bien connecté !');
  // var client = {
  //   id: 0;
  //   position: {
  //     x: 0,
  //     y: 0
  //   }
  // }

  socket.positionX=2;

  counterID += 1;
  socket.client.id = counterID;

  console.log('Client '+socket.client.id+' est connecté !');
  socket.emit('auth', socket.client.id);




  //socket.broadcast.emit('message', 'Un autre client vient de se connecter !');

  // Quand le serveur reçoit un signal de type "message" du client
  // socket.on('message', function (message) {
  //   console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
  // });

  // socket.on('petit_nouveau', function(pseudo) {
  //   socket.pseudo = pseudo;
  // });

  socket.on('clientPosition', function(position) {
    socket.client.position = position;
    clientList[socket.client.id] = socket.client.position;
  });
  setInterval(function(){
    if( socket.client.position !== undefined){
      socket.emit('clientPosition', {id: socket.client.id, position: socket.client.position});
      socket.broadcast.emit('gamePosition', clientList);
      socket.emit('gamePosition', clientList);
    }
  },10);

});


server.listen(8080);
