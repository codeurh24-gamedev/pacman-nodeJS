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
global.counterMapItemID=0;
global.game = {
  id_client:0,
  client: [],
  map: []
}
var elmDOM = {};
// creation de la map

// les pieces
// for(i=0; i < 6; i++){
//   for(j=1; j < 9; j=j+2){
//     piece(i*50,j*50,30,30);
//   }
// }

//murCadreMap(50,16, 11);

var matrice = [];
matrice[0]  = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
matrice[1]  = [1,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1];
matrice[2]  = [1,2,1,2,1,1,2,1,1,2,1,1,2,1,2,1];
matrice[3]  = [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1];
matrice[4]  = [1,2,1,2,1,2,1,1,1,1,2,1,2,1,2,1];
matrice[5]  = [1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1];
matrice[6]  = [1,2,2,2,1,2,1,2,2,1,2,1,2,2,2,1];
matrice[7]  = [1,2,1,2,1,2,1,2,2,1,2,1,2,1,2,1];
matrice[8]  = [1,2,2,2,2,2,1,2,2,1,2,2,2,2,2,1];
matrice[9]  = [1,2,1,1,1,2,1,1,1,1,2,1,1,1,2,1];
matrice[10] = [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1];
matrice[11] = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var nV1 = matrice.length;
var nV2;
var sousMatrice;

for(i=0; i < nV1; i++){
  sousMatrice = matrice[i];
  nV2 = sousMatrice.length;
  for(j=0; j < nV2; j++){
    if( sousMatrice[j] == 1) mur(50*j,50*i,50,50);
    if( sousMatrice[j] == 2) piece((50*j)+10,(50*i)+10,30,30);
  }
}

io.sockets.on('connection', function (socket) {
  if( global.counterID == 4) return false;


  global.counterID += 1;
  socket.client.id = global.counterID;
  socket.emit('auth', socket.client.id);
  socket.emit('matrice', matrice);


  var cssValue = '';
  var xValue = 0;
  var yValue = 0;
  var wValue=50;
  var rotateValue = 'matrix(1, 0, 0, 1, 0, 0)';
  var classeValue = '';

  if( global.counterID == 1){
    cssValue = 'background-image: url(http://127.0.0.1:5000/image/frame-pacman-jaune.png);';
    xValue = 50;
    yValue = 50;
    wValue=50;
    classeValue =  ' pacman ';
  }
  if( global.counterID == 2){
    cssValue = 'background-image:url(http://127.0.0.1:5000/image/pacman-rouge.png);';
    xValue = 50*3;
    yValue = 50*2;
    wValue=40;
    rotateValue = 'matrix(-1, 1.22465e-16, -1.22465e-16, -1, 0, 0)';
  }

  if( global.counterID == 3){
    cssValue = 'background-image:url(http://127.0.0.1:5000/image/pacman-rose.png);';
    xValue = 50*14;
    yValue = 50*10;
    wValue=50;
    rotateValue = 'matrix(-1, 1.22465e-16, -1.22465e-16, -1, 0, 0)';
  }

  if( global.counterID == 4){
    cssValue = 'background-image:url(http://127.0.0.1:5000/image/pacman-bleu2.png);';
    xValue = 50;
    yValue = 50*10;
    wValue=50;
  }

  elmDOM = {
    id: 'client_'+socket.client.id,
    x:xValue,
    y:yValue,
    w:wValue,
    h:wValue,
    rotate: rotateValue,
    css: cssValue,
    classe: 'box body trigger '+classeValue,
    collider:true,
    trigger:false
  }
  global.game.client[socket.client.id] = elmDOM;
  socket.broadcast.emit('newNode', elmDOM);
  var i=0;
  var n = global.game.client.length;
  for(i=0; i<n; i++){
    if(global.game.client[i] !== undefined)
      socket.emit('newNode',global.game.client[i]);
  }

  // chargement de la map
  var i=0;
  var n = global.game.map.length;

  for(i=0; i<n; i++){
    if(global.game.map[i] !== undefined && global.game.map[i] !== null){
      var json = Object.assign(global.game.map[i], {fromID:socket.client.id});
      socket.emit('newNode',json);
      //socket.broadcast.emit('newNode', json);
    }

  }









  socket.on('maNouvellePosition', function (data) {
    global.game.client[data.id].x = data.position.x;
    global.game.client[data.id].y = data.position.y;
    global.game.client[data.id].rotate = data.rotate;
    socket.broadcast.emit('updatePosition',{id:global.game.client[data.id].id, position:{x:global.game.client[data.id].x, y:global.game.client[data.id].y}, rotate:global.game.client[data.id].rotate});
  });
  var splitID;
  var memoDeleteNode = '';
  socket.on('deleteNode', function (data) {
    if( memoDeleteNode == ' '+data.id+data.fromID){
      return false;
    }else{
      memoDeleteNode = ' '+data.id+data.fromID;
    }
    splitID = data.id.split('_');
    if( splitID[0] == 'mapItem' ){
      global.game.map.splice(splitID[1], 1);
    }
    console.log('deleteNode '+data.id+' par client '+data.fromID);
    socket.emit('deleteNode',{id:data.id});
    socket.broadcast.emit('deleteNode',{id:data.id});
  });
  setInterval(function(){

  },10);

});

app.listen(5000);
server.listen(8080);
