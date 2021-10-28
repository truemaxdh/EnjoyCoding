var img_pause = new Image();
var imgs = [img_pause];
var URLs = ['img/pause.png'];

let gameCanvas = {
  canvas : null,
  ctx : null,
  w : 0,
  h : 0,
  init : function() {
    this.canvas = document.getElementById('game_canvas_landscape');
    this.ctx = this.canvas.getContext('2d');    
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    var imagesOK = 0; 
    for (var i=0; i<imgs.length; i++) {
        imgs[i].onload = function(){ 
            if (++imagesOK>=imgs.length ) {
                //draw_bg_canv();
            }
        };
        imgs[i].src = URLs[i];
    }
  },
  render : function() {
    // afterimage
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, 720, 540);

    gameObjects.render();
      
    this.ctx.fillStyle = '#ffa500';
    this.ctx.font = '35px Sniglet-ExtraBold';
    this.ctx.fillText('Score : ' + gamePlay.score, 20, 50);
    this.ctx.fillText('Stage : ' + gamePlay.stageNum, 270,50);
      
    this.ctx.drawImage(img_pause, 0, 0, 40, 40, this.w - 60, 20, 40, 40);

    if (!!gameObjects.oTouch) {
      gameObjects.oTouch.render();
      gameObjects.oTouch = null;
    }
  }
}


