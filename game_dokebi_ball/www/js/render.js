let img_pause = new Image();
let imgs = [img_pause];
const URLs = ['img/pause.png'];
let imagesOK = 0; 
for (var i=0; i<imgs.length; i++) {
    imgs[i].onload = function(){ 
        if (++imagesOK>=imgs.length ) {
            //draw_bg_canv();
        }
    };
    imgs[i].src = URLs[i];
}

let gameCanvas = {
  container : null,
  canvas : null,
  ctx : null,
  w : 0,
  h : 0,
  fullScreen : false,
  init : function() {
    this.canvas = document.getElementById('game_canvas_landscape');
    this.container = this.canvas.parentElement;
    this.w = this.container.clientWidth;
    this.h = this.container.clientHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.canvas.getContext('2d');
    
  },
  render : function() {
    // afterimage
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.w, this.h);

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
  },
  toggleFullScreen : function () {
    if (this.fullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      this.fullScreen = false;
    } else {
      if (this.canvas.requestFullscreen) {
        this.container.requestFullscreen();
      } else if (this.canvas.webkitRequestFullscreen) { /* Safari */
        this.container.webkitRequestFullscreen();
      } else if (this.canvas.msRequestFullscreen) { /* IE11 */
        this.container.msRequestFullscreen();
      }
      this.fullScreen = true;
    }
    setTimeout(()=>this.init(), 100);
  }
}


