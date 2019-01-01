function infosClients( clientList ) {
  $.each(clientList, function (index, value) {

    if (value !== undefined && value !== null){
      htmlInfoClients = '<li>'+index+' x:'+value.x+' y:'+value.y+' type:'+value.type+'</li>' + htmlInfoClients;
    }
    if( index == (clientList.length-1)) $('ul').html(htmlInfoClients);
  });
}

function sendNewPosClient() {
  var client = {
    position: {
      x: parseInt($('#client_'+id).css('margin-left')),
      y: parseInt($('#client_'+id).css('margin-top'))
    }
  }
  socket.emit('clientPosition', client.position);
}

function isCollide(margin){
  if(! $('#client_'+id).hasClass('body')) return false;

  var x1 = parseInt($( '#client_'+id ).css('margin-left'));
  var y1 = parseInt($( '#client_'+id ).css('margin-top'));
  var w1 = parseInt($( '#client_'+id ).css('width'));
  var h1 = parseInt($( '#client_'+id ).css('height'));
  var outx = false;
  var outy = false;
  var out = false;
  $( ".body" ).each(function( index ) {
    if ( $( this ).attr('id') != 'client_'+id ){
      var x2 = parseInt($( this ).css('margin-left'));
      var y2 = parseInt($( this ).css('margin-top'));
      var w2 = parseInt($( this ).css('width'));
      var h2 = parseInt($( this ).css('height'));
      var collisionX  = ((x1+(w1+margin)) > x2 &&  x1 < (x2+(w2+margin)));
      var collisionY  = ((y1+(h1+margin)) > y2 &&  y1 < (y2+(h2+margin)));
      if( collisionX && collisionY){
        if (x1 < x2){
          outx = 'right';
        }else if(x1 > x2){
          outx = 'left';
        }

        if (y1 < y2){
          outy = 'down';
        }else if(y1 > y2){
          outy = 'up';
        }
        out = {x:outx, y:outy};

        return true;
      }
    }
  });
  return out;
}

function moveClient(px){
  var moveStop = '';
  var margin = -5;
  if( Keys.up ) {
    if (isCollide(margin).y != 'up' ){
      $('#client_'+id).css('transform', 'rotate(-90deg)');
      $('#client_'+id).css('margin-top', '-='+px+'px');
    }
  }
  if( Keys.down) {
    if (isCollide(margin).y != 'down' ){
    $('#client_'+id).css('transform', 'rotate(90deg)');
      $('#client_'+id).css('margin-top', '+='+px+'px');
    }
  }
  if( Keys.left) {

    if (isCollide(margin).x != 'left'){
      $('#client_'+id).css('transform', 'rotate(180deg)');
      $('#client_'+id).css('margin-left', '-='+px+'px');
    }
  }
  if( Keys.right) {

    if (isCollide(margin).x != 'right'){
      $('#client_'+id).css('transform', 'rotate(0deg)');
      $('#client_'+id).css('margin-left', '+='+px+'px');
    }
  }
}

function ifClientExist(){
  // n'execute pas le reste de la boucle si id n'est pas encore defini
  // cela est une securité pour etre sûr de ne pas manipuler trop top le client au chargement du script
  if (id === undefined || id === null){
    return false;
  }
  // verifie l'existance du client sur la map
  // cela est une securité pour etre sûr de ne pas manipuler trop top le client au chargement du script
  if (!$('#client_'+id).is('div')){
    return false;
  }
  return true;
}

function rand(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}
