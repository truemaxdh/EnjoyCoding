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
    this.canvas = document.getElementById('game_canvas');
    this.container = this.canvas.parentElement;
    this.w = this.container.clientWidth;
    this.h = this.container.clientHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.ctx = this.canvas.getContext('2d');
    if (!this.fullScreen && 
          (window.innerWidth < this.container.clientWidth ||
           window.innerHeight < this.container.clientHeight)) {
            this.container.style.width = window.innerWidth + "px";
            this.container.style.height = window.innerHeight + "px";
            this.init();
    }
  },
  render : function() {
    gameObjects.render();
    this.ctx.drawImage(img_pause, 0, 0, 40, 40, this.w - 60, 20, 40, 40);
    ctx_game.fillStyle = '#ffa500';
    ctx_game.font = '35px Sniglet-ExtraBold';
    ctx_game.fillText('Score : ' + score, 20, 50);
    ctx_game.fillText('Stage : ' + stage, 270,50);
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


