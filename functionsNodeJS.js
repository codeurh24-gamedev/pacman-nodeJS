module.exports = function() {

    // met a jour la position des clients sur la map
    this.updateClientsPositions = function(socket, clientList){

      var jsonString = clientList[socket.client.id];
      var obj = Object.assign({id:socket.client.id}, jsonString);
      console.log(obj);


      // informe les autres client que je suis arrivé sur leurs map a la position x y.
      // Met à jour la map des autres clients en leurs precisant juste ma position car
      // il ont deja toute les autres positions des autres clients (voir le foreach suivant)
      socket.broadcast.emit('ajouteClientSurMap', obj);
      // met a jour ma map de toutes les positions.
      // Ma position et celle des autres
      clientList.forEach(function(element, index) {
          var jsonString = clientList[index]
          var obj1 = Object.assign({id:index}, jsonString);
          socket.emit('ajouteClientSurMap', obj1);
      });
    };

    this.rand = function(low, high) {
      return Math.floor(Math.random() * (high - low + 1) + low)
    }

    this.clientExist = function(clientList){
      return (clientList !== undefined);
    }

    this.collide = function(clientList, id1, id2){

      if( id1 == id2) return false;

      if( this.clientExist(clientList[id1]) && this.clientExist(clientList[id2]) ){
        var collisionX  = (clientList.length > 3 && (clientList[id1].x+50) > clientList[id2].x &&  clientList[id1].x < (clientList[id2].x+50));
        var collisionY  = (clientList.length > 3 && (clientList[id1].y+50) > clientList[id2].y &&  clientList[id1].y < (clientList[id2].y+50));
        if( collisionX && collisionY){
          return true;
        }else{
          return false;
        }
      }else{
        return 0;
      }
    }

    this.sol = function(x,y){
      var styleCSS =  'background-color:#2F2;';
      global.counterID += 1;
      global.clientList[global.counterID] = {x:x ,y:y, type:'mapItem', css:styleCSS, collider:false};
    }
    this.mur = function(x,y,w,h){
      global.counterMapItemID++;
      elmDOM = {
        id: 'mapItem_'+global.counterMapItemID,
        x:x,
        y:y,
        w:w,
        h:h,
        rotate: 'matrix(1, 0, 0, 1, 0, 0)',
        css: 'background-image:url(http://127.0.0.1:5000/image/bbman-mur-gris.png);',
        classe: 'box map-item body',
        collider:true,
        trigger:false
      }
      global.game.map[global.counterMapItemID] = elmDOM;
    }
    this.piece = function(x,y,w,h){
      global.counterMapItemID++;
      elmDOM = {
        id: 'mapItem_'+global.counterMapItemID,
        x:x,
        y:y,
        w:w,
        h:h,
        rotate: 'matrix(1, 0, 0, 1, 0, 0)',
        css: 'background-color:wheat;border-radius:100%;box-shadow:2px 2px 10px black;',
        classe: 'box map-item trigger',
        collider:true,
        trigger:false
      }
      global.game.map[global.counterMapItemID] = elmDOM;
    }
    this.murCadreMap = function(caseSize,sizeW, sizeH){
      // bordure de mur top
      for(i=0; i < sizeW; i++){
        mur(caseSize*i,0,caseSize,caseSize);
      }

      // bordure de mur bottom
      for(i=0; i < sizeW; i++){
        mur(caseSize*i,caseSize*sizeH,caseSize,caseSize);
      }

      // bordure de mur left
      for(i=1; i < sizeH; i++){
        mur(0,caseSize*i,caseSize,caseSize);
      }
      // bordure de mur right
      for(i=1; i < sizeH; i++){
        mur(caseSize*(sizeW-1),caseSize*i,caseSize,caseSize);
      }
    }
    this.matriceMap = function(){
      var matrice = [];
      matrice[0]  = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
      matrice[1]  = [1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1];
      matrice[2]  = [1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1];
      matrice[3]  = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
      matrice[4]  = [1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1];
      matrice[5]  = [1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1];
      matrice[6]  = [1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1];
      matrice[7]  = [1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1];
      matrice[8]  = [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1];
      matrice[9]  = [1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1];
      matrice[10] = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
      matrice[11] = [1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1];
    }
}
